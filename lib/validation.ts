import { z } from "zod"

export const mealTypeSchema = z.enum(["cafe", "almoco", "lanche", "jantar", "ceia"])

export const mealSchema = z.object({
  description: z.string().trim().min(2, "Informe a descricao do alimento.").max(80, "Use uma descricao mais curta."),
  calories: z.coerce.number().int("Informe um numero inteiro.").min(1, "As calorias devem ser maiores que zero.").max(20000, "Informe um valor menor."),
  mealType: mealTypeSchema,
  eatenAt: z.string().datetime("Informe uma data e hora validas."),
})

export const dailyGoalSchema = z.coerce
  .number()
  .int("Informe um numero inteiro.")
  .min(500, "A meta deve ter pelo menos 500 kcal.")
  .max(10000, "A meta deve ter no maximo 10000 kcal.")

export const fastTypeSchema = z.enum(["16:8", "18:6", "20:4", "24h", "custom"])

export const fastSchema = z.object({
  fastType: fastTypeSchema,
  plannedHours: z.coerce.number().min(1, "Informe pelo menos 1 hora.").max(72, "Informe ate 72 horas."),
})

export function plannedHoursFromType(fastType: z.infer<typeof fastTypeSchema>, customHours?: number) {
  if (fastType === "16:8") return 16
  if (fastType === "18:6") return 18
  if (fastType === "20:4") return 20
  if (fastType === "24h") return 24
  return customHours ?? 16
}

export function getValidationMessage(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? fallback
  if (error instanceof Error) return error.message
  return fallback
}
