// Tema: claro, escuro ou seguir o sistema (decisão 2.9 da transição).
// Carregue no <head>, ANTES dos CSS e sem defer, para a página não piscar no tema errado:
//   <script src="../../assets/js/tema.js"></script>
//
// O <html> sempre recebe data-theme="light" ou "dark", já resolvido. Assim o CSS
// dos componentes só precisa de [data-theme="dark"] para o acabamento do escuro.
// No modo "sistema", o atributo acompanha o sistema quando ele muda.
// Sem JS, os tokens seguem o sistema sozinhos (@media prefers-color-scheme).
//
// A escolha fica no localStorage; se o navegador bloquear o armazenamento,
// a página continua funcionando e só não lembra.
//
// Uso em Configurações › Aparência:
//   window.tema.atual()          // 'claro' | 'escuro' | 'sistema'
//   window.tema.escolher('escuro')
(function () {
  var CHAVE = 'tema';
  var VALORES = { claro: 'light', escuro: 'dark' };
  var sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  function ler() {
    try {
      var valor = localStorage.getItem(CHAVE);
      return VALORES[valor] ? valor : 'sistema';
    } catch (erro) {
      return 'sistema';
    }
  }

  function aplicar(escolha) {
    var tema = VALORES[escolha] || (sistemaEscuro.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', tema);
  }

  var escolhaAtual = ler();

  function escolher(escolha) {
    escolhaAtual = VALORES[escolha] ? escolha : 'sistema';
    try {
      if (VALORES[escolha]) localStorage.setItem(CHAVE, escolha);
      else localStorage.removeItem(CHAVE);
    } catch (erro) {
      // sem armazenamento: vale só nesta página
    }
    aplicar(escolhaAtual);
  }

  aplicar(escolhaAtual);

  // no modo "sistema", acompanha a troca do sistema
  sistemaEscuro.addEventListener('change', function () {
    if (escolhaAtual === 'sistema') aplicar('sistema');
  });

  // a escolha feita em outra aba vale nesta também
  window.addEventListener('storage', function (evento) {
    if (evento.key === CHAVE) {
      escolhaAtual = ler();
      aplicar(escolhaAtual);
    }
  });

  window.tema = {
    atual: function () {
      return escolhaAtual;
    },
    escolher: escolher,
  };
})();
