// 📜 Script para páginas e carrossel infinito

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// 🔁 Carregamento via iframe abaixo dos botões
function loadPage(url) {
  const old = document.getElementById("dynamic-frame-container");
  if (old) old.remove();

  const container = document.createElement("div");
  container.id = "dynamic-frame-container";
  container.style.width = "100vw";
  container.style.maxWidth = "100%";
  container.style.padding = "0 12px";
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

// 🔁 Botões carregam páginas específicas
function abrirbotao_serv() { loadPage("paginas/servicos.html"); }
function abrirbotao_Noticias() { loadPage("paginas/noticias.html"); }
function abrirbotao_Manual() { loadPage("paginas/manual.html"); }
function abrirbotao_faq() { loadPage("paginas/faq.html"); }
function abrirbotao_posto() { loadPage("paginas/posto.html"); }

// ♻️ DUPLICAÇÃO DE BOTÕES para simular carrossel infinito
window.addEventListener("DOMContentLoaded", () => {
  const highlights = document.getElementById("carrossel");
  const clones = highlights.innerHTML;
  highlights.innerHTML += clones + clones; // duplica 2x

  // Quando chegar perto do fim, volta pro início (loop)
  highlights.addEventListener("scroll", () => {
    if (highlights.scrollLeft >= highlights.scrollWidth / 1.5) {
      highlights.scrollLeft = highlights.scrollWidth / 6;
    }
  });

  // Inicia scroll no meio para dar ilusão de infinito
  highlights.scrollLeft = highlights.scrollWidth / 3;
});
