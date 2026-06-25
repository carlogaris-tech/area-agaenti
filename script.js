const form = document.querySelector("#clientForm");
const scoreValue = document.querySelector("#scoreValue");
const scoreRing = document.querySelector(".score-ring");
const webScoreBar = document.querySelector("#webScore");
const socialScoreBar = document.querySelector("#socialScore");
const campaignScoreBar = document.querySelector("#campaignScore");
const recommendations = document.querySelector("#recommendations");
const projectList = document.querySelector("#projectList");
const saveProject = document.querySelector("#saveProject");
const resetForm = document.querySelector("#resetForm");
const generateAiStrategy = document.querySelector("#generateAiStrategy");
const aiOutput = document.querySelector("#aiOutput");
const generateRecommendedStrategy = document.querySelector("#generateRecommendedStrategy");
const confirmStrategy = document.querySelector("#confirmStrategy");
const strategyStatus = document.querySelector("#strategyStatus");
const proposalActions = document.querySelector("#proposalActions");
const generateClientProposal = document.querySelector("#generateClientProposal");
const printClientProposal = document.querySelector("#printClientProposal");
const proposalDeck = document.querySelector("#proposalDeck");
const presentationPreview = document.querySelector("#presentationPreview");
const presentationStage = document.querySelector("#presentationStage");
const presentationTitle = document.querySelector("#presentationTitle");
const slideCounter = document.querySelector("#slideCounter");
const prevSlide = document.querySelector("#prevSlide");
const nextSlide = document.querySelector("#nextSlide");
const closePresentation = document.querySelector("#closePresentation");
const passwordGate = document.querySelector("#passwordGate");
const passwordForm = document.querySelector("#passwordForm");
const panelPassword = document.querySelector("#panelPassword");
const passwordError = document.querySelector("#passwordError");
const methodItems = Array.from(document.querySelectorAll("[data-method]"));
const teamItems = Array.from(document.querySelectorAll("[data-team]"));
let aiStrategyVisible = false;
let presentationSlides = [];
let activeSlideIndex = 0;

const accessPassword = "strategyhub2026";
const accessStorageKey = "officina-strategy-hub-access";
const storageKey = "officina-area-agenti-projects";
const fieldNames = [
  "company",
  "contact",
  "email",
  "phone",
  "sector",
  "province",
  "website",
  "organicTraffic",
  "seoKeywords",
  "competitors",
  "webNotes",
  "campaignObjective",
  "campaignBudget",
  "campaignArea",
  "campaignNotes",
  "instagram",
  "instagramFollowers",
  "instagramPosts",
  "facebook",
  "facebookFollowers",
  "facebookEngagement",
  "linkedin",
  "linkedinFollowers",
  "linkedinPosts",
  "goal",
  "priority",
  "budget",
  "status",
  "dataInsight",
  "brandNarrative",
  "aiUse",
  "campaignType",
  "proposedStrategy",
];
const checkboxNames = [
  "hasWebsite",
  "needsSeo",
  "keywordGap",
  "positioning",
  "competitorBenchmark",
  "needsMobile",
  "needsTracking",
  "localSeo",
  "contentOpportunity",
  "searchMarketing",
  "socialMarketing",
  "cpcMarketing",
  "remarketing",
  "leadCampaigns",
  "landingCampaigns",
  "creativeCampaigns",
  "conversionTracking",
];
const requiredClientFields = [
  ["company", "Nome azienda"],
  ["contact", "Referente"],
  ["email", "Email"],
  ["phone", "Telefono"],
];

const serviceMethodMap = {
  "Sito web": ["tech", "strategy"],
  "Audit SEO": ["seo", "tech", "data-ai"],
  "Audit SEO Semrush": ["seo", "tech", "data-ai"],
  "SEO locale": ["seo", "strategy"],
  "Analisi social": ["social", "data-ai", "creative"],
  "Benchmark competitor": ["social", "seo", "strategy", "data-ai"],
  "Campagne Ads": ["creative", "data-ai", "strategy"],
  Newsletter: ["narrative", "creative", "strategy"],
  "CRM e tracking": ["tech", "data-ai", "strategy"],
  "Analisi dati e AI": ["data-ai", "tech", "strategy"],
  "Strategia narrativa": ["narrative", "strategy", "creative"],
};
const teamLabels = {
  "web-design": "Web design",
  "social-media-manager": "Social media manager",
  "program-manager": "Campaign Manager",
  "programmatic-adv-manager": "Programmatic ADV manager",
};
const campaignLabels = {
  searchMarketing: "marketing sui motori di ricerca",
  socialMarketing: "marketing social",
  cpcMarketing: "campagne CPC",
  remarketing: "remarketing",
  leadCampaigns: "lead generation",
  landingCampaigns: "landing dedicate",
  creativeCampaigns: "creativita ADV",
  conversionTracking: "conversion tracking",
};

function unlockPanel(storeAccess = true) {
  document.body.classList.remove("is-locked");
  passwordGate?.setAttribute("hidden", "");
  if (storeAccess) sessionStorage.setItem(accessStorageKey, "ok");
}

