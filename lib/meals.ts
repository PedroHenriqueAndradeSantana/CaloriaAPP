import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Meal, MealType } from "@/types"
import { getLocalDayRangeISO } from "@/lib/utils"
import { mealSchema } from "@/lib/validation"

const COLLECTION = "meals"

export async function addMeal(
  userId: string,
  data: { description: string; calories: number; mealType: MealType; eatenAt: string }
): Promise<string> {
  const parsed = mealSchema.parse(data)
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    ...parsed,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateMeal(
  id: string,
  data: Partial<{ description: string; calories: number; mealType: MealType; eatenAt: string }>
): Promise<void> {
  const parsed = mealSchema.partial().parse(data)
  await updateDoc(doc(db, COLLECTION, id), parsed)
}

export async function deleteMeal(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function getMealsByDate(userId: string, date: string): Promise<Meal[]> {
  // Secao: filtro do dia selecionado no fuso local do navegador.
  const { start, end } = getLocalDayRangeISO(date)

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  )

  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Meal))
    .filter((meal) => meal.eatenAt >= start && meal.eatenAt <= end)
    .sort((a, b) => a.eatenAt.localeCompare(b.eatenAt))
}

export async function getMealsLast7Days(userId: string): Promise<Meal[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  )

  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Meal))
    .filter((meal) => meal.eatenAt >= sevenDaysAgo.toISOString())
    .sort((a, b) => a.eatenAt.localeCompare(b.eatenAt))
}
