const pacientesService = require('../services/pacientes.service');

// lê a requisição e monta a resposta

// POST /api/pacientes/login  { email, senha }
function login(req, res) {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';

  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const paciente = pacientesService.autenticar(email, senha);

  if (!paciente) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  return res.json({ paciente });
}

module.exports = { login };
