// Tema: claro, escuro ou seguir o sistema (decisão 2.9 da transição).
// Carregue no <head>, ANTES dos CSS e sem defer, para a página não piscar no tema errado:
//   <script src="../../assets/js/tema.js"></script>
//
// Sem escolha salva, o <html> fica sem data-theme e os tokens seguem o sistema
// (@media prefers-color-scheme). A escolha fica no localStorage; se o navegador
// bloquear o armazenamento, a página continua funcionando e só não lembra.
//
// Uso em Configurações › Aparência:
//   window.tema.atual()          // 'claro' | 'escuro' | 'sistema'
//   window.tema.escolher('escuro')
(function () {
  var CHAVE = 'tema';
  var VALORES = { claro: 'light', escuro: 'dark' };

  function ler() {
    try {
      var valor = localStorage.getItem(CHAVE);
      return VALORES[valor] ? valor : 'sistema';
    } catch (erro) {
      return 'sistema';
    }
  }

  function aplicar(escolha) {
    var raiz = document.documentElement;
    if (VALORES[escolha]) raiz.setAttribute('data-theme', VALORES[escolha]);
    else raiz.removeAttribute('data-theme');
  }

  function escolher(escolha) {
    try {
      if (VALORES[escolha]) localStorage.setItem(CHAVE, escolha);
      else localStorage.removeItem(CHAVE);
    } catch (erro) {
      // sem armazenamento: vale só nesta página
    }
    aplicar(escolha);
  }

  aplicar(ler());

  // a escolha feita em outra aba vale nesta também
  window.addEventListener('storage', function (evento) {
    if (evento.key === CHAVE) aplicar(ler());
  });

  window.tema = { atual: ler, escolher: escolher };
})();
