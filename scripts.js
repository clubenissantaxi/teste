
// 🍔 Alterna visibilidade do submenu hamburguer
function toggleSubmenu() {
  const submenu = document.getElementById("novoSubmenu");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

// Carrega páginas via iframe
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
    document.body.appendChild(container); // fallback
  }
}

// Abre o submenu Serviços
function abrirbotao_serv(event) {
  event.stopPropagation();
  const submenu = document.getElementById("submenuServicos");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

// Carrega página Notícias
function abrirbotao_Noticias() {
  loadPage("paginas/noticias.html");
}

// Abre link Manual em nova aba
function abrirbotao_Manual() {
  window.open("https://www.nissan.com.br/servicos/manuais/kicks.html", "_blank");
}

// Carrega página FAQ
function abrirbotao_faq() {
  loadPage("paginas/faq.html");
}

// Carrega página Posto
function abrirbotao_posto() {
  loadPage("paginas/posto.html");
}

// Abre página Troca de óleo via iframe (submenu)
function abrirSubmenuGoogle(event) {
  document.getElementById("submenuServicos").style.display = "none";
  event.stopPropagation();
  loadPage("paginas/troca-oleo.html");
}

// Listener global refinado substituindo múltiplos listeners
document.addEventListener("click", function(event) {
  // 1️⃣ Fecha menu hamburguer
  const menu = document.getElementById("novoSubmenu");
  if (menu && !event.target.closest(".menu-hamburguer")) {
    menu.style.display = "none";
  }

  // 2️⃣ Fecha submenu Serviços
  const serv = document.getElementById("submenuServicos");
  if (
    serv &&
    !event.target.closest(".botao_serv") &&
    !event.target.closest("#submenuServicos")
  ) {
    serv.style.display = "none";
  }

  // 3️⃣ Remove iframe se clicar fora de highlights ou do próprio iframe
});


// Abre página Capas de Banco (submenu Opção 2)
function abrir_submenu_servico_capasbanco(event) {
  document.getElementById("submenuServicos").style.display = "none";
  event.stopPropagation();
  loadPage("paginas/capas-banco.html");
}


// ✅ Submenu Hamburguer - Fecha menu e carrega páginas

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


// Efeito de rolagem automática para indicar deslizamento horizontal
window.addEventListener("load", () => {
  const highlights = document.querySelector(".highlights");
  if (highlights) {
    highlights.scrollLeft = 80;
    setTimeout(() => {
      highlights.scrollLeft = 0;
    }, 400);
  }
});
