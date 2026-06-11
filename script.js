const form = document.querySelector("#clientForm");
const scoreValue = document.querySelector("#scoreValue");
const scoreRing = document.querySelector(".score-ring");
const webScoreBar = document.querySelector("#webScore");
const socialScoreBar = document.querySelector("#socialScore");
const strategyScoreBar = document.querySelector("#strategyScore");
const recommendations = document.querySelector("#recommendations");
const projectList = document.querySelector("#projectList");
const saveProject = document.querySelector("#saveProject");
const resetForm = document.querySelector("#resetForm");
const methodItems = Array.from(document.querySelectorAll("[data-method]"));

const storageKey = "officina-area-agenti-projects";

const serviceMethodMap = {
  "Sito web": ["tech", "strategy"],
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

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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
  let strategy = 18;

  if (hasUrl("website")) web += 22;
  if (checked("hasWebsite")) web += 12;
  if (checked("needsSeo")) web += 18;
  if (checked("keywordGap")) web += 12;
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

  social += socialLinks * 16;
  social += Math.min(22, Math.floor(followers / 250));
  social += Math.min(20, activity * 3);

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

  return {
    web: clamp(web),
    social: clamp(social),
    strategy: clamp(strategy),
  };
}

function buildRecommendations(scores) {
  const items = [];
  const company = value("company") || "il cliente";
  const services = checkedServices();

  if (!hasUrl("website")) {
    items.push(
      "Recuperare la URL del sito per avviare audit Semrush su SEO, keyword, contenuti e competitor."
    );
  } else if (checked("needsSeo") || scores.web < 55) {
    items.push(
      `Preparare per ${company} una mini audit Semrush con priorita SEO, keyword gap e contenuti.`
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

  if (checked("needsSeo") || checked("keywordGap") || checked("localSeo")) {
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

function updateInsights() {
  const scores = getScores();
  const total = clamp((scores.web + scores.social + scores.strategy) / 3);

  scoreValue.textContent = total;
  scoreRing.style.setProperty("--score", total);
  webScoreBar.value = scores.web;
  socialScoreBar.value = scores.social;
  strategyScoreBar.value = scores.strategy;

  recommendations.innerHTML = buildRecommendations(scores)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  updateMethodHighlights();
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

function renderProjects() {
  const projects = getProjects();

  if (projects.length === 0) {
    projectList.innerHTML =
      '<p class="empty-state">Nessun progetto salvato in questa demo.</p>';
    return;
  }

  projectList.innerHTML = projects
    .map(
      (project) => `
        <article class="project-item">
          <strong>${escapeHtml(project.company)}</strong>
          <span>${escapeHtml(project.goal)}</span>
          <span>${escapeHtml(project.status)} - potenziale ${project.score}/100</span>
        </article>
      `
    )
    .join("");
}

function saveCurrentProject() {
  const scores = getScores();
  const total = clamp((scores.web + scores.social + scores.strategy) / 3);
  const company = value("company") || "Cliente senza nome";
  const projects = getProjects();

  projects.unshift({
    company,
    goal: value("goal"),
    status: value("status"),
    score: total,
    createdAt: new Date().toISOString(),
  });

  setProjects(projects.slice(0, 8));
  renderProjects();
}

form.addEventListener("input", updateInsights);
form.addEventListener("change", updateInsights);
saveProject.addEventListener("click", saveCurrentProject);
resetForm.addEventListener("click", () => {
  form.reset();
  updateInsights();
});

updateInsights();
renderProjects();
