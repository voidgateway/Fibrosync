const dashboardService = require('../services/dashboard.service');

// lê a requisição e monta a resposta

// GET /api/dashboard?pacienteId=1&dias=7
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
