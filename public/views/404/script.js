// "Voltar" só aparece quando há uma página anterior nesta aba (gosto.md, 21/11/2026).
// Sem JS, ele continua escondido e fica só "Ir para a página inicial".
//
// navigation.canGoBack diz exatamente se dá para voltar. Onde ele não existe, a reserva é
// history.length, que conta também as páginas "à frente": nesse caso raro, o botão pode
// aparecer sem ter para onde voltar.
(function () {
  var voltar = document.querySelector('[data-voltar]');
  if (!voltar) return;
  var podeVoltar = window.navigation && typeof window.navigation.canGoBack === 'boolean'
    ? window.navigation.canGoBack
    : window.history.length > 1;
  if (!podeVoltar) return;
  voltar.hidden = false;
  voltar.addEventListener('click', function () { window.history.back(); });
})();
