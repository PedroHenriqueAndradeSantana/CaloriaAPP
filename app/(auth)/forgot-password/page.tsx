"use client"

import { useState } from "react"
import Link from "next/link"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch {
      setError("Nao foi possivel enviar o e-mail de recuperacao.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Secao: recuperacao de senha */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Recuperar senha</h1>
      </div>

      {sent ? (
        <div className="space-y-4 text-center">
          <p className="font-medium text-green-600">E-mail enviado.</p>
          <p className="text-sm text-gray-500">Verifique sua caixa de entrada e siga as instrucoes.</p>
          <Link href="/login" className="text-sm text-green-600 hover:underline">Voltar ao login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">E-mail cadastrado</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar e-mail"}
          </button>
          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="text-green-600 hover:underline">Voltar ao login</Link>
          </p>
        </form>
      )}
    </div>
  )
}
