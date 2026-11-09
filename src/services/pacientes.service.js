const pacientesRepository = require('../repositories/pacientes.repository');

// regras de negócio dos pacientes

// devolve o paciente (sem a senha) se as credenciais baterem, senão null
function autenticar(email, senha) {
  const paciente = pacientesRepository.buscarPorEmail(email);

  if (!paciente || paciente.senha !== senha) {
    return null;
  }

  return semSenha(paciente);
}

// a senha nunca sai do servidor
function semSenha(paciente) {
  const { senha, ...resto } = paciente;
  return resto;
}

module.exports = { autenticar };
