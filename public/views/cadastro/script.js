// Criar conta. Comportamento comum em assets/js/entrada.js.
// Cadastro curto (nome, e-mail e senha) que leva direto ao primeiro registro.
// Peso, altura, lembrete e clima ficam para depois, no Perfil e em Configurações.
(function () {
  var PRIMEIRO_REGISTRO = '../registro-diario/';

  var form = document.getElementById('criar');
  var nome = document.getElementById('nome');
  var email = document.getElementById('email');
  var senha = document.getElementById('nova-senha');
  var termos = document.getElementById('termos');
  var termosRotulo = document.getElementById('termos-rotulo');
  var termosErro = document.getElementById('termos-erro');
  var botao = document.getElementById('enviar');

  entrada.ligarEmail(email);
  entrada.ligarSenhaNova(senha);
  nome.addEventListener('input', function () { entrada.limpar(nome); });

  function erroTermos(mostrar) {
    termosErro.hidden = !mostrar;
    termosRotulo.classList.toggle('invalido', mostrar);
    if (mostrar) termos.setAttribute('aria-invalid', 'true');
    else termos.removeAttribute('aria-invalid');
  }
  termos.addEventListener('change', function () { if (termos.checked) erroTermos(false); });

  // "Já existe uma conta com este e-mail. Se ele é seu, entre com ele ou use Esqueci a senha.
  //  Se não, confira se está escrito certo."
  function erroContaExiste() {
    function link(href, texto) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = texto;
      return a;
    }
    entrada.erro(email, [
      'Já existe uma conta com este e-mail. Se ele é seu, ',
      link('../login-paciente/', 'entre com ele'),
      ' ou use ',
      link('../trocar_senha/', 'Esqueci a senha'),
      '. Se não, confira se está escrito certo.',
    ]);
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (entrada.ocupadoAgora(botao)) return;

    var errados = [];
    if (!nome.value.trim()) {
      entrada.erro(nome, entrada.MSG.nomeVazio);
      errados.push(nome);
    }
    if (!entrada.conferirEmail(email)) errados.push(email);
    if (!entrada.conferirSenhaNova(senha)) errados.push(senha);
    if (!termos.checked) {
      erroTermos(true);
      errados.push(termos);
    }
    if (errados.length) {
      errados[0].focus();
      return;
    }

    var pedido = entrada.enviar('/api/pacientes', { nome: nome.value.trim(), email: email.value.trim(), senha: senha.value });
    entrada.ocupado(botao, 'Criando a conta…', pedido);

    pedido.then(function (r) {
      if (r.status === 201) {
        window.location.href = PRIMEIRO_REGISTRO;
        return;
      }
      if (r.status === 409) {
        erroContaExiste();
        email.focus();
        return;
      }
      aviso.mostrar(entrada.MSG.semConexao);
    }, function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  });
})();
