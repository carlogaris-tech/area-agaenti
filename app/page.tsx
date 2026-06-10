"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useApp } from "@/components/app-provider"

export default function LoginPage() {
  const { agent, ready, login } = useApp()
  const router = useRouter()
  const [email, setEmail] = useState("agente@officina.tech")
  const [password, setPassword] = useState("password-demo")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (ready && agent) router.replace("/dashboard")
  }, [ready, agent, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = login(email, password)
    if (result.ok) {
      router.replace("/dashboard")
    } else {
      setError(result.error ?? "Credenziali non valide.")
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <section className="relative hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-card p-1.5">
            <Image
              src="/officina-tech-logo.png"
              alt="Officina.tech"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="leading-tight">
            <strong className="block text-lg">Officina.tech</strong>
            <small className="text-sidebar-muted">Area agenti</small>
          </span>
        </div>

        <div className="max-w-md">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Portale vendite
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight">
            Dal dato alla proposta creativa, in un unico spazio.
          </h1>
          <p className="mt-4 leading-relaxed text-sidebar-muted">
            Gestisci clienti, analisi SEO e social, scoring del potenziale e
            pipeline commerciale. Tutto pensato per chi vende sul campo.
          </p>
        </div>

        <ul className="grid gap-3 text-sm text-sidebar-muted">
          <li className="flex items-center gap-2">
            <Dot /> Audit SEO avanzati con Semrush
          </li>
          <li className="flex items-center gap-2">
            <Dot /> Analisi social e benchmark competitor
          </li>
          <li className="flex items-center gap-2">
            <Dot /> Scoring del potenziale e proposta guidata
          </li>
        </ul>
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-sidebar p-1.5">
              <Image
                src="/officina-tech-logo.png"
                alt="Officina.tech"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="leading-tight">
              <strong className="block">Officina.tech</strong>
              <small className="text-muted-foreground">Area agenti</small>
            </span>
          </div>

          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Accesso riservato
          </p>
          <h2 className="mt-2 text-2xl font-bold">Entra nell&apos;area agenti</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Inserisci le tue credenziali per accedere al portale vendite.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-muted-foreground">
              Email agente
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="min-h-11 rounded-lg border border-input bg-card px-3 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-muted-foreground">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="min-h-11 rounded-lg border border-input bg-card px-3 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 rounded-lg bg-primary px-4 font-bold text-primary-foreground transition-colors hover:bg-[#0b4f4a] disabled:opacity-70"
            >
              {submitting ? "Accesso in corso..." : "Entra"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">
            <p className="font-semibold">Credenziali demo</p>
            <p className="mt-1 text-muted-foreground">
              agente@officina.tech &middot; password-demo
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
}
