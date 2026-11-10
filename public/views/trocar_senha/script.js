
// ==========================================
// FIBROSYNC — RECUPERAÇÃO DE SENHA
// ==========================================

// ELEMENTOS DAS TELAS

const emailStep = document.getElementById("emailStep");
const confirmationStep = document.getElementById("confirmationStep");
const passwordStep = document.getElementById("passwordStep");
const successStep = document.getElementById("successStep");

// FORMULÁRIOS

const emailForm = document.getElementById("emailForm");
const passwordForm = document.getElementById("passwordForm");

// ELEMENTOS DO E-MAIL

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const displayEmail = document.getElementById("displayEmail");

// MODAL

const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageConfirm = document.getElementById("messageConfirm");

// SENHAS

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");

// ESTADO

let emailCadastrado = "";


// ==========================================
// NAVEGAÇÃO ENTRE TELAS
// ==========================================

function mostrarEtapa(etapa) {

    emailStep.classList.add("hidden");
    confirmationStep.classList.add("hidden");
    passwordStep.classList.add("hidden");
    successStep.classList.add("hidden");

    etapa.classList.remove("hidden");

}


// ==========================================
// MODAL DE MENSAGENS
// ==========================================

function mostrarMensagem(titulo, mensagem, callback) {

    messageTitle.textContent = titulo;
    messageText.textContent = mensagem;

    messageBox.classList.remove("hidden");

    messageConfirm.onclick = function () {

        messageBox.classList.add("hidden");

        if (callback) {
            callback();
        }

    };

}


// ==========================================
// ETAPA 1 — VALIDAR E-MAIL
// ==========================================

emailForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    emailError.textContent = "";

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {

        emailError.textContent = "Informe seu e-mail.";
        return;

    }

    if (!emailValido) {

        emailError.textContent = "Digite um e-mail válido.";
        return;

    }

    emailCadastrado = email;

    displayEmail.textContent = email;

    mostrarMensagem(
        "Solicitação recebida!",
        "Se o endereço informado estiver cadastrado, enviaremos as instruções para redefinir sua senha.",
        function () {

            mostrarEtapa(confirmationStep);

        }
    );

});


// ==========================================
// ETAPA 2 — REENVIAR SOLICITAÇÃO
// ==========================================

const resendButton = document.getElementById("resendButton");

const resendMessage = document.getElementById("resendMessage");

resendButton.addEventListener("click", function () {

    resendMessage.textContent =
        "Uma nova solicitação foi preparada para " + emailCadastrado + ".";

});


// ==========================================
// ETAPA 2 — CONFIRMAR E CONTINUAR
// ==========================================

const continueButton = document.getElementById("continueButton");

continueButton.addEventListener("click", function () {

    mostrarEtapa(passwordStep);

});


// ==========================================
// MOSTRAR E OCULTAR SENHA
// ==========================================

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const target = document.getElementById(
            button.dataset.target
        );

        const icon = button.querySelector("span");

        if (target.type === "password") {

            target.type = "text";

            icon.textContent = "visibility_off";

            button.setAttribute("aria-label", "Ocultar senha");

        } else {

            target.type = "password";

            icon.textContent = "visibility";

            button.setAttribute("aria-label", "Mostrar senha");

        }

    });

});


// ==========================================
// ETAPA 3 — REGRAS DA NOVA SENHA
// ==========================================

const regras = {

    ruleLength: password => password.length >= 8,

    ruleUpper: password => /[A-Z]/.test(password),

    ruleLower: password => /[a-z]/.test(password),

    ruleNumber: password => /[0-9]/.test(password),

    ruleSpecial: password => /[^A-Za-z0-9]/.test(password)

};


function validarRegrasSenha(password) {

    let senhaValida = true;

    for (const id in regras) {

        const elemento = document.getElementById(id);

        const regraAtendida = regras[id](password);

        elemento.classList.toggle("valid", regraAtendida);

        if (!regraAtendida) {

            senhaValida = false;

        }

    }

    return senhaValida;

}


newPassword.addEventListener("input", function () {

    validarRegrasSenha(newPassword.value);

    passwordError.textContent = "";

});


confirmPassword.addEventListener("input", function () {

    confirmError.textContent = "";

});


// ==========================================
// ETAPA 3 — SALVAR NOVA SENHA
// ==========================================

passwordForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const senha = newPassword.value;
    const confirmacao = confirmPassword.value;

    passwordError.textContent = "";
    confirmError.textContent = "";

    const senhaValida = validarRegrasSenha(senha);

    if (!senhaValida) {

        passwordError.textContent =
            "A senha não atende a todos os requisitos.";

        return;

    }

    if (!confirmacao) {

        confirmError.textContent =
            "Confirme sua nova senha.";

        return;

    }

    if (senha !== confirmacao) {

        confirmError.textContent =
            "As senhas não correspondem.";

        return;

    }

    mostrarMensagem(
        "Senha alterada!",
        "Sua nova senha foi validada com sucesso nesta demonstração.",
        function () {

            mostrarEtapa(successStep);

        }
    );

});
