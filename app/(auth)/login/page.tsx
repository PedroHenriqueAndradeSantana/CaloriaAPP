"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch {
      setError("E-mail ou senha invalidos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Secao: apresentacao do login */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">CaloriaApp</h1>
        <p className="mt-1 text-sm text-gray-500">Acompanhe calorias e ciclos de jejum.</p>
      </div>

      {/* Secao: formulario de entrada */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Senha</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-4 space-y-2 text-center">
        <Link href="/forgot-password" className="block text-sm text-green-600 hover:underline">Esqueci minha senha</Link>
        <p className="text-sm text-gray-500">Nao tem conta? <Link href="/register" className="text-green-600 hover:underline">Cadastre-se</Link></p>
      </div>
    </div>
  )
}
