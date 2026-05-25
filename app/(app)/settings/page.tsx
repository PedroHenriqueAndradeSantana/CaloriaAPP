"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getProfile, saveProfile } from "@/lib/profile"
import { getValidationMessage } from "@/lib/validation"

export default function SettingsPage() {
  const { user } = useAuth()
  const [goal, setGoal] = useState(2000)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return
    setError("")
    getProfile(user.uid)
      .then((p) => setGoal(p.dailyGoal))
      .catch(() => setError("Nao foi possivel carregar suas configuracoes."))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaved(false)
    setError("")
    try {
      await saveProfile(user.uid, goal)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(getValidationMessage(err, "Nao foi possivel salvar a meta."))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Carregando...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Configuracoes</h1>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* Secao: meta calorica diaria */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-800">Meta calorica diaria</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="goal">
              Calorias por dia (kcal)
            </label>
            <input
              id="goal"
              type="number"
              min="500"
              max="10000"
              required
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="mt-1 text-xs text-gray-400">Valor padrao inicial: 2000 kcal.</p>
          </div>
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
            {saving ? "Salvando..." : saved ? "Salvo" : "Salvar meta"}
          </button>
        </form>
      </div>

      {/* Secao: conta */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 font-semibold text-gray-800">Conta</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Secao: aviso etico exigido pelo trabalho */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-xs text-yellow-700">
          Aviso: este aplicativo e apenas um exercicio academico e nao substitui orientacao medica ou nutricional profissional.
        </p>
      </div>
    </div>
  )
}
