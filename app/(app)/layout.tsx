"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/meals", label: "Refeicoes" },
  { href: "/fasting", label: "Jejum" },
  { href: "/weekly", label: "Semana" },
  { href: "/settings", label: "Config" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-gray-400">Carregando...</p></div>
  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Secao: cabecalho autenticado */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-green-600">CaloriaApp</span>
          <button onClick={() => signOut(auth).then(() => router.push("/login"))} className="text-sm text-gray-500 transition hover:text-red-500">
            Sair
          </button>
        </div>
      </header>

      {/* Secao: conteudo principal */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>

      {/* Secao: navegacao principal */}
      <nav className="sticky bottom-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex-1 py-3 text-center text-xs transition ${pathname === item.href ? "font-medium text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Secao: aviso etico */}
      <div className="border-t border-yellow-200 bg-yellow-50 px-4 py-2 text-center text-xs text-yellow-700">
        Este app nao substitui orientacao medica ou nutricional.
      </div>
    </div>
  )
}