function initPasswordGate() {
  if (!passwordForm || !panelPassword) return;

  if (sessionStorage.getItem(accessStorageKey) === "ok") {
    unlockPanel(false);
    return;
  }

  panelPassword.focus();

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (panelPassword.value.trim() === accessPassword) {
      passwordError.hidden = true;
      panelPassword.value = "";
      unlockPanel();
      return;
    }

    passwordError.hidden = false;
    panelPassword.select();
  });
}

function value(name) {
  return form.elements[name]?.value?.trim() || "";
}

function numberValue(name) {
  return Number(form.elements[name]?.value || 0);
}

function checked(name) {
  return Boolean(form.elements[name]?.checked);
}

function checkedServices() {
  return Array.from(form.querySelectorAll('input[name="services"]:checked')).map(
    (item) => item.value
  );
}

function checkedCampaigns() {
  return Object.entries(campaignLabels)
    .filter(([name]) => checked(name))
    .map(([, label]) => label);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function getTopValues(items, max = 3) {
  const counts = items.reduce((acc, item) => {
    if (item) acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([item]) => item);
}

function hasUrl(name) {
  const text = value(name);
  return text.startsWith("http://") || text.startsWith("https://");
}

function clamp(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getScores() {
  let web = 12;
  let social = 10;
  let campaign = 8;
  let strategy = 18;

  if (hasUrl("website")) web += 22;
  if (checked("hasWebsite")) web += 12;
  if (checked("needsSeo")) web += 18;
  if (checked("keywordGap")) web += 12;
  if (checked("positioning")) web += 14;
  if (checked("competitorBenchmark")) web += 12;
  if (checked("needsMobile")) web += 12;
  if (checked("needsTracking")) web += 14;
  if (checked("localSeo")) web += 10;
  if (checked("contentOpportunity")) web += 10;
  if (numberValue("organicTraffic") > 0) web += 8;
  if (numberValue("seoKeywords") > 0) web += 8;
  if (value("competitors")) web += 8;
  if (value("webNotes").length > 20) web += 10;

  const socialLinks = ["instagram", "facebook", "linkedin"].filter(hasUrl).length;
  const followers =
    numberValue("instagramFollowers") +
    numberValue("facebookFollowers") +
    numberValue("linkedinFollowers");
  const activity =
    numberValue("instagramPosts") +
    numberValue("facebookEngagement") +
    numberValue("linkedinPosts");
  const campaigns = checkedCampaigns();

  social += socialLinks * 16;
  social += Math.min(22, Math.floor(followers / 250));
  social += Math.min(20, activity * 3);
  if (checked("socialMarketing")) social += 10;
  if (checked("creativeCampaigns")) social += 6;

  campaign += campaigns.length * 10;
  if (checked("searchMarketing")) campaign += 12;
  if (checked("socialMarketing")) campaign += 10;
  if (checked("cpcMarketing")) campaign += 12;
  if (checked("remarketing")) campaign += 8;
  if (checked("leadCampaigns")) campaign += 10;
  if (checked("landingCampaigns")) campaign += 8;
  if (checked("creativeCampaigns")) campaign += 6;
  if (checked("conversionTracking")) campaign += 12;
  if (value("campaignObjective") !== "Da definire") campaign += 10;
  if (value("campaignBudget") !== "Da definire") campaign += 10;
  if (value("campaignArea")) campaign += 6;
  if (value("campaignNotes").length > 20) campaign += 10;
  if (value("campaignType") !== "Da definire") campaign += 6;

  if (value("company")) strategy += 10;
  if (value("contact")) strategy += 8;
  if (value("email")) strategy += 8;
  if (value("phone")) strategy += 6;
  if (value("province")) strategy += 6;
  strategy += checkedServices().length * 7;
  if (value("budget") !== "Da definire") strategy += 10;
  if (value("priority") === "Alta") strategy += 5;
  if (value("dataInsight").length > 20) strategy += 10;
  if (value("brandNarrative").length > 20) strategy += 10;
  if (value("aiUse") !== "Da valutare") strategy += 8;
  if (value("campaignType") !== "Da definire") strategy += 8;
  strategy += campaigns.length * 5;
  if (value("campaignObjective") !== "Da definire") strategy += 8;
  if (value("campaignBudget") !== "Da definire") strategy += 8;
  if (value("campaignArea")) strategy += 5;
  if (value("campaignNotes").length > 20) strategy += 8;

  return {
    web: clamp(web),
    social: clamp(social),
    campaign: clamp(campaign),
    strategy: clamp(strategy),
  };
}

function getTotalScore(scores) {
  return clamp((scores.web + scores.social + scores.campaign) / 3);
}

function buildRecommendations(scores) {
  const items = [];
  const company = value("company") || "il cliente";
  const services = checkedServices();
  const campaigns = checkedCampaigns();

  if (!hasUrl("website")) {
    items.push(
      "Recuperare la URL del sito per avviare audit Semrush su SEO, keyword, contenuti e competitor."
    );
  } else if (checked("needsSeo") || checked("positioning") || scores.web < 55) {
    items.push(
      `Preparare per ${company} una mini audit SEO con priorita posizionamento, keyword gap e contenuti.`
    );
  } else {
    items.push(
      "Usare dati SEO, traffico organico e tracking come base per una proposta di crescita misurabile."
    );
  }

  if (checked("competitorBenchmark") || value("competitors")) {
    items.push(
      "Inserire un benchmark competitor: visibilita organica, keyword presidiate e contenuti da superare."
    );
  }

  if (checked("keywordGap")) {
    items.push(
      "Trasformare il keyword gap in piano contenuti e landing orientate alla domanda reale degli utenti."
    );
  }

  if (checked("positioning")) {
    items.push(
      "Valutare il posizionamento attuale e definire le keyword prioritarie su cui costruire visibilita organica."
    );
  }

  if (!hasUrl("instagram") && !hasUrl("facebook") && !hasUrl("linkedin")) {
    items.push("Aggiungere almeno un canale social per stimare frequenza, interazioni e opportunita editoriali.");
  } else if (scores.social < 45) {
    items.push(
      "Proporre una social audit con frequenza, engagement medio, rubriche e benchmark dei contenuti migliori."
    );
  } else {
    items.push(
      "Analizzare i contenuti social piu efficaci e trasformarli in campagna o calendario commerciale."
    );
  }

  if (campaigns.length > 0) {
    items.push(
      `Impostare una lettura campagne su ${campaigns.slice(0, 3).join(", ")} con obiettivo, pubblico, budget e misurazione.`
    );
  } else {
    items.push("Valutare se inserire campagne digitali, CPC o remarketing per accelerare la raccolta contatti.");
  }

  if (checked("landingCampaigns") || checked("conversionTracking")) {
    items.push("Collegare campagne, landing e conversion tracking per misurare richieste reali e costo contatto.");
  }

  if (services.length === 0) {
    items.push("Selezionare i servizi da valutare per costruire una proposta coerente.");
  } else {
    items.push(
      `Costruire una proposta Officina.Tech su: ${services.slice(0, 3).join(", ")}.`
    );
  }

  if (!value("dataInsight")) {
    items.push("Sintetizzare un insight misurabile: dato, problema, opportunita e impatto.");
  }

  if (!value("brandNarrative")) {
    items.push("Definire una narrazione che colleghi il valore del brand ai bisogni delle persone.");
  }

  if (value("aiUse") !== "Da valutare") {
    items.push(`Valorizzare l'AI per: ${value("aiUse").toLowerCase()}.`);
  }

  if (value("campaignType") !== "Da definire") {
    items.push(`Tradurre la strategia in una campagna di ${value("campaignType").toLowerCase()}.`);
  }

  if (value("goal") === "Aumentare prenotazioni") {
    items.push("Impostare una proposta con landing, tracciamento chiamate e campagne locali.");
  }

  if (value("goal") === "Migliorare reputazione online") {
    items.push("Inserire recensioni, scheda Google e gestione risposte tra le attivita chiave.");
  }

  return items.slice(0, 5);
}

function getActiveMethods() {
  const activeMethods = new Set();
  const services = checkedServices();

  services.forEach((service) => {
    (serviceMethodMap[service] || []).forEach((method) => {
      activeMethods.add(method);
    });
  });

  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("localSeo")) {
    activeMethods.add("seo");
    activeMethods.add("data-ai");
  }

  if (checked("competitorBenchmark") || value("competitors")) {
    activeMethods.add("social");
    activeMethods.add("strategy");
  }

  if (value("aiUse") !== "Da valutare") {
    activeMethods.add("data-ai");
    activeMethods.add("tech");
  }

  if (value("campaignType") !== "Da definire") {
    activeMethods.add("creative");
    activeMethods.add("strategy");
  }

  if (
    checkedCampaigns().length > 0 ||
    value("campaignObjective") !== "Da definire" ||
    value("campaignBudget") !== "Da definire"
  ) {
    activeMethods.add("creative");
    activeMethods.add("data-ai");
    activeMethods.add("strategy");
  }

  if (checked("searchMarketing") || checked("cpcMarketing")) {
    activeMethods.add("seo");
    activeMethods.add("tech");
  }

  if (value("brandNarrative").length > 0) {
    activeMethods.add("narrative");
  }

  return activeMethods;
}

function updateMethodHighlights() {
  const activeMethods = getActiveMethods();

  methodItems.forEach((item) => {
    const isActive = activeMethods.has(item.dataset.method);
    item.classList.toggle("is-active", isActive);
  });
}

function getActiveTeamMembers() {
  const activeTeam = new Set();
  const hasSiteSignals =
    hasUrl("website") ||
    checked("hasWebsite") ||
    checked("needsSeo") ||
    checked("keywordGap") ||
    checked("positioning") ||
    checked("competitorBenchmark") ||
    checked("needsMobile") ||
    checked("needsTracking") ||
    checked("localSeo") ||
    checked("contentOpportunity") ||
    numberValue("organicTraffic") > 0 ||
    numberValue("seoKeywords") > 0 ||
    Boolean(value("competitors")) ||
    Boolean(value("webNotes"));

  const hasSocialSignals =
    hasUrl("instagram") ||
    hasUrl("facebook") ||
    hasUrl("linkedin") ||
    numberValue("instagramFollowers") > 0 ||
    numberValue("instagramPosts") > 0 ||
    numberValue("facebookFollowers") > 0 ||
    numberValue("facebookEngagement") > 0 ||
    numberValue("linkedinFollowers") > 0 ||
    numberValue("linkedinPosts") > 0;
  const hasCampaignSignals =
    checkedCampaigns().length > 0 ||
    value("campaignObjective") !== "Da definire" ||
    value("campaignBudget") !== "Da definire" ||
    Boolean(value("campaignArea")) ||
    Boolean(value("campaignNotes"));

  if (hasSiteSignals) {
    activeTeam.add("web-design");
    activeTeam.add("program-manager");
  }

  if (hasSocialSignals) {
    activeTeam.add("social-media-manager");
    activeTeam.add("program-manager");
  }

  if (
    hasCampaignSignals ||
    checked("needsTracking") ||
    value("campaignType") === "Lead generation" ||
    checkedServices().includes("Campagne Ads")
  ) {
    activeTeam.add("programmatic-adv-manager");
    activeTeam.add("program-manager");
  }

  return activeTeam;
}

function updateTeamHighlights() {
  const activeTeam = getActiveTeamMembers();

  teamItems.forEach((item) => {
    const isActive = activeTeam.has(item.dataset.team);
    item.classList.toggle("is-active", isActive);
  });
}

function buildMemoryInsight() {
  const projects = getProjects();

  if (projects.length === 0) {
    return "Memoria demo ancora vuota: quando gli agenti salvano progetti, l'assistente inizia a riconoscere settori, servizi ricorrenti e approcci commerciali piu usati.";
  }

  const sectors = getTopValues(projects.map((project) => project.fields?.sector));
  const services = getTopValues(projects.flatMap((project) => project.services || []));
  const statuses = getTopValues(projects.map((project) => project.status));
  const details = [];

  details.push(`${projects.length} progetti salvati nella memoria locale della demo`);
  if (sectors.length > 0) details.push(`settori piu presenti: ${sectors.join(", ")}`);
  if (services.length > 0) details.push(`servizi ricorrenti: ${services.join(", ")}`);
  if (statuses.length > 0) details.push(`stati piu frequenti: ${statuses.join(", ")}`);

  return details.join(". ") + ".";
}

function buildAiStrategyHtml() {
  const scores = getScores();
  const total = getTotalScore(scores);
  const company = value("company") || "questo cliente";
  const sector = value("sector").toLowerCase();
  const province = value("province");
  const services = checkedServices();
  const campaigns = checkedCampaigns();
  const activeTeam = Array.from(getActiveTeamMembers()).map((team) => teamLabels[team]);
  const activeMethods = Array.from(getActiveMethods()).map((method) => {
    const item = methodItems.find((element) => element.dataset.method === method);
    return item?.textContent || method;
  });
  const opportunities = [];
  const nextSteps = [];

  if (hasUrl("website") || checked("hasWebsite")) {
    opportunities.push(
      "Partire da audit sito, performance, UX e tracciamento per capire dove si perde potenziale commerciale."
    );
  } else {
    opportunities.push(
      "Recuperare o creare una presenza web solida: senza sito o landing diventa difficile misurare conversioni e campagne."
    );
  }

  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("localSeo")) {
    opportunities.push(
      "Usare dati SEO e Semrush per trasformare posizionamento, keyword gap, SEO locale e competitor in un piano contenuti misurabile."
    );
  }

  if (hasUrl("instagram") || hasUrl("facebook") || hasUrl("linkedin")) {
    opportunities.push(
      "Leggere frequenza, follower e interazioni social per capire quali contenuti possono sostenere awareness, lead e reputazione."
    );
  } else {
    opportunities.push(
      "Chiedere i link social prima della proposta: servono per valutare continuita editoriale e coinvolgimento reale."
    );
  }

  if (value("budget") === "Da definire") {
    opportunities.push(
      "Portare il cliente verso una proposta modulare: audit iniziale, priorita operative e secondo step di crescita."
    );
  }

  if (campaigns.length > 0) {
    opportunities.push(
      `Attivare una strategia media su ${campaigns.slice(0, 4).join(", ")} con messaggi, pubblico e tracking coerenti.`
    );
  }

  if (value("dataInsight")) {
    opportunities.push(`Insight da valorizzare: ${value("dataInsight")}`);
  }

  nextSteps.push(`Preparare una sintesi commerciale per ${company} con potenziale stimato ${total}/100.`);
  nextSteps.push(`Collegare l'obiettivo "${value("goal")}" a una proposta concreta e facile da approvare.`);

  if (services.length > 0) {
    nextSteps.push(`Costruire il perimetro iniziale su: ${services.slice(0, 4).join(", ")}.`);
  } else {
    nextSteps.push("Selezionare almeno due servizi da valutare per rendere piu precisa la proposta.");
  }

  nextSteps.push("Salvare il progetto e usare il feedback dell'agente per migliorare le prossime strategie.");

  return `
    <article class="ai-memory">
      <h3>Memoria agente</h3>
      <p>${escapeHtml(buildMemoryInsight())}</p>
    </article>
    <article>
      <h3>Lettura del cliente</h3>
      <p>
        ${escapeHtml(company)}${province ? `, area ${escapeHtml(province)}` : ""}:
        cliente ${escapeHtml(sector)} con priorita ${escapeHtml(value("priority").toLowerCase())}
        e obiettivo "${escapeHtml(value("goal"))}".
      </p>
    </article>
    <article>
      <h3>Opportunita AI suggerite</h3>
      ${renderList(opportunities.slice(0, 5))}
    </article>
    <article>
      <h3>Skill e team consigliati</h3>
      ${renderList([
        `Skill da attivare: ${activeMethods.length > 0 ? activeMethods.join(", ") : "visione strategica e raccolta dati"}.`,
        `Team da coinvolgere: ${activeTeam.length > 0 ? activeTeam.join(", ") : "Campaign Manager per impostare il primo perimetro"}.`,
      ])}
    </article>
    <article>
      <h3>Prossime azioni per l'agente</h3>
      ${renderList(nextSteps)}
    </article>
  `;
}

function buildRecommendedStrategyText() {
  const scores = getScores();
  const total = getTotalScore(scores);
  const company = value("company") || "il cliente";
  const sector = value("sector").toLowerCase();
  const area = value("province") || value("campaignArea");
  const services = checkedServices();
  const campaigns = checkedCampaigns();
  const activeTeam = Array.from(getActiveTeamMembers()).map((team) => teamLabels[team]);
  const strategicAssets = [];
  const operatingPlan = [];

  if (hasUrl("website") || checked("hasWebsite")) {
    strategicAssets.push("audit sito, UX, performance e tracciamento conversioni");
  }

  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("localSeo")) {
    strategicAssets.push("analisi SEO/Semrush su posizionamento, keyword, competitor e opportunita contenuti");
  }

  if (hasUrl("instagram") || hasUrl("facebook") || hasUrl("linkedin")) {
    strategicAssets.push("analisi social su frequenza, follower, interazioni e rubriche editoriali");
  }

  if (campaigns.length > 0) {
    strategicAssets.push(`piano campagne digitali su ${campaigns.join(", ")}`);
  }

  if (value("dataInsight")) {
    strategicAssets.push(`insight emerso: ${value("dataInsight")}`);
  }

  if (value("brandNarrative")) {
    strategicAssets.push(`narrazione da valorizzare: ${value("brandNarrative")}`);
  }

  operatingPlan.push("1. Audit iniziale dei dati disponibili e definizione delle priorita commerciali.");

  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("localSeo")) {
    operatingPlan.push("2. Mini audit SEO/Semrush per individuare posizionamento, keyword, competitor, contenuti mancanti e opportunita SEO locale.");
  } else {
    operatingPlan.push("2. Raccolta dati su sito, presenza organica e punti di attrito nel percorso utente.");
  }

  if (campaigns.length > 0) {
    operatingPlan.push(
      `3. Piano media con focus ${value("campaignObjective").toLowerCase()} e budget ${value("campaignBudget").toLowerCase()}, partendo da ${campaigns.slice(0, 3).join(", ")}.`
    );
  } else {
    operatingPlan.push("3. Valutazione di campagne digitali e CPC solo dopo aver chiarito obiettivo, pubblico e budget media.");
  }

  operatingPlan.push("4. Definizione di messaggio, landing o contenuti necessari per trasformare traffico e interesse in contatti.");
  operatingPlan.push("5. Misurazione dei risultati con tracking, report e ottimizzazione progressiva.");

  return [
    `Strategia consigliata per ${company}`,
    "",
    `Il cliente opera nel settore ${sector} ${area ? `e lavora sull'area ${area}` : "con area geografica da definire"}. Il potenziale stimato e ${total}/100, con obiettivo principale: ${value("goal")}.`,
    "",
    "Lettura strategica",
    strategicAssets.length > 0
      ? `La proposta dovrebbe partire da ${strategicAssets.join("; ")}.`
      : "La proposta dovrebbe partire da una raccolta dati piu completa su sito, social, campagne e obiettivi commerciali.",
    "",
    "Servizi Officina.Tech da proporre",
    services.length > 0
      ? services.map((service) => `- ${service}`).join("\n")
      : "- Audit iniziale\n- Strategia digitale\n- Piano operativo misurabile",
    "",
    "Piano operativo",
    operatingPlan.join("\n"),
    "",
    "Team da coinvolgere",
    activeTeam.length > 0
      ? activeTeam.map((member) => `- ${member}`).join("\n")
      : "- Campaign Manager\n- Team specialistico da definire dopo la raccolta dati",
    "",
    "Prossimo passo consigliato",
    "Preparare una proposta breve con audit iniziale, priorita operative, canali da attivare, budget indicativo e criteri di misurazione.",
  ].join("\n");
}

