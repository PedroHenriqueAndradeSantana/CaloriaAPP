"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getMealsByDate, addMeal, updateMeal, deleteMeal } from "@/lib/meals"
import { Meal, MealType } from "@/types"
import { MEAL_LABELS, todayISO, formatTime, toDateTimeLocalInput } from "@/lib/utils"
import { getValidationMessage } from "@/lib/validation"

const mealTypes: MealType[] = ["cafe", "almoco", "lanche", "jantar", "ceia"]
const emptyForm = { description: "", calories: "", mealType: "almoco" as MealType, eatenAt: "" }

export default function MealsPage() {
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [date, setDate] = useState(todayISO())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Meal | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async function load() {
    if (!user) return
    setLoading(true)
    setError("")
    try {
      const data = await getMealsByDate(user.uid, date)
      setMeals(data)
    } catch {
      setError("Nao foi possivel carregar as refeicoes.")
    } finally {
      setLoading(false)
    }
  }, [user, date])

  useEffect(() => {
    load()
  }, [load])

  function openAdd() {
    setEditing(null)
    setError("")
    setForm({ ...emptyForm, eatenAt: toDateTimeLocalInput() })
    setShowForm(true)
  }

  function openEdit(meal: Meal) {
    setEditing(meal)
    setError("")
    setForm({
      description: meal.description,
      calories: String(meal.calories),
      mealType: meal.mealType,
      eatenAt: toDateTimeLocalInput(meal.eatenAt),
    })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError("")

    try {
      const payload = {
        description: form.description.trim(),
        calories: Number(form.calories),
        mealType: form.mealType,
        eatenAt: new Date(form.eatenAt).toISOString(),
      }

      if (editing) await updateMeal(editing.id, payload)
      else await addMeal(user.uid, payload)

      setShowForm(false)
      await load()
    } catch (err) {
      setError(getValidationMessage(err, "Nao foi possivel salvar a refeicao."))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setError("")
    try {
      await deleteMeal(id)
      setDeleteId(null)
      await load()
    } catch {
      setError("Nao foi possivel excluir a refeicao.")
    }
  }

  const total = meals.reduce((s, m) => s + m.calories, 0)

  return (
    <div className="space-y-4">
      {/* Secao: cabecalho e filtro */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Refeicoes</h1>
        <button onClick={openAdd} className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700">
          Adicionar
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600" htmlFor="date">Data:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {meals.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          Total do dia: {total} kcal
        </div>
      )}

      {/* Secao: lista de refeicoes */}
      {loading ? (
        <p className="py-8 text-center text-gray-400">Carregando...</p>
      ) : meals.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p className="text-sm">Nenhuma refeicao registrada neste dia.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {meals.map((meal) => (
            <div key={meal.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <p className="font-medium text-gray-900">{meal.description}</p>
                <p className="mt-0.5 text-xs text-gray-400">{MEAL_LABELS[meal.mealType]} - {formatTime(meal.eatenAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-bold text-gray-700">{meal.calories} kcal</span>
                <button onClick={() => openEdit(meal)} className="text-xs text-blue-600 hover:underline">Editar</button>
                <button onClick={() => setDeleteId(meal.id)} className="text-xs text-red-500 hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Secao: formulario de cadastro e edicao */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Editar refeicao" : "Nova refeicao"}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="description">Alimento</label>
                <input
                  id="description"
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Ex: Arroz com feijao"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="calories">Calorias (kcal)</label>
                <input
                  id="calories"
                  type="number"
                  required
                  min="1"
                  value={form.calories}
                  onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                  placeholder="Ex: 350"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="mealType">Tipo de refeicao</label>
                <select
                  id="mealType"
                  value={form.mealType}
                  onChange={(e) => setForm((f) => ({ ...f, mealType: e.target.value as MealType }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {mealTypes.map((t) => <option key={t} value={t}>{MEAL_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="eatenAt">Data e hora</label>
                <input
                  id="eatenAt"
                  type="datetime-local"
                  required
                  value={form.eatenAt}
                  onChange={(e) => setForm((f) => ({ ...f, eatenAt: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-green-600 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50">
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secao: confirmacao de exclusao */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center">
            <p className="mb-2 text-lg font-bold text-gray-900">Excluir refeicao?</p>
            <p className="mb-5 text-sm text-gray-500">Esta acao nao pode ser desfeita.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-lg bg-red-500 py-2 text-sm text-white hover:bg-red-600">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
