function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0, resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const type = document.getElementById('type').value;

  const errorBox = document.getElementById('signup-error');
  const errorMsg = document.getElementById('signup-error-message');
  errorBox.classList.add('hidden');
  errorMsg.textContent = '';

  if (!validarCPF(cpf)) {
    errorMsg.textContent = 'CPF inválido.';
    errorBox.classList.remove('hidden');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      const uid = user.uid;
      return db.ref('users/' + uid).set({
        nome: name,
        cpf: cpf,
        telefone: phone,
        tipo: type
      });
    })
    .then(() => {
      window.location.replace('inicio.html');
    })
    .catch(err => {
      console.log('Erro no cadastro:', err.code, err.message);

      let mensagemAmigavel = 'Erro ao tentar cadastrar.';

      switch (err.code) {
        case 'auth/email-already-in-use':
          mensagemAmigavel = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          mensagemAmigavel = 'Email inválido.';
          break;
        case 'auth/weak-password':
          mensagemAmigavel = 'A senha deve ter pelo menos 6 caracteres.';
          break;
        default:
          mensagemAmigavel = 'Erro inesperado. Tente novamente.';
      }

      errorMsg.textContent = mensagemAmigavel;
      errorBox.classList.remove('hidden');
    });
});
