const dashboardService = require('../services/dashboard.service');

// lê a requisição e monta a resposta

// GET /api/dashboard?pacienteId=1&dias=7
//
// TODO(sessão): FALHA DE SEGURANÇA CONHECIDA. a rota não exige login e confia no
// pacienteId que vem na URL: qualquer pessoa lê os dados de saúde de qualquer
// paciente só trocando o número. quando existir sessão:
//   - proteger a rota com um middleware que responde 401 sem sessão válida;
//   - pegar o paciente da sessão (ex.: req.pacienteId) e ignorar o da URL;
//   - responder com Cache-Control: no-store (dado sensível não fica em cache).
function resumo(req, res) {
  const pacienteId = Number(req.query.pacienteId);
  const dias = req.query.dias === undefined ? 7 : Number(req.query.dias);

  if (!Number.isInteger(pacienteId) || pacienteId <= 0) {
    return res.status(400).json({ error: 'Informe um paciente válido.' });
  }

  if (!dashboardService.periodoValido(dias)) {
    const periodos = dashboardService.PERIODOS_VALIDOS.join(', ');
    return res.status(400).json({ error: `Período inválido. Use ${periodos} dias.` });
  }

  const dados = dashboardService.montarResumo(pacienteId, dias);

  if (!dados) {
    return res.status(404).json({ error: 'Paciente não encontrado.' });
  }

  return res.json(dados);
}

module.exports = { resumo };
