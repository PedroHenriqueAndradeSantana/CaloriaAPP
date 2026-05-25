import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR")
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)} ${formatTime(iso)}`
}

export function calcDurationHours(startedAt: string, endedAt: string): number {
  const diff = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  return Math.round((diff / 1000 / 60 / 60) * 10) / 10
}

export function formatElapsedDuration(startedAt: string, endedAt: string | Date = new Date()) {
  const end = typeof endedAt === "string" ? new Date(endedAt) : endedAt
  const diffMs = Math.max(0, end.getTime() - new Date(startedAt).getTime())
  const totalMinutes = Math.floor(diffMs / 1000 / 60)
  const hrs = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return `${hrs}h ${mins}min`
}

export function localDateISO(value: string | Date = new Date()) {
  const date = typeof value === "string" ? new Date(value) : value
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().split("T")[0]
}

export function todayISO() {
  return localDateISO()
}

export function toDateTimeLocalInput(value: string | Date = new Date()) {
  const date = typeof value === "string" ? new Date(value) : value
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function getLocalDayRangeISO(date: string) {
  const start = new Date(`${date}T00:00:00`)
  const end = new Date(`${date}T23:59:59.999`)
  return { start: start.toISOString(), end: end.toISOString() }
}

export const MEAL_LABELS: Record<string, string> = {
  cafe: "Cafe da manha",
  almoco: "Almoco",
  lanche: "Lanche",
  jantar: "Jantar",
  ceia: "Ceia",
}

export const FAST_LABELS: Record<string, string> = {
  "16:8": "16:8 (16h de jejum)",
  "18:6": "18:6 (18h de jejum)",
  "20:4": "20:4 (20h de jejum)",
  "24h": "24 horas",
  custom: "Personalizado",
}
