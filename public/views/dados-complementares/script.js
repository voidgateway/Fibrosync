document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-dados-complementares");
    const campoGenero = document.getElementById("genero");
    const campoDataNascimento = document.getElementById("data-nascimento");
    const campoData = campoDataNascimento.closest(".campo-data");
    const opcoesHistorico = [...document.querySelectorAll('input[name="historicoCondicao"]')];
    const preencherDepois = document.getElementById("preencher-depois");
    const mensagemStatus = document.getElementById("mensagem-status");

    const camposComplementares = [campoGenero, campoDataNascimento, ...opcoesHistorico];

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaAtual = String(hoje.getDate()).padStart(2, "0");

    campoDataNascimento.max = `${anoAtual}-${mesAtual}-${diaAtual}`;

    function atualizarCampoData() {
        campoData.classList.toggle("com-valor", Boolean(campoDataNascimento.value));
    }

    function limparErros() {
        document.querySelectorAll(".mensagem-erro").forEach((mensagem) => {
            mensagem.textContent = "";
        });

        document.querySelectorAll(".campo.invalido").forEach((campo) => {
            campo.classList.remove("invalido");
        });
    }

    function atualizarPreenchimento() {
        const adiarPreenchimento = preencherDepois.checked;

        camposComplementares.forEach((campo) => {
            campo.disabled = adiarPreenchimento;
            campo.required = !adiarPreenchimento &&
                (campo === campoGenero || campo === campoDataNascimento || campo === opcoesHistorico[0]);
        });

        if (adiarPreenchimento) {
            limparErros();
        }
    }

    function mostrarErro(campo, idMensagem, mensagem) {
        document.getElementById(idMensagem).textContent = mensagem;
        campo.closest(".campo")?.classList.add("invalido");
    }

    function validarFormulario() {
        limparErros();

        if (preencherDepois.checked) return true;

        let valido = true;
        const nascimento = new Date(`${campoDataNascimento.value}T00:00:00`);

        if (!campoGenero.value) {
            mostrarErro(campoGenero, "erro-genero", "Selecione uma opção de gênero.");
            valido = false;
        }

        if (!campoDataNascimento.value) {
            mostrarErro(campoDataNascimento, "erro-data-nascimento", "Informe sua data de nascimento.");
            valido = false;
        } else if (nascimento > hoje) {
            mostrarErro(campoDataNascimento, "erro-data-nascimento", "Informe uma data válida.");
            valido = false;
        }

        if (!opcoesHistorico.some((opcao) => opcao.checked)) {
            document.getElementById("erro-historico").textContent =
                "Selecione uma opção para o histórico da condição.";
            valido = false;
        }

        return valido;
    }

    preencherDepois.addEventListener("change", atualizarPreenchimento);
    campoDataNascimento.addEventListener("change", atualizarCampoData);
    campoDataNascimento.addEventListener("input", atualizarCampoData);

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        mensagemStatus.textContent = "";

        if (!validarFormulario()) {
            formulario.querySelector(".invalido select, .invalido input, input:invalid")?.focus();
            return;
        }

        // vou incluir o envio do formulario em outra entrega, 
            // preciso definir como funcionara o mokeup dos dados, 
            // como não ha back apenas mando direto para a proxima pagina, 
            // não quero usar o sessionStorage ou localStorage
            // isso vale para as duas paginas (cadastro e dados-complementares)
//fui eu que escrevi, viu vanessa

        window.location.href = "../home/index.html";
    });

    atualizarCampoData();
    atualizarPreenchimento();
});
