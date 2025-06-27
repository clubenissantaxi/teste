document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.replace('inicio.html'))
    .catch(err => alert('Erro no login: ' + err.message));
});

document.getElementById('btn-autonomo').addEventListener('click', () => {
  auth.signInAnonymously()
    .then(() => window.location.replace('inicio.html'))
    .catch(err => alert('Erro no modo autônomo: ' + err.message));
});
