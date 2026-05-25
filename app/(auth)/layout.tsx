export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-3">
        {children}
        <p className="text-center text-xs text-gray-500">
          Este app e um exercicio academico e nao substitui orientacao medica ou nutricional.
        </p>
      </div>
    </div>
  )
}
