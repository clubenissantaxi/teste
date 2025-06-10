// 📜 Funções principais do site

// 🔄 Alterna menu mobile (não exibido neste trecho)
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// 🔁 Carrega páginas dinâmicas em iframe
function loadPage(url) {
  const old = document.getElementById("dynamic-frame-container");
  if (old) old.remove();

  const container = document.createElement("div");
  container.id = "dynamic-frame-container";
  container.style.width = "100%";
  container.style.maxWidth = "860px";
  container.style.margin = "20px auto";
  container.style.borderRadius = "12px";
  container.style.overflow = "hidden";
  container.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.width = "100%";
  iframe.height = "640";
  iframe.style.border = "none";
  iframe.style.display = "block";

  container.appendChild(iframe);
  const highlights = document.querySelector(".highlights");
  highlights.parentNode.insertBefore(container, highlights.nextSibling);
}

// ▶️ Abre páginas específicas
function abrirbotao_serv() { loadPage("paginas/servicos.html"); }
function abrirbotao_Noticias() { loadPage("paginas/noticias.html"); }
function abrirbotao_Manual() { loadPage("paginas/manual.html"); }
function abrirbotao_faq() { loadPage("paginas/faq.html"); }
function abrirbotao_posto() { loadPage("paginas/posto.html"); }

// 🎯 EFEITO CARROSSEL HORIZONTAL: rola os botões para esquerda ou direita
function scrollButtons(direction) {
  const container = document.getElementById("carrossel");
  const scrollAmount = 150;
  container.scrollLeft += direction * scrollAmount;
}
