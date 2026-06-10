"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { AGENTS, SAMPLE_CLIENTS, type Agent, type Client } from "@/lib/data"

type AppState = {
  agent: Agent | null
  clients: Client[]
  ready: boolean
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  addClient: (client: Client) => void
}

const AppContext = createContext<AppState | null>(null)

const SESSION_KEY = "officina-area-agenti-session"
const CLIENTS_KEY = "officina-area-agenti-clients"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [clients, setClients] = useState<Client[]>(SAMPLE_CLIENTS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem(SESSION_KEY)
      if (storedSession) {
        const email = JSON.parse(storedSession) as string
        const found = AGENTS.find((a) => a.email === email)
        if (found) setAgent(found)
      }
      const storedClients = sessionStorage.getItem(CLIENTS_KEY)
      if (storedClients) {
        setClients(JSON.parse(storedClients) as Client[])
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  const persistClients = useCallback((next: Client[]) => {
    setClients(next)
    try {
      sessionStorage.setItem(CLIENTS_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }, [])

  const login = useCallback((email: string, password: string) => {
    const found = AGENTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!found) return { ok: false, error: "Email non riconosciuta." }
    if (found.password !== password) return { ok: false, error: "Password errata." }
    setAgent(found)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(found.email))
    } catch {
      // ignore
    }
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setAgent(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  const addClient = useCallback(
    (client: Client) => {
      persistClients([client, ...clients])
    },
    [clients, persistClients],
  )

  return (
    <AppContext.Provider value={{ agent, clients, ready, login, logout, addClient }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
