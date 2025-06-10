function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function abrirAreaAdm() {
  const senhaDigitada = prompt('Digite a senha da Área ADM:');
  if (!senhaDigitada) return;

  firebase.database().ref('senhas/adm').once('value', snap => {
    if (snap.val() === senhaDigitada) {
      document.querySelectorAll('.servicos-container, .noticias-container, #faq-container, .form-container')
        .forEach(el => el.style.display = 'none');

      const frame = document.getElementById("frame-adm");
      frame.src = "paginas/area-adm.html";
      document.getElementById("container-area-adm").style.display = "block";
    } else {
      alert("❌ Senha incorreta.");
    }
  });
}

document.addEventListener("click", function(event) {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  if (menu && hamburger && !menu.contains(event.target) && !hamburger.contains(event.target)) {
    menu.style.display = "none";
  }
});