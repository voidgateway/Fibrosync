const pacientesService = require('../services/pacientes.service');

// lê a requisição e monta a resposta

// POST /api/pacientes/login  { email, senha }
//
// TODO(sessão): o login só confere as credenciais e responde 200; nenhuma
// sessão é criada, então o servidor não sabe quem está logado depois disso.
// quando existir sessão: gerar um token aleatório aqui e devolvê-lo em um
// cookie HttpOnly + SameSite=Lax (+ Secure em produção), e criar a rota
// POST /api/pacientes/logout que apaga a sessão e o cookie.
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

// GET /api/pacientes/:id
//
// TODO(sessão): mesma falha conhecida do /api/dashboard: confia no id da URL.
// quando existir sessão, pegar o paciente da sessão e ignorar o :id.
function buscar(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Informe um paciente válido.' });
  }

  const paciente = pacientesService.buscarPorId(id);

  if (!paciente) {
    return res.status(404).json({ error: 'Paciente não encontrado.' });
  }

  return res.json({ paciente });
}

module.exports = { login, buscar };
