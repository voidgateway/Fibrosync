const pacientesService = require('../services/pacientes.service');

// lê a requisição e monta a resposta

function texto(valor) {
  return typeof valor === 'string' ? valor : '';
}

// POST /api/pacientes/login  { email, senha }
//
// TODO(sessão): o login só confere as credenciais e responde 200; nenhuma
// sessão é criada, então o servidor não sabe quem está logado depois disso.
// quando existir sessão: gerar um token aleatório aqui e devolvê-lo em um
// cookie HttpOnly + SameSite=Lax (+ Secure em produção), e criar a rota
// POST /api/pacientes/logout que apaga a sessão e o cookie.
function login(req, res) {
  const email = texto(req.body?.email).trim();
  const senha = texto(req.body?.senha);

  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const paciente = pacientesService.autenticar(email, senha);

  if (!paciente) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  return res.json({ paciente });
}

// POST /api/pacientes  { nome, email, senha }
// 201 com o paciente; 409 quando o e-mail já tem conta.
// TODO(sessão): como no login, a conta é criada sem abrir sessão.
function cadastrar(req, res) {
  const nome = texto(req.body?.nome).trim();
  const email = texto(req.body?.email).trim();
  const senha = texto(req.body?.senha);

  if (!nome || !pacientesService.emailValido(email) || !pacientesService.senhaValida(senha)) {
    return res.status(400).json({ error: 'Confira o nome, o e-mail e as regras da senha.' });
  }

  const { paciente, erro } = pacientesService.cadastrar({ nome, email, senha });

  if (erro === 'existe') {
    return res.status(409).json({ error: 'Já existe uma conta com este e-mail.' });
  }

  return res.status(201).json({ paciente });
}

// POST /api/pacientes/senha/link  { email }
// Responde 202 sempre, exista a conta ou não, para não revelar quem tem conta.
// TODO(e-mail): sem envio de e-mail, o link é escrito no terminal do servidor.
function pedirLinkDeSenha(req, res) {
  const email = texto(req.body?.email).trim();

  if (!pacientesService.emailValido(email)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  const token = pacientesService.criarLinkDeSenha(email);

  if (token) {
    const link = `${req.protocol}://${req.get('host')}/trocar_senha/?token=${token}`;
    console.log(`[e-mail falso] link para criar senha nova de ${email}: ${link}`);
  }

  return res.status(202).json({ ok: true });
}

// GET /api/pacientes/senha/:token
// 200 com o e-mail da conta; 410 quando o link venceu, já foi usado ou não existe.
function conferirLinkDeSenha(req, res) {
  const email = pacientesService.contaDoLink(req.params.token);

  if (!email) {
    return res.status(410).json({ error: 'Este link não vale mais.' });
  }

  return res.json({ email });
}

// POST /api/pacientes/senha  { token, senha }
function trocarSenha(req, res) {
  const token = texto(req.body?.token);
  const senha = texto(req.body?.senha);

  if (!pacientesService.senhaValida(senha)) {
    return res.status(400).json({ error: 'A senha não cumpre as regras.' });
  }

  const paciente = pacientesService.trocarSenha(token, senha);

  if (!paciente) {
    return res.status(410).json({ error: 'Este link não vale mais.' });
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

module.exports = { login, cadastrar, pedirLinkDeSenha, conferirLinkDeSenha, trocarSenha, buscar };
