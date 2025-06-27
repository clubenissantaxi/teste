const fakeDomain = '@appweb.local';
const auth = firebase.auth();

document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const phone = document.getElementById('new-phone').value.trim();
  const password = document.getElementById('new-password').value;
  if (!phone || password.length < 6) {
    return alert('Telefone e senha válida (mín. 6 dígitos).');
  }
  const email = phone + fakeDomain;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => window.location.replace('index.html'))
    .catch(err => alert('Erro no cadastro: ' + err.message));
});