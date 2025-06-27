const fakeDomain = '@appweb.local';
const auth = firebase.auth();

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  if (!phone || password.length < 6) {
    return alert('Telefone e senha válida (mín. 6 dígitos).');
  }
  const email = phone + fakeDomain;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.replace('index.html'))
    .catch(err => alert('Falha no login: ' + err.message));
});

document.getElementById('btn-anon').addEventListener('click', () => {
  auth.signInAnonymously()
    .then(() => window.location.replace('index.html'))
    .catch(err => alert('Não foi possível entrar como anônimo: ' + err.message));
});