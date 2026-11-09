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
const loginButton = document.getElementById("loginButton");
const loginButtonText = loginButton.querySelector(".login-button-text");
const loginDialog = document.getElementById("loginDialog");
const salvarLogin = document.getElementById("salvarLogin");
const naoSalvarLogin = document.getElementById("naoSalvarLogin");

// Próxima tela após o login (ainda não criada em public/views)
const PROXIMA_TELA = "../dashboard/index.html";

// Chave usada para lembrar o e-mail neste dispositivo.
// A senha nunca é salva no navegador.
const CHAVE_EMAIL_SALVO = "fibrosync:login-email";

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
    loginMessage.classList.remove("sucesso");

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
// LEMBRAR E-MAIL
// ==============================

// localStorage pode falhar (aba anônima, armazenamento bloqueado);
// nesse caso o login continua funcionando, só não lembra o e-mail.
function lerEmailSalvo() {
    try {
        return localStorage.getItem(CHAVE_EMAIL_SALVO) || "";
    } catch {
        return "";
    }
}

function salvarEmail(email) {
    try {
        localStorage.setItem(CHAVE_EMAIL_SALVO, email);
    } catch {
        // sem armazenamento disponível
    }
}

function esquecerEmail() {
    try {
        localStorage.removeItem(CHAVE_EMAIL_SALVO);
    } catch {
        // sem armazenamento disponível
    }
}

// Preenche o e-mail salvo em um login anterior
const emailSalvo = lerEmailSalvo();

if (emailSalvo) {
    emailInput.value = emailSalvo;
}

// ==============================
// FEEDBACK DE CARREGAMENTO
// ==============================

function definirCarregando(carregando) {
    loginButton.disabled = carregando;
    loginButton.classList.toggle("carregando", carregando);
    loginButton.setAttribute("aria-busy", String(carregando));
    loginButtonText.textContent = carregando ? "Validando..." : "Entrar";
}

// ==============================
// CONFIRMAÇÃO E PRÓXIMA TELA
// ==============================

function seguirParaProximaTela(salvar) {
    if (salvar) {
        salvarEmail(emailInput.value.trim());
    } else {
        esquecerEmail();
    }

    loginDialog.close();

    loginMessage.classList.add("sucesso");
    loginMessage.textContent = "Login realizado com sucesso! Redirecionando...";

    definirCarregando(true);
    loginButtonText.textContent = "Entrando...";

    window.location.href = PROXIMA_TELA;
}

salvarLogin.addEventListener("click", () => seguirParaProximaTela(true));
naoSalvarLogin.addEventListener("click", () => seguirParaProximaTela(false));

// Fechar com Esc cancela a confirmação e volta para o formulário
loginDialog.addEventListener("cancel", () => {
    definirCarregando(false);
});

// ==============================
// REALIZAR LOGIN
// ==============================
//Impede o envio do formulário quando há erros
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Impede o login se houver campos inválidos
    if (!validarCampos()) {
        // Leva o foco ao primeiro campo com erro
        loginForm.querySelector('[aria-invalid="true"]')?.focus();
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

    definirCarregando(true);

    // Simula o tempo de resposta do servidor
    setTimeout(() => {
        // Verifica as credenciais
        if (
            email === usuarioTeste.email &&
            senha === usuarioTeste.senha
        ) {
            loginDialog.showModal();
            salvarLogin.focus();

        } else {
            definirCarregando(false);

            loginMessage.textContent =
                "E-mail ou senha inválidos. Verifique suas credenciais.";

            senhaInput.setAttribute("aria-invalid", "true");
            senhaInput.focus();
        }
    }, 800);
});
