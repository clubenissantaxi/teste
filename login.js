document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const errorBox = document.getElementById('login-error');
  const errorMsg = document.getElementById('login-error-message');

  // Oculta a caixa de erro antes de tentar novamente
  errorBox.classList.add('hidden');
  errorMsg.textContent = '';

  console.log('Tentando logar...');

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Login OK, redirecionando...');
      window.location.replace('inicio.html');
    })
    .catch(err => {
      console.log('Erro no login:', err.code, err.message);

      let mensagemAmigavel = 'Email ou senha inválidos.';

      switch (err.code) {
        case 'auth/user-not-found':
          mensagemAmigavel = 'Usuário não encontrado. Verifique o email.';
          break;
        case 'auth/wrong-password':
          mensagemAmigavel = 'Senha incorreta. Tente novamente.';
          break;
        case 'auth/invalid-email':
          mensagemAmigavel = 'Formato de email inválido.';
          break;
        case 'auth/user-disabled':
          mensagemAmigavel = 'Usuário desativado.';
          break;
      }

      errorMsg.textContent = mensagemAmigavel;
      errorBox.classList.remove('hidden');
    });
});

document.getElementById('btn-autonomo').addEventListener('click', () => {
  auth.signInAnonymously()
    .then(() => window.location.replace('inicio.html'))
    .catch(err => {
      alert('Erro no modo autônomo: ' + err.message);
    });
});