function buildGeneratedInsight() {
  const company = value("company") || "il cliente";
  const signals = [];

  if (hasUrl("website") || checked("hasWebsite")) {
    signals.push("presenza web da valutare su UX, SEO, contenuti e conversioni");
  }

  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("localSeo")) {
    signals.push("opportunita SEO/Semrush su posizionamento, keyword, competitor e visibilita organica");
  }

  if (hasUrl("instagram") || hasUrl("facebook") || hasUrl("linkedin")) {
    signals.push("canali social da leggere su frequenza, interazioni e continuita editoriale");
  }

  if (checkedCampaigns().length > 0) {
    signals.push(`campagne digitali da impostare su ${checkedCampaigns().slice(0, 3).join(", ")}`);
  }

  if (signals.length === 0) {
    signals.push("raccolta dati iniziale da completare prima della proposta");
  }

  return `Per ${company} emerge una prima opportunita di crescita basata su ${signals.join("; ")}. La proposta dovrebbe trasformare questi segnali in priorita misurabili e in un piano commerciale semplice da presentare.`;
}

function buildGeneratedNarrative() {
  const company = value("company") || "il brand";
  const goal = value("goal").toLowerCase();
  const sector = value("sector").toLowerCase();

  return `${company} deve essere raccontato come un riferimento credibile nel settore ${sector}, collegando il valore del brand all'obiettivo "${goal}". La narrazione dovrebbe unire prova concreta, benefici per il cliente finale e messaggi utili per sito, social e campagne.`;
}

