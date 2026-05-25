"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getActiveFast, startFast, endFast, getFastHistory } from "@/lib/fasts"
import { Fast, FastType } from "@/types"
import { FAST_LABELS, formatDateTime, calcDurationHours, formatElapsedDuration } from "@/lib/utils"
import { getValidationMessage, plannedHoursFromType } from "@/lib/validation"

const fastTypes: FastType[] = ["16:8", "18:6", "20:4", "24h", "custom"]

export default function FastingPage() {
  const { user } = useAuth()
  const [activeFast, setActiveFast] = useState<Fast | null>(null)
  const [history, setHistory] = useState<Fast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState<FastType>("16:8")
  const [customHours, setCustomHours] = useState("16")
  const [elapsed, setElapsed] = useState("")
  const [acting, setActing] = useState(false)

  const load = useCallback(async function load() {
    if (!user) return
    setError("")
    try {
      const [active, hist] = await Promise.all([getActiveFast(user.uid), getFastHistory(user.uid)])
      setActiveFast(active)
      setHistory(hist.filter((f) => f.endedAt))
    } catch {
      setError("Nao foi possivel carregar os jejuns.")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!activeFast) {
      setElapsed("")
      return
    }

    const tick = () => {
      setElapsed(formatElapsedDuration(activeFast.startedAt))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeFast])

  async function handleStart() {
    if (!user) return
    setActing(true)
    setError("")
    try {
      const hours = selectedType === "custom" ? Number(customHours) : undefined
      await startFast(user.uid, selectedType, hours)
      await load()
    } catch (err) {
      setError(getValidationMessage(err, "Nao foi possivel iniciar o jejum."))
    } finally {
      setActing(false)
    }
  }

  async function handleEnd() {
    if (!activeFast) return
    setActing(true)
    setError("")
    try {
      await endFast(activeFast.id)
      await load()
    } catch {
      setError("Nao foi possivel encerrar o jejum.")
    } finally {
      setActing(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Carregando...</div>

  const plannedHours = activeFast
    ? activeFast.plannedHours ?? plannedHoursFromType(activeFast.fastType)
    : plannedHoursFromType(selectedType, Number(customHours))

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Jejum Intermitente</h1>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* Secao: jejum ativo ou inicio de novo ciclo */}
      {activeFast ? (
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-sm font-medium text-green-600">Jejum em andamento - {FAST_LABELS[activeFast.fastType]}</p>
          <p className="text-5xl font-bold text-green-700">{elapsed}</p>
          <p className="text-xs text-green-600">Planejado: {plannedHours}h</p>
          <p className="text-xs text-green-500">Iniciado em {formatDateTime(activeFast.startedAt)}</p>
          <button onClick={handleEnd} disabled={acting} className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50">
            {acting ? "Encerrando..." : "Encerrar jejum"}
          </button>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-800">Iniciar novo jejum</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de jejum</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {fastTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${selectedType === t ? "border-green-600 bg-green-600 text-white" : "border-gray-200 text-gray-700 hover:border-green-400"}`}
                >
                  {FAST_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {selectedType === "custom" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="customHours">Horas planejadas</label>
              <input
                id="customHours"
                type="number"
                min="1"
                max="72"
                required
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <button onClick={handleStart} disabled={acting} className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
            {acting ? "Iniciando..." : "Iniciar jejum agora"}
          </button>
        </div>
      )}

      {/* Secao: historico de jejuns */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-gray-800">Historico de jejuns</h2>
        {history.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">Nenhum jejum concluido ainda.</p>
        ) : (
          <div className="space-y-2">
            {history.map((f) => (
              <div key={f.id} className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{FAST_LABELS[f.fastType]}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(f.startedAt)}</p>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {f.endedAt ? `${calcDurationHours(f.startedAt, f.endedAt)}h` : "-"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
