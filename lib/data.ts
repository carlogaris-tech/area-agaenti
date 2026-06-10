export type DealStatus =
  | "Bozza interna"
  | "Da proporre"
  | "Proposta inviata"
  | "In trattativa"
  | "Vinto"
  | "Perso"

export type Agent = {
  email: string
  password: string
  name: string
  initials: string
  role: string
}

export type Client = {
  id: string
  company: string
  contact: string
  email: string
  phone: string
  sector: string
  province: string
  website: string
  goal: string
  status: DealStatus
  budget: string
  score: number
  webScore: number
  socialScore: number
  strategyScore: number
  updatedAt: string
  nextAction: string
  agent: string
}

// Demo agents (sample data, not a real auth backend)
export const AGENTS: Agent[] = [
  {
    email: "agente@officina.tech",
    password: "password-demo",
    name: "Alessandro Conti",
    initials: "AC",
    role: "Agente commerciale",
  },
  {
    email: "giulia.ferri@officina.tech",
    password: "password-demo",
    name: "Giulia Ferri",
    initials: "GF",
    role: "Agente senior",
  },
]

export const SECTORS = [
  "Ristorazione",
  "Turismo",
  "Commercio locale",
  "Eventi e cultura",
  "Servizi B2B",
  "Altro",
]

export const GOALS = [
  "Portare nuovi contatti",
  "Aumentare prenotazioni",
  "Vendere prodotti o servizi",
  "Migliorare reputazione online",
  "Preparare una campagna stagionale",
]

export const STATUSES: DealStatus[] = [
  "Bozza interna",
  "Da proporre",
  "Proposta inviata",
  "In trattativa",
  "Vinto",
  "Perso",
]

export const BUDGETS = [
  "Da definire",
  "Fino a 1.000 euro",
  "1.000 - 3.000 euro",
  "3.000 - 7.000 euro",
  "Oltre 7.000 euro",
]

export const SAMPLE_CLIENTS: Client[] = [
  {
    id: "cli-001",
    company: "Ristorante La Piazza",
    contact: "Marco Bianchi",
    email: "info@lapiazza.it",
    phone: "+39 011 555 1234",
    sector: "Ristorazione",
    province: "Torino",
    website: "https://www.lapiazza.it",
    goal: "Aumentare prenotazioni",
    status: "In trattativa",
    budget: "3.000 - 7.000 euro",
    score: 78,
    webScore: 72,
    socialScore: 81,
    strategyScore: 80,
    updatedAt: "2026-06-05",
    nextAction: "Inviare proposta con landing prenotazioni e campagne locali",
    agent: "agente@officina.tech",
  },
  {
    id: "cli-002",
    company: "Hotel Belvedere",
    contact: "Sara Rossi",
    email: "direzione@hotelbelvedere.it",
    phone: "+39 0184 22 33 44",
    sector: "Turismo",
    province: "Imperia",
    website: "https://www.hotelbelvedere.it",
    goal: "Portare nuovi contatti",
    status: "Proposta inviata",
    budget: "Oltre 7.000 euro",
    score: 85,
    webScore: 88,
    socialScore: 79,
    strategyScore: 88,
    updatedAt: "2026-06-03",
    nextAction: "Follow-up telefonico sulla proposta SEO + Ads stagionali",
    agent: "agente@officina.tech",
  },
  {
    id: "cli-003",
    company: "Boutique Aurora",
    contact: "Elena Conti",
    email: "shop@boutiqueaurora.it",
    phone: "+39 02 998 7766",
    sector: "Commercio locale",
    province: "Milano",
    website: "https://www.boutiqueaurora.it",
    goal: "Vendere prodotti o servizi",
    status: "Da proporre",
    budget: "1.000 - 3.000 euro",
    score: 61,
    webScore: 55,
    socialScore: 70,
    strategyScore: 58,
    updatedAt: "2026-06-01",
    nextAction: "Preparare audit Semrush e benchmark competitor",
    agent: "agente@officina.tech",
  },
  {
    id: "cli-004",
    company: "Cantina Vigne Antiche",
    contact: "Paolo Verdi",
    email: "vendite@vigneantiche.it",
    phone: "+39 0432 11 22 33",
    sector: "Servizi B2B",
    province: "Udine",
    website: "https://www.vigneantiche.it",
    goal: "Preparare una campagna stagionale",
    status: "Vinto",
    budget: "3.000 - 7.000 euro",
    score: 90,
    webScore: 86,
    socialScore: 92,
    strategyScore: 92,
    updatedAt: "2026-05-28",
    nextAction: "Avvio progetto: kickoff e calendario contenuti",
    agent: "agente@officina.tech",
  },
  {
    id: "cli-005",
    company: "Studio Dentistico Sorriso",
    contact: "Laura Neri",
    email: "info@studiosorriso.it",
    phone: "+39 06 444 5566",
    sector: "Servizi B2B",
    province: "Roma",
    website: "",
    goal: "Portare nuovi contatti",
    status: "Bozza interna",
    budget: "Da definire",
    score: 34,
    webScore: 25,
    socialScore: 30,
    strategyScore: 47,
    updatedAt: "2026-05-30",
    nextAction: "Recuperare URL sito e canali social per avviare analisi",
    agent: "agente@officina.tech",
  },
  {
    id: "cli-006",
    company: "Teatro Comunale Eventi",
    contact: "Davide Galli",
    email: "marketing@teatroeventi.it",
    phone: "+39 051 77 88 99",
    sector: "Eventi e cultura",
    province: "Bologna",
    website: "https://www.teatroeventi.it",
    goal: "Migliorare reputazione online",
    status: "Perso",
    budget: "1.000 - 3.000 euro",
    score: 52,
    webScore: 60,
    socialScore: 48,
    strategyScore: 48,
    updatedAt: "2026-05-20",
    nextAction: "Ricontattare a settembre per nuova stagione",
    agent: "agente@officina.tech",
  },
]

export function statusTone(status: DealStatus): {
  bg: string
  text: string
} {
  switch (status) {
    case "Vinto":
      return { bg: "bg-accent", text: "text-accent-foreground" }
    case "Perso":
      return { bg: "bg-destructive/10", text: "text-destructive" }
    case "In trattativa":
      return { bg: "bg-primary/10", text: "text-primary" }
    case "Proposta inviata":
      return { bg: "bg-[#fdf3e2]", text: "text-amber" }
    case "Da proporre":
      return { bg: "bg-secondary", text: "text-secondary-foreground" }
    default:
      return { bg: "bg-secondary", text: "text-muted-foreground" }
  }
}
