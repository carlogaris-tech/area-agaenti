"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useApp } from "@/components/app-provider"

const NAV = [
  { href: "/dashboard", label: "Panoramica" },
  { href: "/dashboard/clienti", label: "Clienti" },
  { href: "/dashboard/pipeline", label: "Pipeline" },
  { href: "/dashboard/nuova-opportunita", label: "Nuova opportunita" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { agent, ready, logout } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (ready && !agent) router.replace("/")
  }, [ready, agent, router])

  if (!ready || !agent) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Caricamento area agenti...</p>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-8 bg-sidebar p-6 text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-card p-1.5">
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
            <small className="text-sidebar-muted">Area agenti</small>
          </span>
        </div>

        <nav className="grid gap-1.5 lg:grid-cols-1 sm:grid-cols-2 grid-cols-2">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-sidebar-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto grid gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 p-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
              {agent.initials}
            </span>
            <span className="leading-tight">
              <strong className="block text-sm">{agent.name}</strong>
              <small className="text-sidebar-muted">{agent.role}</small>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              router.replace("/")
            }}
            className="min-h-10 rounded-lg border border-white/10 px-3 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-white/5"
          >
            Esci
          </button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1200px] p-6 lg:p-8">{children}</main>
    </div>
  )
}
