// Esqueci a senha → Veja o seu e-mail → Criar senha nova. Comportamento comum em assets/js/entrada.js.
// Os três estados moram nesta rota. O link do e-mail abre trocar_senha/?token=…
// TODO(e-mail): sem envio de e-mail, o servidor escreve o link no terminal.
(function () {
  var INICIO = '../dashboard/';
  var ESPERA_REENVIO = 45; // segundos até poder reenviar
  var LINK_VENCIDO = 'Este link venceu ou já foi usado. Peça outro.';

  var etapas = {
    esqueci: document.getElementById('esqueci'),
    espera: document.getElementById('espera'),
    nova: document.getElementById('nova'),
  };
  var email = document.getElementById('email');
  var senha = document.getElementById('nova-senha');
  var botaoLink = document.getElementById('enviar-link');
  var botaoSalvar = document.getElementById('salvar');
  var reenviar = document.getElementById('reenviar');
  var token = new URLSearchParams(window.location.search).get('token');
  var relogio = null;

  entrada.ligarEmail(email);
  entrada.ligarSenhaNova(senha);

  // troca de estado: o novo entra subindo de leve e o foco vai para o título
  function ir(nome, focar) {
    clearInterval(relogio);
    Object.keys(etapas).forEach(function (k) {
      etapas[k].hidden = k !== nome;
    });
    var etapa = etapas[nome];
    var titulo = etapa.querySelector('h1');
    document.title = titulo.textContent;
    if (focar !== false) {
      etapa.classList.remove('fs-entra');
      void etapa.offsetWidth;
      etapa.classList.add('fs-entra');
      titulo.focus({ preventScroll: true });
    }
  }

  // ---------- Esqueci a senha ----------
  function pedirLink() {
    return entrada.enviar('/api/pacientes/senha/link', { email: email.value.trim() });
  }

  etapas.esqueci.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (entrada.ocupadoAgora(botaoLink)) return;
    if (!entrada.conferirEmail(email)) {
      email.focus();
      return;
    }

    var pedido = pedirLink();
    entrada.ocupado(botaoLink, 'Enviando o link…', pedido);
    pedido.then(function (r) {
      if (r.status === 202) {
        document.getElementById('espera-email').textContent = email.value.trim();
        ir('espera');
        contarReenvio();
        return;
      }
      if (r.status === 400) {
        entrada.erro(email, entrada.MSG.emailRuim);
        email.focus();
        return;
      }
      aviso.mostrar(entrada.MSG.semConexao);
    }, function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  });

  // ---------- Veja o seu e-mail ----------
  function contarReenvio() {
    var inicio = Date.now();
    function passo() {
      var resta = Math.max(0, ESPERA_REENVIO - Math.round((Date.now() - inicio) / 1000));
      reenviar.disabled = resta > 0;
      reenviar.textContent = resta > 0 ? 'Reenviar em 0:' + String(resta).padStart(2, '0') : 'Reenviar link';
      if (!resta) clearInterval(relogio);
    }
    clearInterval(relogio);
    passo();
    relogio = setInterval(passo, 1000);
  }

  reenviar.addEventListener('click', function () {
    pedirLink().then(function (r) {
      if (r.status !== 202) throw new Error();
      aviso.mostrar('Link enviado de novo.');
      contarReenvio();
    }).catch(function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  });

  document.getElementById('outro-email').addEventListener('click', function () {
    ir('esqueci');
    email.focus();
  });

  // ---------- Criar senha nova ----------
  function linkVencido() {
    window.history.replaceState(null, '', window.location.pathname);
    token = null;
    ir('esqueci');
    aviso.mostrar(LINK_VENCIDO);
  }

  etapas.nova.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (entrada.ocupadoAgora(botaoSalvar)) return;
    if (!entrada.conferirSenhaNova(senha)) {
      senha.focus();
      return;
    }

    var pedido = entrada.enviar('/api/pacientes/senha', { token: token, senha: senha.value });
    entrada.ocupado(botaoSalvar, 'Salvando…', pedido);
    pedido.then(function (r) {
      if (r.status === 200) {
        window.location.href = INICIO;
        return;
      }
      if (r.status === 410) {
        linkVencido();
        return;
      }
      aviso.mostrar(entrada.MSG.semConexao);
    }, function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  });

  // ---------- começo ----------
  // sem link, a página abre em "Esqueci a senha" (é o que aparece sem JS também)
  if (token) {
    ir('nova', false);
    entrada.enviar('/api/pacientes/senha/' + encodeURIComponent(token), null, 'GET').then(function (r) {
      if (r.status === 200) {
        document.getElementById('nova-email').textContent = r.corpo.email;
        entrada.guardarEmail(r.corpo.email);
      } else {
        linkVencido();
      }
    }, function () {
      aviso.mostrar(entrada.MSG.semConexao);
    });
  }
})();
