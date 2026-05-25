import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/types"
import { dailyGoalSchema } from "@/lib/validation"

const COLLECTION = "profiles"

export async function getProfile(userId: string): Promise<UserProfile> {
  const snap = await getDoc(doc(db, COLLECTION, userId))
  if (!snap.exists()) {
    return { userId, dailyGoal: 2000, updatedAt: new Date().toISOString() }
  }
  return snap.data() as UserProfile
}

export async function saveProfile(userId: string, dailyGoal: number): Promise<void> {
  const parsedGoal = dailyGoalSchema.parse(dailyGoal)
  await setDoc(doc(db, COLLECTION, userId), {
    userId,
    dailyGoal: parsedGoal,
    updatedAt: new Date().toISOString(),
  })
}
