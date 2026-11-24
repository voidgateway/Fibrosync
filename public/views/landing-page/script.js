// Landing: as peças animam quando entram na tela (IntersectionObserver, limiar .45).
// Base: redesign/revisao/telas/landing/02-prototipo.html. Tempos do protótipo (exceção registrada
// no gosto.md em 19/11/2026). Com "reduzir movimento", tudo vai direto ao estado final.
// O HTML já vem no estado final; aqui as peças voltam ao começo e animam até ele.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var REGUA_FINAL = 6;
  var regua = $$('#rg i');
  var valoresAchado = $$('#ach .v');

  // volta ao começo as peças cujo começo não é só CSS
  function comecar() {
    regua.forEach(function (c) { c.className = ''; });
    $('#rv').textContent = '–';
    valoresAchado.forEach(function (v) { v.textContent = '0'; });
  }

  var anima = {
    semana: function (el) { el.classList.add('on'); },
    rel: function (el) {
      $$('#rel tr').forEach(function (r, k) { r.style.transitionDelay = (1000 + k * 140) + 'ms'; });
      el.classList.add('on');
    },
    regua: function () {
      var v = calmo ? REGUA_FINAL : 0;
      function passo() {
        regua.forEach(function (c, i) { c.classList.toggle('f', i < v); c.classList.toggle('c', i === v); });
        $('#rv').textContent = v;
        if (v < REGUA_FINAL) { v++; setTimeout(passo, 140); }
      }
      passo();
    },
    cal: function () {
      $$('#calg i').forEach(function (b, k) {
        setTimeout(function () { b.style.width = 'calc((100% - 16px) * ' + b.style.getPropertyValue('--w') + ')'; }, calmo ? 0 : 60 * k);
      });
    },
    ach: function () {
      $$('#ach .tr i').forEach(function (b) { b.style.width = b.style.getPropertyValue('--w'); });
      valoresAchado.forEach(function (v) {
        var alvo = +v.dataset.n, t0 = performance.now(), dur = calmo ? 0 : 800;
        function quadro(t) {
          var p = dur ? Math.min(1, (t - t0) / dur) : 1;
          v.textContent = (alvo * p).toFixed(1).replace('.', ',');
          if (p < 1) requestAnimationFrame(quadro);
        }
        requestAnimationFrame(quadro);
      });
    },
  };

  // sem o observador, a página fica no estado final
  if (!('IntersectionObserver' in window)) { document.documentElement.classList.remove('com-js'); return; }

  comecar();
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { anima[e.target.id](e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.45 });
  $$('[data-anim]').forEach(function (el) { io.observe(el); });
})();
