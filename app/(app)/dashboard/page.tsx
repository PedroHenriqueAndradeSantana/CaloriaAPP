"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { getMealsByDate } from "@/lib/meals"
import { getProfile } from "@/lib/profile"
import { getActiveFast } from "@/lib/fasts"
import { Meal, Fast } from "@/types"
import { MEAL_LABELS, FAST_LABELS, formatDateTime, formatElapsedDuration, todayISO } from "@/lib/utils"
import { plannedHoursFromType } from "@/lib/validation"

export default function DashboardPage() {
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [goal, setGoal] = useState(2000)
  const [activeFast, setActiveFast] = useState<Fast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    if (!user) return
    setError("")
    Promise.all([
      getMealsByDate(user.uid, todayISO()),
      getProfile(user.uid),
      getActiveFast(user.uid),
    ])
      .then(([m, p, f]) => {
        setMeals(m)
        setGoal(p.dailyGoal)
        setActiveFast(f)
      })
      .catch(() => setError("Nao foi possivel carregar o dashboard."))
      .finally(() => setLoading(false))
  }, [user])

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

  const totalCal = meals.reduce((s, m) => s + m.calories, 0)
  const pct = Math.min(100, Math.round((totalCal / goal) * 100))
  const remaining = goal - totalCal
  const plannedHours = activeFast ? activeFast.plannedHours ?? plannedHoursFromType(activeFast.fastType) : 0

  if (loading) return <div className="py-10 text-center text-gray-400">Carregando...</div>

  return (
    <div className="space-y-4">
      {/* Secao: resumo do dia */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inicio</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* Secao: meta calorica */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Meta calorica</h2>
          <span className="text-sm text-gray-500">{goal} kcal</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100">
          <div className={`h-3 rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-gray-600"><strong>{totalCal}</strong> kcal consumidas</span>
          <span className={remaining < 0 ? "font-medium text-red-500" : "text-gray-500"}>
            {remaining < 0 ? `${Math.abs(remaining)} kcal acima` : `${remaining} kcal restantes`}
          </span>
        </div>
      </div>

      {/* Secao: jejum ativo */}
      {activeFast ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-green-800">Jejum em andamento</h2>
              <p className="mt-1 text-sm text-green-600">Tipo: {FAST_LABELS[activeFast.fastType]}</p>
              <p className="mt-2 text-2xl font-bold text-green-700">{elapsed}</p>
              <p className="mt-1 text-xs text-green-500">Planejado: {plannedHours}h - iniciado em {formatDateTime(activeFast.startedAt)}</p>
            </div>
            <Link href="/fasting" className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">Encerrar</Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div>
            <h2 className="font-semibold text-gray-700">Sem jejum ativo</h2>
            <p className="mt-0.5 text-sm text-gray-400">Inicie um ciclo de jejum</p>
          </div>
          <Link href="/fasting" className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-900">Iniciar</Link>
        </div>
      )}

      {/* Secao: refeicoes de hoje */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Refeicoes de hoje</h2>
          <Link href="/meals" className="text-sm text-green-600 hover:underline">Ver todas</Link>
        </div>
        {meals.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">Nenhuma refeicao registrada hoje.</p>
        ) : (
          <div className="space-y-2">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b border-gray-50 py-1.5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.description}</p>
                  <p className="text-xs text-gray-400">{MEAL_LABELS[m.mealType]}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
        <Link href="/meals" className="mt-3 block rounded-lg bg-green-600 py-2 text-center text-sm text-white transition hover:bg-green-700">
          Adicionar refeicao
        </Link>
      </div>
    </div>
  )
}
