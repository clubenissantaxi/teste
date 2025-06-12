function toggleSubmenu() {
  const submenu = document.getElementById("novoSubmenu");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
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
  if (highlights && highlights.parentNode) {
    highlights.parentNode.insertBefore(container, highlights.nextSibling);
  } else {
    document.body.appendChild(container);
  }
}

function abrirbotao_serv(event) {
  event.stopPropagation();
  const submenu = document.getElementById("submenuServicos");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
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

function abrirSubmenuGoogle(event) {
  event.stopPropagation();
  document.getElementById("submenuServicos").style.display = "none";
  loadPage("paginas/troca-oleo.html");
}

function abrir_submenu_servico_capasbanco(event) {
  event.stopPropagation();
  document.getElementById("submenuServicos").style.display = "none";
  loadPage("paginas/capas-banco.html");
}

// Submenu hamburguer corrigido
function abrirPaginaInicial(event) {
  event.stopPropagation();
  document.getElementById("novoSubmenu").style.display = "none";
  loadPage("paginas/pagina-inicial.html");
}

function abrirAreaAdm(event) {
  event.stopPropagation();
  document.getElementById("novoSubmenu").style.display = "none";
  loadPage("paginas/area-adm.html");
}

function abrirSejaParceiro(event) {
  event.stopPropagation();
  document.getElementById("novoSubmenu").style.display = "none";
  loadPage("paginas/seja-parceiro.html");
}

function abrirContato(event) {
  event.stopPropagation();
  document.getElementById("novoSubmenu").style.display = "none";
  loadPage("paginas/contato.html");
}

// Clique global que fecha os submenus, com exceções
document.addEventListener("click", function (event) {
  const menu = document.getElementById("novoSubmenu");
  if (
    menu &&
    !event.target.closest(".menu-hamburguer") &&
    !event.target.closest("#novoSubmenu")
  ) {
    menu.style.display = "none";
  }

  const serv = document.getElementById("submenuServicos");
  if (
    serv &&
    !event.target.closest(".botao_serv") &&
    !event.target.closest("#submenuServicos")
  ) {
    serv.style.display = "none";
  }
});
