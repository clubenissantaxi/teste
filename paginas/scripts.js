
// 🍔 Alterna visibilidade do submenu ao clicar no botão hamburguer
function toggleSubmenu() {
  const submenu = document.getElementById("submenu");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

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

function abrirbotao_serv(event) {
  toggleSubmenuServicos(event);
}

function abrirbotao_Noticias() {
  loadPage("paginas/noticias.html");
}

function abrirbotao_Manual() {
  window.open("https://www.nissan.com.br/servicos/manuais/kicks.html", "_blank");
}

function abrirbotao_faq() {
  loadPage("paginas/faq.html");
}

function abrirbotao_posto() {
  loadPage("paginas/posto.html");
}

document.addEventListener("click", function (event) {
  const submenu = document.getElementById("submenu");
  const menuToggle = document.querySelector(".hamburguer-icon");
  if (submenu && !submenu.contains(event.target) && !menuToggle.contains(event.target)) {
    submenu.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  const iframeContainer = document.getElementById("dynamic-frame-container");
  const clickedHighlight = event.target.closest(".highlight");
  if (iframeContainer && !iframeContainer.contains(event.target) && !clickedHighlight) {
    iframeContainer.remove();
  }
});

function toggleSubmenu() {
  const submenu = document.getElementById("novoSubmenu");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

document.addEventListener("click", function (event) {
  const submenu = document.getElementById("novoSubmenu");
  const menuToggle = document.querySelector(".hamburguer-icon");
  if (submenu && !submenu.contains(event.target) && !menuToggle.contains(event.target)) {
    submenu.style.display = "none";
  }
});

function toggleSubmenuServicos(event) {
  event.stopPropagation();
  const submenu = document.getElementById("submenuServicos");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

document.addEventListener("click", function (event) {
  const submenu = document.getElementById("submenuServicos");
  const botaoServicos = document.querySelector(".botao_serv");
  if (submenu && !submenu.contains(event.target) && !botaoServicos.contains(event.target)) {
    submenu.style.display = "none";
  }
});
