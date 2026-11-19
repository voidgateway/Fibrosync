// Campo de texto: erro ao sair do campo e ao enviar, nunca enquanto digita.
// Depois que o erro apareceu, ele some assim que o valor fica certo.
//   <script src="../../assets/js/componentes/campo.js" defer></script>
//
//   campo.validarAoSair(input, (valor) => valor.includes('@') ? '' : 'Falta o @ no e-mail.')
//   campo.validarFormulario(form)   // ao enviar: mostra todos os erros e foca o primeiro
//
// A função de validação devolve '' quando está tudo certo, ou a mensagem que diz como resolver.
(function () {
  var regras = new WeakMap();

  function partes(input) {
    var raiz = input.closest('.campo');
    return { raiz: raiz, texto: raiz && raiz.querySelector('.campo-erro > span:last-child') };
  }

  function marcarErro(input, mensagem) {
    var p = partes(input);
    if (!p.raiz) return;
    p.raiz.classList.add('invalido');
    input.setAttribute('aria-invalid', 'true');
    if (p.texto) p.texto.textContent = mensagem;
  }

  function limparErro(input) {
    var p = partes(input);
    if (!p.raiz) return;
    p.raiz.classList.remove('invalido');
    input.removeAttribute('aria-invalid');
    if (p.texto) p.texto.textContent = '';
  }

  function conferir(input) {
    var regra = regras.get(input);
    if (!regra) return true;
    var mensagem = regra(input.value.trim(), input);
    if (mensagem) marcarErro(input, mensagem);
    else limparErro(input);
    return !mensagem;
  }

  function validarAoSair(input, regra) {
    regras.set(input, regra);
    input.addEventListener('blur', function () {
      conferir(input);
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') conferir(input);
    });
  }

  function validarFormulario(form) {
    var errados = [];
    form.querySelectorAll('input, textarea').forEach(function (input) {
      if (!conferir(input)) errados.push(input);
    });
    if (errados.length) errados[0].focus();
    return errados.length === 0;
  }

  // mostrar/ocultar senha
  document.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-mostrar-senha]');
    if (!botao) return;
    var input = botao.closest('.campo-caixa').querySelector('input');
    var mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    botao.setAttribute('aria-pressed', String(mostrar));
    botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
    var icone = botao.querySelector('.icone');
    if (icone && botao.dataset.iconeMostrar && botao.dataset.iconeOcultar) {
      icone.style.setProperty('--icone', 'url(' + (mostrar ? botao.dataset.iconeOcultar : botao.dataset.iconeMostrar) + ')');
    }
  });

  window.campo = {
    validarAoSair: validarAoSair,
    validarFormulario: validarFormulario,
    marcarErro: marcarErro,
    limparErro: limparErro,
  };
})();
