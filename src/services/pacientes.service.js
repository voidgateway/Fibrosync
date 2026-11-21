const crypto = require('node:crypto');
const pacientesRepository = require('../repositories/pacientes.repository');

// regras de negócio dos pacientes

// as mesmas regras da lista que a tela mostra (public/assets/js/entrada.js)
const REGRAS_SENHA = [
  (senha) => senha.length >= 8,
  (senha) => /[A-ZÀ-Ý]/.test(senha),
  (senha) => /\d/.test(senha),
  (senha) => /[^A-Za-zÀ-ÿ0-9\s]/.test(senha),
];

function senhaValida(senha) {
  return REGRAS_SENHA.every((regra) => regra(senha));
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// devolve o paciente (sem a senha) se as credenciais baterem, senão null
function autenticar(email, senha) {
  const paciente = pacientesRepository.buscarPorEmail(email);

  if (!paciente || paciente.senha !== senha) {
    return null;
  }

  return semSenha(paciente);
}

// devolve o paciente (sem a senha) ou null
function buscarPorId(id) {
  const paciente = pacientesRepository.buscarPorId(id);
  return paciente ? semSenha(paciente) : null;
}

// devolve { paciente } ou { erro: 'existe' }
function cadastrar({ nome, email, senha }) {
  if (pacientesRepository.buscarPorEmail(email)) {
    return { erro: 'existe' };
  }

  return { paciente: semSenha(pacientesRepository.criar({ nome, email, senha })) };
}

// ---------- recuperar a senha ----------
// TODO(e-mail): sem envio de e-mail, o link sai no terminal do servidor.
// os tokens ficam só em memória: reiniciar o servidor invalida os links.
const VALIDADE_DO_LINK = 60 * 60 * 1000; // 1 hora, como diz a tela
const links = new Map(); // token -> { id, expira }

// devolve o token, ou null quando não existe conta com o e-mail
// (a resposta da API é a mesma nos dois casos, para não revelar quem tem conta)
function criarLinkDeSenha(email) {
  const paciente = pacientesRepository.buscarPorEmail(email);
  if (!paciente) return null;

  const token = crypto.randomBytes(24).toString('base64url');
  links.set(token, { id: paciente.id, expira: Date.now() + VALIDADE_DO_LINK });
  return token;
}

// devolve o e-mail da conta do link, ou null se ele não vale mais
function contaDoLink(token) {
  const link = links.get(token);

  if (!link || link.expira < Date.now()) {
    links.delete(token);
    return null;
  }

  const paciente = pacientesRepository.buscarPorId(link.id);
  return paciente ? paciente.email : null;
}

// devolve o paciente (sem a senha), ou null se o link não vale mais
function trocarSenha(token, senha) {
  if (!contaDoLink(token)) return null;

  const { id } = links.get(token);
  links.delete(token); // cada link serve uma vez
  return semSenha(pacientesRepository.atualizarSenha(id, senha));
}

// a senha nunca sai do servidor
function semSenha(paciente) {
  const { senha, ...resto } = paciente;
  return resto;
}

module.exports = {
  autenticar,
  buscarPorId,
  cadastrar,
  criarLinkDeSenha,
  contaDoLink,
  trocarSenha,
  senhaValida,
  emailValido,
};
