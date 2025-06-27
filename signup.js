// signup.js
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('new-email').value.trim();
  const password = document.getElementById('new-password').value;

  if (!email || !password) {
    alert('Preencha e-mail e senha.');
    return;
  }
  if (password.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.replace('index.html');
    })
    .catch((error) => {
      alert('Erro no cadastro: ' + error.message);
    });
});