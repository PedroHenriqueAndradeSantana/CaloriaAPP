"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

function getFirebaseCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code)
  }
  return ""
}

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("As senhas nao coincidem.")
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err) {
      if (getFirebaseCode(err) === "auth/email-already-in-use") setError("Este e-mail ja esta cadastrado.")
      else setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Secao: apresentacao do cadastro */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="mt-1 text-sm text-gray-500">Comece a acompanhar sua alimentacao.</p>
      </div>

      {/* Secao: formulario de cadastro */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Senha</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirm">Confirmar senha</label>
          <input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Ja tem conta? <Link href="/login" className="text-green-600 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