function getSuggestedAiUse() {
  if (checked("needsSeo") || checked("keywordGap") || checked("positioning") || checked("competitorBenchmark")) {
    return "Analisi keyword e competitor";
  }

  if (checkedCampaigns().length > 0 || hasUrl("instagram") || hasUrl("facebook") || hasUrl("linkedin")) {
    return "Idee editoriali e campagne";
  }

  if (checked("contentOpportunity") || value("webNotes")) {
    return "Audit e analisi contenuti";
  }

  return "Segmentazione clienti";
}

function getSuggestedCampaignType() {
  const goal = value("goal");
  const objective = value("campaignObjective");

  if (objective === "Prenotazioni o appuntamenti" || goal === "Aumentare prenotazioni") {
    return "Prenotazioni o appuntamenti";
  }

  if (objective === "Richieste di contatto" || checked("leadCampaigns") || goal === "Portare nuovi contatti") {
    return "Lead generation";
  }

  if (objective === "Notorieta e copertura locale" || goal === "Migliorare reputazione online") {
    return "Reputazione e community";
  }

  if (goal === "Preparare una campagna stagionale") {
    return "Lancio prodotto o evento";
  }

  return "Fidelizzazione";
}

function fillGuidedStrategyFields(force = false) {
  const dataInsight = form.elements.dataInsight;
  const brandNarrative = form.elements.brandNarrative;
  const aiUse = form.elements.aiUse;
  const campaignType = form.elements.campaignType;

  if (dataInsight && (force || !dataInsight.value.trim())) {
    dataInsight.value = buildGeneratedInsight();
  }

  if (brandNarrative && (force || !brandNarrative.value.trim())) {
    brandNarrative.value = buildGeneratedNarrative();
  }

  if (aiUse && (force || aiUse.value === "Da valutare")) {
    aiUse.value = getSuggestedAiUse();
  }

  if (campaignType && (force || campaignType.value === "Da definire")) {
    campaignType.value = getSuggestedCampaignType();
  }
}

