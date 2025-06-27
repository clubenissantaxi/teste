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

  if (!validarCPF(cpf)) {
    alert('CPF inválido.');
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
      alert('Erro no cadastro: ' + err.message);
    });
});
