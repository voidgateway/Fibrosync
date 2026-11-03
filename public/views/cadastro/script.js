document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-cadastro");
    const inputNome = document.getElementById("nome");
    const inputSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggle-senha");
    const entrarBtn = document.getElementById("entrar-btn");

    function validarTextoPreenchido(campo, mensagem) {
        const preenchido = campo.value.trim().length > 0;
        campo.setCustomValidity(preenchido ? "" : mensagem);
    }

    if (inputSenha && toggleSenha) {
        // Alterna entre senha oculta (pontos) e visível.
        toggleSenha.addEventListener("click", () => {
            const visivel = inputSenha.type === "password";

            inputSenha.type = visivel ? "text" : "password";
            toggleSenha.classList.toggle("senha-visivel", visivel);
            toggleSenha.setAttribute("aria-pressed", String(visivel));
            toggleSenha.setAttribute("aria-label", visivel ? "Esconder senha" : "Mostrar senha");
            inputSenha.focus();
        });
    }

    if (formulario) {
        [inputNome, inputSenha].forEach((campo) => {
            campo.addEventListener("input", () => campo.setCustomValidity(""));
        });

        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            validarTextoPreenchido(inputNome, "Informe seu nome.");
            validarTextoPreenchido(inputSenha, "Informe uma senha.");

            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }

            // vou incluir o envio do formulario em outra entrega, 
            // preciso definir como funcionara o mokeup dos dados, 
            // como não ha back apenas mando direto para a proxima pagina, 
            // não quero usar o sessionStorage ou localStorage
            // isso vale para as duas paginas (cadastro e dados-complementares)

            window.location.href = "/public/views/dados-complementares/index.html";
        });
    }

    if (entrarBtn) {
        entrarBtn.addEventListener("click", () => {
            window.location.href = "/public/views/login-paciente/index.html";
        });
    }
});
