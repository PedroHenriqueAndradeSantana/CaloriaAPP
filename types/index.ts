export type MealType = "cafe" | "almoco" | "lanche" | "jantar" | "ceia"

export type FastType = "16:8" | "18:6" | "20:4" | "24h" | "custom"

export interface Meal {
  id: string
  userId: string
  description: string
  calories: number
  mealType: MealType
  eatenAt: string // ISO string
  createdAt: string
}

export interface Fast {
  id: string
  userId: string
  startedAt: string // ISO string
  endedAt: string | null
  fastType: FastType
  plannedHours: number
  createdAt: string
}

export interface UserProfile {
  userId: string
  dailyGoal: number
  updatedAt: string
}
