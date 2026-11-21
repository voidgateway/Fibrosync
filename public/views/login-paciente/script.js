// Entrar. Comportamento comum em assets/js/entrada.js.
// Deu certo: vai direto ao Início (sem diálogo e sem guardar o e-mail; gosto.md, 20/11/2026).
(function () {
  var INICIO = '../dashboard/';

  var form = document.getElementById('entrar');
  var email = document.getElementById('email');
  var senha = document.getElementById('senha');
  var botao = document.getElementById('enviar');

  entrada.ligarEmail(email);

  // a senha mudou: some o erro dela e a marca do e-mail
  senha.addEventListener('input', function () {
    entrada.limpar(senha);
    email.closest('.campo').classList.remove('marcado');
  });

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (entrada.ocupadoAgora(botao)) return;

    var errados = [];
    if (!entrada.conferirEmail(email)) errados.push(email);
    if (!senha.value) {
      entrada.erro(senha, entrada.MSG.senhaVazia);
      errados.push(senha);
    }
    if (errados.length) {
      errados[0].focus();
      return;
    }

    var pedido = entrada.enviar('/api/pacientes/login', { email: email.value.trim(), senha: senha.value });
    entrada.ocupado(botao, 'Entrando…', pedido);

    pedido.then(function (r) {
      if (r.status === 200) {
        window.location.href = INICIO;
        return;
      }
      if (r.status === 401) {
        entrada.erro(senha, entrada.MSG.credenciais);
        email.closest('.campo').classList.add('marcado');
        senha.focus();
        return;
      }
      aviso.mostrar(entrada.MSG.semConexao);
    }, function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  });
})();
