"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"
import { useAuth } from "@/contexts/AuthContext"
import { getMealsLast7Days } from "@/lib/meals"
import { getFastsLast7Days } from "@/lib/fasts"
import { getProfile } from "@/lib/profile"
import { calcDurationHours, localDateISO, todayISO } from "@/lib/utils"

function getLast7Days() {
  const today = new Date(`${todayISO()}T00:00:00`)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return localDateISO(d)
  })
}

export default function WeeklyPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [calorieData, setCalorieData] = useState<{ day: string; calorias: number }[]>([])
  const [fastData, setFastData] = useState<{ day: string; horas: number }[]>([])
  const [goal, setGoal] = useState(2000)
  const [stats, setStats] = useState({ avgCal: 0, totalFasts: 0, avgFastH: 0 })

  useEffect(() => {
    if (!user) return
    setError("")
    Promise.all([getMealsLast7Days(user.uid), getFastsLast7Days(user.uid), getProfile(user.uid)])
      .then(([meals, fasts, profile]) => {
        const days = getLast7Days()
        setGoal(profile.dailyGoal)

        // Secao: calorias por dia.
        const calMap: Record<string, number> = {}
        days.forEach((d) => { calMap[d] = 0 })
        meals.forEach((m) => {
          const day = localDateISO(m.eatenAt)
          if (calMap[day] !== undefined) calMap[day] += m.calories
        })
        setCalorieData(days.map((d) => ({ day: d.slice(5), calorias: calMap[d] })))

        // Secao: horas de jejum por dia.
        const fastMap: Record<string, number> = {}
        days.forEach((d) => { fastMap[d] = 0 })
        fasts.filter((f) => f.endedAt).forEach((f) => {
          const day = localDateISO(f.startedAt)
          if (fastMap[day] !== undefined) fastMap[day] += calcDurationHours(f.startedAt, f.endedAt!)
        })
        setFastData(days.map((d) => ({ day: d.slice(5), horas: Math.round(fastMap[d] * 10) / 10 })))

        // Secao: indicadores agregados da semana.
        const completedFasts = fasts.filter((f) => f.endedAt)
        const avgFastH = completedFasts.length > 0
          ? Math.round((completedFasts.reduce((s, f) => s + calcDurationHours(f.startedAt, f.endedAt!), 0) / completedFasts.length) * 10) / 10
          : 0
        setStats({
          avgCal: Math.round(Object.values(calMap).reduce((a, b) => a + b, 0) / 7),
          totalFasts: completedFasts.length,
          avgFastH,
        })
      })
      .catch(() => setError("Nao foi possivel carregar o resumo semanal."))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <div className="py-10 text-center text-gray-400">Carregando...</div>

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Resumo Semanal</h1>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* Secao: indicadores */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { label: "Media diaria", value: `${stats.avgCal} kcal` },
          { label: "Jejuns concluidos", value: stats.totalFasts },
          { label: "Media jejum", value: `${stats.avgFastH}h` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Secao: grafico de calorias */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-800">Calorias por dia</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={calorieData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <ReferenceLine y={goal} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Meta", position: "right", fontSize: 10, fill: "#ef4444" }} />
            <Bar dataKey="calorias" fill="#16a34a" radius={[4, 4, 0, 0]} name="Calorias" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Secao: grafico de jejum */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-800">Horas de jejum por dia</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={fastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="horas" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Horas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
