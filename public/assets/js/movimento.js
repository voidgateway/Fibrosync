// Ajudantes de movimento (sistema em redesign/revisao/movimento/02-sistema.md).
// Toda animação feita em JS passa por aqui, para seguir os tokens e o "reduzir movimento".
//   <script src="../../assets/js/movimento.js" defer></script>
//
// Reduzir movimento = trocar por fade curto: entrar e sair viram só opacidade em
// --motion-instant, a mola não acontece e as peças narrativas vão direto ao fim.
(function () {
  var consulta = window.matchMedia('(prefers-reduced-motion: reduce)');

  function reduzido() {
    return consulta.matches;
  }

  // lê um token de tempo ('--motion-base' → 240) ou de curva
  function token(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }
  function ms(nome) {
    return parseFloat(token(nome)) || 0;
  }

  // tipo: 'entra' | 'sai' | 'narrativo'
  function mover(el, quadros, opcoes) {
    opcoes = opcoes || {};
    var tipo = opcoes.tipo || 'entra';
    if (reduzido()) {
      if (tipo === 'narrativo') {
        return el.animate([quadros[quadros.length - 1]], { duration: 0, fill: 'both' });
      }
      var opacidade = tipo === 'sai' ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }];
      return el.animate(opacidade, { duration: ms('--motion-instant'), fill: 'both' });
    }
    return el.animate(quadros, {
      duration: ms(opcoes.duracao || (tipo === 'sai' ? '--motion-exit' : '--motion-base')),
      easing: token(opcoes.curva || (tipo === 'sai' ? '--motion-ease-exit' : '--motion-ease')),
      delay: opcoes.atraso || 0,
      fill: 'both',
    });
  }

  // Resposta ao escolher (humor, régua, corpo). Só ao escolher, nunca ao desmarcar.
  function escolher(el) {
    if (reduzido()) return;
    el.classList.remove('fs-mola');
    void el.offsetWidth; // reinicia a animação se escolher de novo
    el.classList.add('fs-mola');
    el.addEventListener('animationend', function fim() {
      el.classList.remove('fs-mola');
      el.removeEventListener('animationend', fim);
    });
  }

  // Camada que flutua (diálogo, aviso, balão)
  function mostrarCamada(el) {
    el.hidden = false;
    el.classList.remove('fs-camada-sai');
    el.classList.add('fs-camada-entra');
  }
  // Sai encolhendo e só então some; resolve quando terminou (para devolver o foco).
  function esconderCamada(el) {
    return new Promise(function (resolver) {
      el.classList.remove('fs-camada-entra');
      el.classList.add('fs-camada-sai');
      var pronto = false;
      function fim() {
        if (pronto) return;
        pronto = true;
        el.hidden = true;
        el.classList.remove('fs-camada-sai');
        resolver();
      }
      el.addEventListener('animationend', fim, { once: true });
      setTimeout(fim, ms('--motion-exit') + 50); // se a animação não rodar
    });
  }

  // Esperar sem spinner: aoDemorar só roda se a promessa passar de --motion-wait.
  //   movimento.esperar(gerarPdf(), () => { botao.textContent = 'Gerando o PDF…' })
  function esperar(promessa, aoDemorar) {
    var relogio = setTimeout(aoDemorar, ms('--motion-wait'));
    return Promise.resolve(promessa).finally(function () {
      clearTimeout(relogio);
    });
  }

  window.movimento = {
    reduzido: reduzido,
    token: token,
    ms: ms,
    mover: mover,
    escolher: escolher,
    mostrarCamada: mostrarCamada,
    esconderCamada: esconderCamada,
    esperar: esperar,
  };
})();
