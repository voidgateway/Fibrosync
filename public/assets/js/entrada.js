// Entrada: o que login-paciente/, cadastro/ e trocar_senha/ têm em comum.
// Precisa de movimento.js, componentes/campo.js e componentes/aviso.js antes dele.
//   <script src="../../assets/js/entrada.js" defer></script>
//
// Comportamento do protótipo (redesign/revisao/telas/entrada/02-prototipo.html):
// - o e-mail é conferido ao sair do campo (se tiver algo escrito) e ao enviar;
//   depois do erro, ele some assim que o e-mail fica certo;
// - a senha nova marca cada regra enquanto a pessoa digita; o erro nomeia o que falta;
// - o botão ocupado só muda o texto depois de --motion-wait (sem spinner).
(function () {
  var MSG = {
    emailVazio: 'Escreva o e-mail da sua conta.',
    emailRuim: 'Confira o e-mail: ele precisa ter @ e um domínio, como nome@email.com.',
    senhaVazia: 'Escreva a sua senha.',
    nomeVazio: 'Escreva como quer ser chamada ou chamado no app.',
    credenciais: 'E-mail ou senha não conferem.',
    termos: 'Marque a caixa para criar a conta.',
    semConexao: 'Não deu para conectar. Tente de novo em instantes.',
    social: function (nome) { return 'Entrar com ' + nome + ' ainda não está disponível.'; },
  };

  // as mesmas regras do servidor (src/services/pacientes.service.js)
  var REGRAS = [
    { texto: '8 caracteres ou mais', falta: 'pelo menos 8 caracteres', ok: function (s) { return s.length >= 8; } },
    { texto: 'uma letra maiúscula', falta: 'uma letra maiúscula', ok: function (s) { return /[A-ZÀ-Ý]/.test(s); } },
    { texto: 'um número', falta: 'um número', ok: function (s) { return /\d/.test(s); } },
    { texto: 'um símbolo, como ! ? @ #', falta: 'um símbolo', ok: function (s) { return /[^A-Za-zÀ-ÿ0-9\s]/.test(s); } },
  ];

  function emailOk(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
  }

  // ---------- erros (visual do componente campo) ----------
  // mensagem: texto, ou nós (para a mensagem com links de "conta já existe")
  function erro(input, mensagem) {
    var texto = input.closest('.campo').querySelector('.campo-erro > span:last-child');
    if (typeof mensagem === 'string') {
      campo.marcarErro(input, mensagem);
      return;
    }
    campo.marcarErro(input, '');
    texto.replaceChildren.apply(texto, mensagem);
  }
  function limpar(input) {
    campo.limparErro(input);
  }
  function invalido(input) {
    return input.getAttribute('aria-invalid') === 'true';
  }

  // e-mail: ao sair do campo e, depois do erro, some quando fica certo
  function ligarEmail(input) {
    input.value = input.value || lembrarEmail();
    input.addEventListener('blur', function () {
      if (input.value.trim()) {
        if (emailOk(input.value)) limpar(input);
        else erro(input, MSG.emailRuim);
      }
    });
    input.addEventListener('input', function () {
      // só um e-mail certo acompanha a pessoa; um errado não pode chegar preenchido e sem erro
      guardarEmail(emailOk(input.value) ? input.value.trim() : '');
      if (invalido(input) && emailOk(input.value)) limpar(input);
    });
  }
  // ao enviar: devolve true se está certo
  function conferirEmail(input) {
    if (!input.value.trim()) erro(input, MSG.emailVazio);
    else if (!emailOk(input.value)) erro(input, MSG.emailRuim);
    else return true;
    return false;
  }

  // ---------- senha nova ----------
  function falta(senha) {
    var f = REGRAS.filter(function (r) { return !r.ok(senha); }).map(function (r) { return r.falta; });
    if (!f.length) return '';
    return 'Falta ' + (f.length > 1 ? f.slice(0, -1).join(', ') + ' e ' + f[f.length - 1] : f[0]) + '.';
  }
  function senhaOk(senha) {
    return REGRAS.every(function (r) { return r.ok(senha); });
  }
  function pintarRegras(input) {
    var itens = input.closest('.campo').querySelectorAll('.regras li');
    itens.forEach(function (li, i) {
      var ok = REGRAS[i].ok(input.value);
      li.classList.toggle('ok', ok);
      li.setAttribute('aria-label', REGRAS[i].texto + ': ' + (ok ? 'cumprido' : 'falta'));
    });
  }
  function ligarSenhaNova(input) {
    input.addEventListener('input', function () {
      pintarRegras(input);
      if (senhaOk(input.value)) limpar(input);
      else if (invalido(input)) erro(input, falta(input.value));
    });
    pintarRegras(input);
  }
  function conferirSenhaNova(input) {
    if (senhaOk(input.value)) return true;
    erro(input, falta(input.value));
    return false;
  }

  // ---------- e-mail que acompanha a pessoa entre as telas ----------
  // fica só nesta aba (sessionStorage); sem armazenamento, cada tela começa vazia
  var CHAVE = 'fibrosync:entrada-email';
  function guardarEmail(email) {
    try { sessionStorage.setItem(CHAVE, email); } catch (e) { /* sem armazenamento */ }
  }
  function lembrarEmail() {
    try { return sessionStorage.getItem(CHAVE) || ''; } catch (e) { return ''; }
  }

  // ---------- envio ----------
  // botão ocupado: aria-busy na hora; o texto só muda se demorar (sem spinner)
  function ocupado(botao, textoDemorando, promessa) {
    var original = botao.textContent;
    botao.setAttribute('aria-busy', 'true');
    return movimento.esperar(promessa, function () {
      botao.textContent = textoDemorando;
    }).finally(function () {
      botao.removeAttribute('aria-busy');
      botao.textContent = original;
    });
  }
  function ocupadoAgora(botao) {
    return botao.getAttribute('aria-busy') === 'true';
  }

  // POST com JSON; devolve { status, corpo }. Sem conexão, rejeita.
  function enviar(url, dados, metodo) {
    return fetch(url, {
      method: metodo || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dados ? JSON.stringify(dados) : undefined,
    }).then(function (resposta) {
      return resposta.json().catch(function () { return {}; }).then(function (corpo) {
        return { status: resposta.status, corpo: corpo };
      });
    });
  }

  // ---------- Google e Apple (ainda sem OAuth) ----------
  document.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-social]');
    if (botao) aviso.mostrar(MSG.social(botao.dataset.social));
  });

  window.entrada = {
    MSG: MSG,
    erro: erro,
    limpar: limpar,
    ligarEmail: ligarEmail,
    conferirEmail: conferirEmail,
    ligarSenhaNova: ligarSenhaNova,
    conferirSenhaNova: conferirSenhaNova,
    guardarEmail: guardarEmail,
    ocupado: ocupado,
    ocupadoAgora: ocupadoAgora,
    enviar: enviar,
  };
})();
