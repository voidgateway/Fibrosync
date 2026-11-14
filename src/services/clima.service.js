const climaRepository = require('../repositories/clima.repository');

// clima mostrado no check-in (registro diário).
// devolve só o que a tela usa; pressão e umidade ficam para o dashboard.
function formatar(clima) {
  return {
    cidade: clima.cidade,
    temperatura: clima.temperatura,
    minima: clima.minima,
    maxima: clima.maxima,
    condicao: clima.condicao,
  };
}

function buscarAtual() {
  return formatar(climaRepository.buscarAtual());
}

// clima de uma cidade escolhida, ou null se ela não estiver na lista
function buscarPorCidade(nome) {
  const clima = climaRepository.buscarPorCidade(nome);
  return clima ? formatar(clima) : null;
}

function buscarAutomatica() {
  return formatar(climaRepository.buscarAutomatica());
}

function listarCidades() {
  return climaRepository.listarCidades().map(({ cidade, uf }) => ({ cidade, uf }));
}

module.exports = { buscarAtual, buscarPorCidade, buscarAutomatica, listarCidades };
