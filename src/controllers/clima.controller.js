const climaService = require('../services/clima.service');

// lê a requisição e monta a resposta

// GET /api/clima               -> clima atual
// GET /api/clima?cidade=Nome   -> clima da cidade escolhida no check-in
function atual(req, res) {
  const cidade = typeof req.query.cidade === 'string' ? req.query.cidade.trim() : '';

  if (!cidade) {
    return res.json(climaService.buscarAtual());
  }

  const clima = climaService.buscarPorCidade(cidade);

  if (!clima) {
    return res.status(404).json({ error: 'Cidade não encontrada.' });
  }

  return res.json(clima);
}

// GET /api/clima/cidades -> cidades que podem ser escolhidas
function cidades(req, res) {
  return res.json(climaService.listarCidades());
}

// GET /api/clima/automatica
//
// TODO(localização): hoje devolve a cidade fixa do mock (clima-cidades.json).
// com um serviço de clima real, a tela manda lat/long do navigator.geolocation
// e a cidade é descoberta a partir delas.
function automatica(req, res) {
  return res.json(climaService.buscarAutomatica());
}

module.exports = { atual, cidades, automatica };
