export type ScoreInput = {
  website: string
  hasWebsite: boolean
  needsSeo: boolean
  keywordGap: boolean
  competitorBenchmark: boolean
  needsMobile: boolean
  needsTracking: boolean
  localSeo: boolean
  contentOpportunity: boolean
  organicTraffic: number
  seoKeywords: number
  competitors: string
  webNotes: string
  instagram: string
  facebook: string
  linkedin: string
  instagramFollowers: number
  facebookFollowers: number
  linkedinFollowers: number
  instagramPosts: number
  facebookEngagement: number
  linkedinPosts: number
  company: string
  contact: string
  email: string
  phone: string
  province: string
  services: string[]
  budget: string
  priority: string
  goal: string
  dataInsight: string
  brandNarrative: string
  aiUse: string
  campaignType: string
}

function clamp(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function hasUrl(text: string) {
  return text.startsWith("http://") || text.startsWith("https://")
}

export type Scores = {
  web: number
  social: number
  strategy: number
  total: number
}

export function getScores(input: ScoreInput): Scores {
  let web = 12
  let social = 10
  let strategy = 18

  if (hasUrl(input.website)) web += 22
  if (input.hasWebsite) web += 12
  if (input.needsSeo) web += 18
  if (input.keywordGap) web += 12
  if (input.competitorBenchmark) web += 12
  if (input.needsMobile) web += 12
  if (input.needsTracking) web += 14
  if (input.localSeo) web += 10
  if (input.contentOpportunity) web += 10
  if (input.organicTraffic > 0) web += 8
  if (input.seoKeywords > 0) web += 8
  if (input.competitors.trim()) web += 8
  if (input.webNotes.trim().length > 20) web += 10

  const socialLinks = [input.instagram, input.facebook, input.linkedin].filter(hasUrl).length
  const followers =
    input.instagramFollowers + input.facebookFollowers + input.linkedinFollowers
  const activity =
    input.instagramPosts + input.facebookEngagement + input.linkedinPosts

  social += socialLinks * 16
  social += Math.min(22, Math.floor(followers / 250))
  social += Math.min(20, activity * 3)

  if (input.company.trim()) strategy += 10
  if (input.contact.trim()) strategy += 8
  if (input.email.trim()) strategy += 8
  if (input.phone.trim()) strategy += 6
  if (input.province.trim()) strategy += 6
  strategy += input.services.length * 7
  if (input.budget !== "Da definire") strategy += 10
  if (input.priority === "Alta") strategy += 5
  if (input.dataInsight.trim().length > 20) strategy += 10
  if (input.brandNarrative.trim().length > 20) strategy += 10
  if (input.aiUse !== "Da valutare") strategy += 8
  if (input.campaignType !== "Da definire") strategy += 8

  const w = clamp(web)
  const s = clamp(social)
  const st = clamp(strategy)

  return {
    web: w,
    social: s,
    strategy: st,
    total: clamp((w + s + st) / 3),
  }
}

export function buildRecommendations(input: ScoreInput, scores: Scores): string[] {
  const items: string[] = []
  const company = input.company.trim() || "il cliente"

  if (!hasUrl(input.website)) {
    items.push(
      "Recuperare la URL del sito per avviare audit Semrush su SEO, keyword, contenuti e competitor.",
    )
  } else if (input.needsSeo || scores.web < 55) {
    items.push(
      `Preparare per ${company} una mini audit Semrush con priorita SEO, keyword gap e contenuti.`,
    )
  } else {
    items.push(
      "Usare dati SEO, traffico organico e tracking come base per una proposta di crescita misurabile.",
    )
  }

  if (input.competitorBenchmark || input.competitors.trim()) {
    items.push(
      "Inserire un benchmark competitor: visibilita organica, keyword presidiate e contenuti da superare.",
    )
  }

  if (input.keywordGap) {
    items.push(
      "Trasformare il keyword gap in piano contenuti e landing orientate alla domanda reale degli utenti.",
    )
  }

  if (!hasUrl(input.instagram) && !hasUrl(input.facebook) && !hasUrl(input.linkedin)) {
    items.push(
      "Aggiungere almeno un canale social per stimare frequenza, interazioni e opportunita editoriali.",
    )
  } else if (scores.social < 45) {
    items.push(
      "Proporre una social audit con frequenza, engagement medio, rubriche e benchmark dei contenuti migliori.",
    )
  } else {
    items.push(
      "Analizzare i contenuti social piu efficaci e trasformarli in campagna o calendario commerciale.",
    )
  }

  if (input.services.length === 0) {
    items.push("Selezionare i servizi da valutare per costruire una proposta coerente.")
  } else {
    items.push(`Costruire una proposta Officina.tech su: ${input.services.slice(0, 3).join(", ")}.`)
  }

  if (!input.dataInsight.trim()) {
    items.push("Sintetizzare un insight misurabile: dato, problema, opportunita e impatto.")
  }

  if (!input.brandNarrative.trim()) {
    items.push("Definire una narrazione che colleghi il valore del brand ai bisogni delle persone.")
  }

  if (input.aiUse !== "Da valutare") {
    items.push(`Valorizzare l'AI per: ${input.aiUse.toLowerCase()}.`)
  }

  if (input.campaignType !== "Da definire") {
    items.push(`Tradurre la strategia in una campagna di ${input.campaignType.toLowerCase()}.`)
  }

  if (input.goal === "Aumentare prenotazioni") {
    items.push("Impostare una proposta con landing, tracciamento chiamate e campagne locali.")
  }

  if (input.goal === "Migliorare reputazione online") {
    items.push("Inserire recensioni, scheda Google e gestione risposte tra le attivita chiave.")
  }

  return items.slice(0, 5)
}
