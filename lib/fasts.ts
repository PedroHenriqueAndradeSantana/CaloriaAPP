import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Fast, FastType } from "@/types"
import { fastSchema, plannedHoursFromType } from "@/lib/validation"

const COLLECTION = "fasts"

export async function startFast(userId: string, fastType: FastType, customHours?: number): Promise<string> {
  const activeFast = await getActiveFast(userId)
  if (activeFast) throw new Error("Ja existe um jejum em andamento.")

  const plannedHours = plannedHoursFromType(fastType, customHours)
  const parsed = fastSchema.parse({ fastType, plannedHours })
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    ...parsed,
    startedAt: new Date().toISOString(),
    endedAt: null,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function endFast(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    endedAt: new Date().toISOString(),
  })
}

export async function getActiveFast(userId: string): Promise<Fast | null> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  )
  const snap = await getDocs(q)
  const active = snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Fast))
    .find((fast) => fast.endedAt === null)

  return active ?? null
}

export async function getFastHistory(userId: string): Promise<Fast[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Fast))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export async function getFastsLast7Days(userId: string): Promise<Fast[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Fast))
    .filter((fast) => fast.startedAt >= sevenDaysAgo.toISOString())
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
}
