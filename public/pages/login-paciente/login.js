// ==============================
// ELEMENTOS DO FORMULÁRIO
// ==============================
//LOCALIZA ELEMENTOS DO FORMULÁRIO
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const emailError = document.getElementById("emailError");
const senhaError = document.getElementById("senhaError");
const loginMessage = document.getElementById("loginMessage");
const toggleSenha = document.getElementById("toggleSenha");
const iconeSenha = document.getElementById("iconeSenha");

// ==============================
// MOSTRAR OU OCULTAR SENHA
// ==============================

toggleSenha.addEventListener("click", () => {
    const mostrarSenha = senhaInput.type === "password";//esconde os caracteres digitados
    senhaInput.type = mostrarSenha ? "text" : "password";//deixam os caracteres visiveis

    iconeSenha.textContent = mostrarSenha
        ? "visibility_off"
        : "visibility";

    toggleSenha.setAttribute(
        "aria-label",
        mostrarSenha ? "Ocultar senha" : "Mostrar senha"
    );

    toggleSenha.setAttribute(
        "aria-pressed",
        String(mostrarSenha)
    );
});

// ==============================
// LIMPAR MENSAGENS
// ==============================

function limparMensagens() {
    emailError.textContent = "";
    senhaError.textContent = "";
    loginMessage.textContent = "";

    emailInput.removeAttribute("aria-invalid");
    senhaInput.removeAttribute("aria-invalid");
}

// Limpa o erro do e-mail quando o usuário digitar
emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.removeAttribute("aria-invalid");
    loginMessage.textContent = "";
});

// Limpa o erro da senha quando o usuário digitar
senhaInput.addEventListener("input", () => {
    senhaError.textContent = "";
    senhaInput.removeAttribute("aria-invalid");
    loginMessage.textContent = "";
});

// ==============================
// VALIDAR CAMPOS
// ==============================

function validarCampos() {
    limparMensagens();

    let valido = true;

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    // Validação do e-mail
    if (email === "") {
        emailError.textContent = "Informe seu e-mail.";

        emailInput.setAttribute("aria-invalid", "true");

        valido = false;

    } else if (!emailInput.validity.valid) {
        emailError.textContent = "Digite um e-mail válido.";

        emailInput.setAttribute("aria-invalid", "true");

        valido = false;
    }

    // Validação da senha
    if (senha.trim() === "") {
        senhaError.textContent = "Informe sua senha.";

        senhaInput.setAttribute("aria-invalid", "true");

        valido = false;

    } else if (senha.length < 8) {
        senhaError.textContent =
            "A senha deve possuir pelo menos 8 caracteres.";

        senhaInput.setAttribute("aria-invalid", "true");

        valido = false;
    }

    return valido;
}

// ==============================
// REALIZAR LOGIN
// ==============================
//Impede o envio do formulário quando há erros
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Impede o login se houver campos inválidos
    if (!validarCampos()) {
        return;
    }

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    /*
      CREDENCIAIS PARA TESTE ACADÊMICO.

      Em uma aplicação real, a autenticação deverá
      ser realizada por um backend/API.
    */

    const usuarioTeste = {
        email: "vivi@gmail.com",
        senha: "Vivi1234"
    };

    // Verifica as credenciais
    if (
        email === usuarioTeste.email &&
        senha === usuarioTeste.senha
    ) {
        loginMessage.style.color = "#168653";

        loginMessage.textContent =
            "Login realizado com sucesso!";

        // Redireciona para o painel
        window.location.href = "dashboard.html";

    } else {
        loginMessage.style.color = "#d62965";

        loginMessage.textContent =
            "E-mail ou senha inválidos. Verifique suas credenciais.";

        senhaInput.setAttribute("aria-invalid", "true");
    }
});