document.addEventListener("DOMContentLoaded", () => {
    const mensagemStatus = document.getElementById("mensagem-status");
    const usuarioNome = document.getElementById("usuario-nome");
    const usuarioInicial = document.getElementById("usuario-inicial");
    const alternadores = [...document.querySelectorAll(".alternar[data-preferencia]")];

    const confirmacao = document.getElementById("confirmacao");
    const confirmacaoTitulo = document.getElementById("confirmacao-titulo");
    const confirmacaoTexto = document.getElementById("confirmacao-texto");
    const confirmacaoCancelar = document.getElementById("confirmacao-cancelar");
    const confirmacaoConfirmar = document.getElementById("confirmacao-confirmar");

    // mesmo esquema do dashboard: sem sessão, o id vem da URL (?paciente=1)
    // TODO(sessão): quando existir sessão, o servidor descobre o paciente pelo cookie.
    const parametros = new URLSearchParams(window.location.search);
    const pacienteId = parametros.get("paciente") || "1";

    // preferências ficam só neste dispositivo até existir rota na API
    const CHAVE_PREFERENCIAS = "fibrosync:preferencias";

    // textos do popup de confirmação de cada ação
    const ACOES = {
        "apagar-dados": {
            titulo: "Apagar dados?",
            texto: "Todos os seus registros diários serão apagados. Essa ação não pode ser desfeita.",
            botao: "Apagar dados"
        },
        "apagar-conta": {
            titulo: "Apagar conta?",
            texto: "Sua conta e todos os seus dados serão apagados. Essa ação não pode ser desfeita.",
            botao: "Apagar conta"
        }
    };

    let acaoAtual = null;

    // ==============================
    // PACIENTE
    // ==============================

    async function carregarPaciente() {
        try {
            const resposta = await fetch(`/api/pacientes/${encodeURIComponent(pacienteId)}`);
            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagemStatus.textContent = dados.error || "Não foi possível carregar seus dados.";
                return;
            }

            usuarioNome.textContent = dados.paciente.nome;
            usuarioInicial.textContent = dados.paciente.nome.trim().charAt(0).toUpperCase();
        } catch {
            // servidor fora do ar ou sem conexão
            mensagemStatus.textContent = "Não foi possível conectar. Tente novamente em instantes.";
        }
    }

    // ==============================
    // PREFERÊNCIAS
    // ==============================

    // localStorage pode falhar (aba anônima, armazenamento bloqueado);
    // nesse caso os interruptores só não lembram a escolha.
    function lerPreferencias() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS)) || {};
        } catch {
            return {};
        }
    }

    function salvarPreferencias(preferencias) {
        try {
            localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(preferencias));
        } catch {
            // sem armazenamento disponível
        }
    }

    const preferencias = lerPreferencias();

    alternadores.forEach((alternador) => {
        const nome = alternador.dataset.preferencia;

        if (typeof preferencias[nome] === "boolean") {
            alternador.checked = preferencias[nome];
        }

        alternador.addEventListener("change", () => {
            preferencias[nome] = alternador.checked;
            salvarPreferencias(preferencias);
        });
    });

    // ==============================
    // CONFIRMAÇÃO
    // ==============================

    function abrirConfirmacao(acao) {
        const textos = ACOES[acao];

        acaoAtual = acao;
        confirmacaoTitulo.textContent = textos.titulo;
        confirmacaoTexto.textContent = textos.texto;
        confirmacaoConfirmar.textContent = textos.botao;

        confirmacao.showModal();
        // foco na opção segura
        confirmacaoCancelar.focus();
    }

    document.querySelectorAll("[data-confirmar]").forEach((botao) => {
        botao.addEventListener("click", () => abrirConfirmacao(botao.dataset.confirmar));
    });

    confirmacaoCancelar.addEventListener("click", () => confirmacao.close());

    // TODO: ainda não há rota na API para apagar registros nem a conta.
    // quando existir, chamar aqui (ex.: DELETE /api/pacientes/:id/registros e
    // DELETE /api/pacientes/:id) e, ao apagar a conta, mandar para o login.
    confirmacaoConfirmar.addEventListener("click", () => {
        confirmacao.close();
        mensagemStatus.textContent = `"${ACOES[acaoAtual].botao}" ainda não está disponível.`;
    });

    carregarPaciente();
});
