// Aviso flutuante (toast). Precisa de movimento.js e de componentes/aviso.css.
//   <script src="../../assets/js/movimento.js" defer></script>
//   <script src="../../assets/js/componentes/aviso.js" defer></script>
//
//   aviso.mostrar('Registro salvo.')
//   aviso.mostrar('Registro apagado.', { desfazer: () => restaurar() })
//
// Regras (gosto.md, 19/11/2026):
// - Com "Desfazer", fica 8 s; sem, 3,5 s.
// - O tempo PAUSA com o ponteiro em cima ou com o foco dentro do aviso.
// - Um aviso por vez: o novo substitui o anterior (o anterior sai, depois o novo entra).
(function () {
  var TEMPO_COM_DESFAZER = 8000;
  var TEMPO_SEM_DESFAZER = 3500;

  var zona = null;
  var atual = null; // { el, relogio, restante, inicio, pausado }
  var fila = Promise.resolve();

  function garantirZona() {
    if (zona) return zona;
    zona = document.createElement('div');
    zona.className = 'aviso-zona';
    zona.setAttribute('role', 'status');
    zona.setAttribute('aria-live', 'polite');
    document.body.appendChild(zona);
    return zona;
  }

  function armar(estado) {
    clearTimeout(estado.relogio);
    estado.inicio = Date.now();
    estado.relogio = setTimeout(function () {
      fechar(estado);
    }, estado.restante);
  }

  function pausar(estado) {
    if (estado.pausado) return;
    estado.pausado = true;
    clearTimeout(estado.relogio);
    estado.restante = Math.max(1000, estado.restante - (Date.now() - estado.inicio));
  }

  function retomar(estado) {
    if (!estado.pausado) return;
    if (estado.el.matches(':hover') || estado.el.contains(document.activeElement)) return;
    estado.pausado = false;
    armar(estado);
  }

  function fechar(estado) {
    if (!estado || estado.fechado) return Promise.resolve();
    estado.fechado = true;
    clearTimeout(estado.relogio);
    if (atual === estado) atual = null;
    return window.movimento.esconderCamada(estado.el).then(function () {
      estado.el.remove();
    });
  }

  function criar(texto, opcoes) {
    var el = document.createElement('div');
    el.className = 'aviso glass';
    el.hidden = true;
    var mensagem = document.createElement('span');
    mensagem.textContent = texto;
    el.appendChild(mensagem);

    var estado = { el: el, restante: opcoes.desfazer ? TEMPO_COM_DESFAZER : TEMPO_SEM_DESFAZER };

    if (opcoes.desfazer) {
      var botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'btn btn-secondary';
      botao.textContent = opcoes.rotuloDesfazer || 'Desfazer';
      botao.addEventListener('click', function () {
        opcoes.desfazer();
        fechar(estado);
      });
      el.appendChild(botao);
    }

    el.addEventListener('pointerenter', function () { pausar(estado); });
    el.addEventListener('focusin', function () { pausar(estado); });
    el.addEventListener('pointerleave', function () { setTimeout(function () { retomar(estado); }); });
    el.addEventListener('focusout', function () { setTimeout(function () { retomar(estado); }); });
    return estado;
  }

  function mostrar(texto, opcoes) {
    opcoes = opcoes || {};
    fila = fila.then(function () {
      var anterior = atual;
      var novo = criar(texto, opcoes);
      atual = novo;
      return fechar(anterior).then(function () {
        garantirZona().appendChild(novo.el);
        window.movimento.mostrarCamada(novo.el);
        armar(novo);
      });
    });
    return fila;
  }

  // a região anunciada precisa existir antes do primeiro aviso, senão o leitor de tela não anuncia
  if (document.body) garantirZona();
  else document.addEventListener('DOMContentLoaded', garantirZona);

  window.aviso = {
    mostrar: mostrar,
    fechar: function () { return fechar(atual); },
  };
})();