function fillRecommendedStrategy(force = false) {
  const proposedStrategy = form.elements.proposedStrategy;
  if (!proposedStrategy) return;

  if (!force && proposedStrategy.value.trim()) return;

  proposedStrategy.value = buildRecommendedStrategyText();
  if (strategyStatus) strategyStatus.hidden = true;
}

function getProposalList(items, fallback) {
  const list = items.length > 0 ? items : fallback;
  return `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildClientProposalHtml() {
  const scores = getScores();
  const company = value("company") || "Cliente";
  const services = checkedServices();
  const campaigns = checkedCampaigns();
  const activeTeam = Array.from(getActiveTeamMembers()).map((team) => teamLabels[team]);
  const strategy = value("proposedStrategy") || buildRecommendedStrategyText();
  const strategyExcerpt = strategy.split("\n").filter(Boolean).slice(0, 7).join(" ");
  const opportunities = [];

  if (scores.web >= 45) opportunities.push("Migliorare sito, UX, contenuti e tracciamento conversioni.");
  if (scores.social >= 35) opportunities.push("Rendere piu misurabile la presenza social e il calendario editoriale.");
  if (scores.campaign >= 35) opportunities.push("Attivare campagne digitali con budget, obiettivi e KPI chiari.");
  if (checked("positioning")) opportunities.push("Lavorare sul posizionamento organico e sulle keyword prioritarie.");
  if (checked("competitorBenchmark")) opportunities.push("Usare benchmark competitor per individuare spazi di crescita.");

  return `
    <article class="proposal-slide cover">
      <div>
        <p class="eyebrow">Proposta cliente</p>
        <h3>${escapeHtml(company)}</h3>
        <p>Strategia digitale preparata da Officina.Tech Strategy Hub.</p>
      </div>
      <div class="proposal-meta">
        <span>Potenziale ${getTotalScore(scores)}/100</span>
        <span>${escapeHtml(value("goal"))}</span>
        <span>${escapeHtml(value("priority"))}</span>
      </div>
    </article>
    <article class="proposal-slide">
      <div>
        <p class="eyebrow">Scenario</p>
        <h3>Sito, social e campagne</h3>
      </div>
      ${getProposalList([
        `Sito: ${scores.web}/100`,
        `Social: ${scores.social}/100`,
        `Campagne: ${scores.campaign}/100`,
        `Settore: ${value("sector")}`,
        `Area: ${value("province") || value("campaignArea") || "da definire"}`,
      ], [])}
    </article>
    <article class="proposal-slide">
      <div>
        <p class="eyebrow">Opportunita</p>
        <h3>Dove possiamo creare valore</h3>
      </div>
      ${getProposalList(opportunities, [
        "Completare la raccolta dati per definire priorita e proposta.",
        "Collegare analisi, contenuti e campagne a obiettivi misurabili.",
      ])}
    </article>
    <article class="proposal-slide">
      <div>
        <p class="eyebrow">Strategia</p>
        <h3>Direzione consigliata</h3>
      </div>
      <p>${escapeHtml(strategyExcerpt)}</p>
    </article>
    <article class="proposal-slide">
      <div>
        <p class="eyebrow">Piano operativo</p>
        <h3>Servizi e canali da attivare</h3>
      </div>
      ${getProposalList([...services, ...campaigns], [
        "Audit iniziale",
        "Strategia digitale",
        "Piano operativo misurabile",
      ])}
    </article>
    <article class="proposal-slide">
      <div>
        <p class="eyebrow">Team e prossimi passi</p>
        <h3>Come partire</h3>
      </div>
      ${getProposalList(activeTeam, ["Campaign Manager", "Team specialistico da definire"])}
      <p><strong>Prossimo passo:</strong> call di allineamento, raccolta accessi e definizione della proposta economica.</p>
    </article>
  `;
}

function updatePresentationSlide() {
  if (!presentationStage) return;

  if (presentationSlides.length === 0) {
    presentationStage.innerHTML = `
      <article class="proposal-slide cover presentation-fallback">
        <div>
          <p class="eyebrow">Presentazione cliente</p>
          <h3>Anteprima non disponibile</h3>
          <p>Conferma la strategia e riapri l'anteprima per generare le slide della proposta.</p>
        </div>
      </article>
    `;
    if (slideCounter) slideCounter.textContent = "0 / 0";
    if (prevSlide) prevSlide.disabled = true;
    if (nextSlide) nextSlide.disabled = true;
    return;
  }

  presentationStage.replaceChildren(presentationSlides[activeSlideIndex].cloneNode(true));
  if (slideCounter) slideCounter.textContent = `${activeSlideIndex + 1} / ${presentationSlides.length}`;
  if (prevSlide) prevSlide.disabled = activeSlideIndex === 0;
  if (nextSlide) nextSlide.disabled = activeSlideIndex === presentationSlides.length - 1;
}

function openPresentationPreview() {
  if (!presentationPreview || !presentationStage) return;

  if (!proposalDeck || proposalDeck.children.length === 0) {
    renderClientProposal(false);
  }

  presentationSlides = Array.from(proposalDeck.querySelectorAll(".proposal-slide"));
  activeSlideIndex = 0;
  if (presentationTitle) presentationTitle.textContent = `Proposta per ${value("company") || "cliente"}`;
  presentationPreview.hidden = false;
  document.body.classList.add("presentation-open");
  updatePresentationSlide();
}

function closePresentationPreview() {
  if (!presentationPreview) return;

  presentationPreview.hidden = true;
  document.body.classList.remove("presentation-open");
}

function renderClientProposal(openPreview = true) {
  if (!proposalDeck) return;
  if (!value("proposedStrategy")) fillRecommendedStrategy(true);
  proposalDeck.innerHTML = buildClientProposalHtml();
  proposalDeck.hidden = openPreview;
  if (openPreview) openPresentationPreview();
}

function renderAiStrategy(forceStrategy = false) {
  aiStrategyVisible = true;
  if (forceStrategy) fillGuidedStrategyFields(true);
  aiOutput.innerHTML = buildAiStrategyHtml();
  fillRecommendedStrategy(forceStrategy);
}

function handleFormUpdate() {
  updateInsights();
  if (aiStrategyVisible) renderAiStrategy(false);
  if (document.activeElement === form.elements.proposedStrategy) {
    if (strategyStatus) strategyStatus.hidden = true;
    if (proposalActions) proposalActions.hidden = true;
  }
}

function updateInsights() {
  const scores = getScores();
  const total = getTotalScore(scores);

  scoreValue.textContent = total;
  scoreRing.style.setProperty("--score", total);
  webScoreBar.value = scores.web;
  socialScoreBar.value = scores.social;
  campaignScoreBar.value = scores.campaign;

  recommendations.innerHTML = buildRecommendations(scores)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  updateMethodHighlights();
  updateTeamHighlights();
}

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function setProjects(projects) {
  localStorage.setItem(storageKey, JSON.stringify(projects));
}

function collectFormData() {
  const fields = {};
  const checks = {};

  fieldNames.forEach((name) => {
    fields[name] = value(name);
  });

  checkboxNames.forEach((name) => {
    checks[name] = checked(name);
  });

  return {
    fields,
    checks,
    services: checkedServices(),
  };
}

function applyProject(project) {
  fieldNames.forEach((name) => {
    if (form.elements[name]) {
      form.elements[name].value = project.fields?.[name] || "";
    }
  });

  checkboxNames.forEach((name) => {
    if (form.elements[name]) {
      form.elements[name].checked = Boolean(project.checks?.[name]);
    }
  });

  form.querySelectorAll('input[name="services"]').forEach((item) => {
    item.checked = (project.services || []).includes(item.value);
  });

  updateInsights();
  if (aiStrategyVisible) renderAiStrategy();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProjects() {
  const projects = getProjects();

  if (projects.length === 0) {
    projectList.innerHTML =
      '<p class="empty-state">Nessun progetto salvato in questa demo.</p>';
    return;
  }

  projectList.innerHTML = projects
    .map(
      (project, index) => `
        <article class="project-item">
          <strong>${escapeHtml(project.company)}</strong>
          <span>${escapeHtml(project.goal)}</span>
          <span>${escapeHtml(project.status)} - potenziale ${project.score}/100</span>
          <div class="project-actions">
            <button type="button" data-project-action="load" data-project-index="${index}">Apri</button>
            <button type="button" data-project-action="delete" data-project-index="${index}">Elimina</button>
          </div>
        </article>
      `
    )
    .join("");
}

function saveCurrentProject() {
  const missingFields = requiredClientFields
    .filter(([name]) => !value(name))
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    window.alert(
      `Prima di salvare il progetto completa i dati cliente:\n\n- ${missingFields.join("\n- ")}`
    );
    form.elements[requiredClientFields.find(([name]) => !value(name))[0]]?.focus();
    return;
  }

  const scores = getScores();
  const total = getTotalScore(scores);
  const company = value("company") || "Cliente senza nome";
  const projects = getProjects();
  const projectData = collectFormData();

  projects.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    company,
    goal: value("goal"),
    status: value("status"),
    score: total,
    createdAt: new Date().toISOString(),
    ...projectData,
  });

  setProjects(projects.slice(0, 8));
  renderProjects();
  if (aiStrategyVisible) renderAiStrategy();
}

function handleProjectAction(event) {
  const button = event.target.closest("[data-project-action]");
  if (!button) return;

  const index = Number(button.dataset.projectIndex);
  const projects = getProjects();
  const project = projects[index];

  if (!project) return;

  if (button.dataset.projectAction === "load") {
    applyProject(project);
    return;
  }

  if (button.dataset.projectAction === "delete") {
    projects.splice(index, 1);
    setProjects(projects);
    renderProjects();
    if (aiStrategyVisible) renderAiStrategy();
  }
}

form.addEventListener("input", handleFormUpdate);
form.addEventListener("change", handleFormUpdate);
saveProject.addEventListener("click", saveCurrentProject);
if (generateAiStrategy) {
  generateAiStrategy.addEventListener("click", () => renderAiStrategy(true));
}
if (generateRecommendedStrategy) {
  generateRecommendedStrategy.addEventListener("click", () => {
    fillGuidedStrategyFields(true);
    fillRecommendedStrategy(true);
    updateInsights();
  });
}
if (confirmStrategy) {
  confirmStrategy.addEventListener("click", () => {
    if (!value("proposedStrategy")) {
      fillRecommendedStrategy(true);
    }
    if (strategyStatus) strategyStatus.hidden = false;
    if (proposalActions) proposalActions.hidden = false;
  });
}
if (generateClientProposal) {
  generateClientProposal.addEventListener("click", () => renderClientProposal(true));
}
if (printClientProposal) {
  printClientProposal.addEventListener("click", () => {
    if (proposalDeck?.hidden) renderClientProposal(false);
    window.print();
  });
}
if (prevSlide) {
  prevSlide.addEventListener("click", () => {
    activeSlideIndex = Math.max(0, activeSlideIndex - 1);
    updatePresentationSlide();
  });
}
if (nextSlide) {
  nextSlide.addEventListener("click", () => {
    activeSlideIndex = Math.min(presentationSlides.length - 1, activeSlideIndex + 1);
    updatePresentationSlide();
  });
}
if (closePresentation) {
  closePresentation.addEventListener("click", closePresentationPreview);
}
document.addEventListener("keydown", (event) => {
  if (!presentationPreview || presentationPreview.hidden) return;

  if (event.key === "Escape") closePresentationPreview();
  if (event.key === "ArrowLeft") {
    activeSlideIndex = Math.max(0, activeSlideIndex - 1);
    updatePresentationSlide();
  }
  if (event.key === "ArrowRight") {
    activeSlideIndex = Math.min(presentationSlides.length - 1, activeSlideIndex + 1);
    updatePresentationSlide();
  }
});
projectList.addEventListener("click", handleProjectAction);
resetForm.addEventListener("click", () => {
  form.reset();
  aiStrategyVisible = false;
  if (strategyStatus) strategyStatus.hidden = true;
  if (proposalActions) proposalActions.hidden = true;
  if (proposalDeck) {
    proposalDeck.hidden = true;
    proposalDeck.innerHTML = "";
  }
  closePresentationPreview();
  if (aiOutput) {
    aiOutput.innerHTML =
      "<p class=\"empty-state\">Compila la scheda e genera una prima strategia guidata per l'agente.</p>";
  }
  handleFormUpdate();
});

initPasswordGate();
updateInsights();
renderProjects();
