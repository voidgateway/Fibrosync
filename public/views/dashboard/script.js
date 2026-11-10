document.addEventListener("DOMContentLoaded", () => {
    const painel = document.getElementById("painel");
    const mensagemStatus = document.getElementById("mensagem-status");
    const botoesPeriodo = [...document.querySelectorAll(".filtro[data-dias]")];

    const usuarioNome = document.getElementById("usuario-nome");
    const usuarioInicial = document.getElementById("usuario-inicial");

    const dorRecente = document.getElementById("dor-recente");
    const dorRecenteLegenda = document.getElementById("dor-recente-legenda");
    const dorMedia = document.getElementById("dor-media");
    const dorMediaLegenda = document.getElementById("dor-media-legenda");
    const dorPico = document.getElementById("dor-pico");
    const dorPicoLegenda = document.getElementById("dor-pico-legenda");

    const contextoIndicador = document.getElementById("contexto-indicador");
    const contextoDetalhe = document.getElementById("contexto-detalhe");
    const listaAreas = document.getElementById("lista-areas");

    const cargaValor = document.getElementById("carga-valor");
    const cargaLegenda = document.getElementById("carga-legenda");

    const climaTemperatura = document.getElementById("clima-temperatura");
    const climaCondicao = document.getElementById("clima-condicao");
    const climaAlerta = document.getElementById("clima-alerta");

    const insightDisposicao = document.getElementById("insight-disposicao");
    const insightDisposicaoTitulo = document.getElementById("insight-disposicao-titulo");
    const insightDisposicaoTexto = document.getElementById("insight-disposicao-texto");
    const insightDor = document.getElementById("insight-dor");
    const insightDorTexto = document.getElementById("insight-dor-texto");

    // o login ainda não repassa o paciente para cá (e o time decidiu não usar
    // sessionStorage/localStorage), então o id vem da URL (?paciente=1)
    // e, sem ele, usamos o paciente do mock (src/mocks/pacientes.json).
    //
    // TODO(sessão): quando existir sessão, o servidor descobre o paciente pelo
    // cookie; aí este id da URL sai daqui e do fetch, e uma resposta 401 deve
    // mandar para o login com window.location.replace("../login-paciente/index.html").
    // também tratar o voltar do navegador: no evento "pageshow" com
    // event.persisted, recarregar a página para o servidor conferir a sessão.
    const parametros = new URLSearchParams(window.location.search);
    const pacienteId = parametros.get("paciente") || "1";

    // evita que uma resposta antiga sobrescreva a do último período clicado
    let requisicaoAtual = 0;

    function formatarNota(valor, casas = 0) {
        const numero = valor.toLocaleString("pt-BR", {
            minimumFractionDigits: casas,
            maximumFractionDigits: casas
        });

        return `${numero}/10`;
    }

    // "2026-11-09" -> "9 de novembro"
    function formatarData(data) {
        const [ano, mes, dia] = data.split("-").map(Number);

        return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long"
        });
    }

    function nivelDaDor(dor) {
        if (dor <= 3) return "leve";
        if (dor <= 6) return "moderada";
        return "forte";
    }

    function mostrarPaciente(paciente) {
        usuarioNome.textContent = paciente.nome;
        usuarioInicial.textContent = paciente.nome.trim().charAt(0).toUpperCase();
    }

    function mostrarDor(dor, periodo) {
        if (!dor.recente) {
            dorRecente.textContent = formatarNota(0);
            dorRecenteLegenda.textContent = "Sem registros no período";
            dorMedia.textContent = formatarNota(0, 1);
            dorMediaLegenda.textContent = `Média diária dos últimos ${periodo.dias} dias`;
            dorPico.textContent = formatarNota(0, 1);
            dorPicoLegenda.textContent = "Sem histórico";
            return;
        }

        dorRecente.textContent = formatarNota(dor.recente.valor);
        dorRecenteLegenda.textContent = `Registrada em ${formatarData(dor.recente.data)}`;
        dorMedia.textContent = formatarNota(dor.media, 1);
        dorMediaLegenda.textContent = `Média diária dos últimos ${periodo.dias} dias`;
        dorPico.textContent = formatarNota(dor.pico.valor, 1);
        dorPicoLegenda.textContent = `Em ${formatarData(dor.pico.data)}`;
    }

    function mostrarContexto(contexto) {
        if (!contexto) {
            delete contextoIndicador.dataset.nivel;
            contextoDetalhe.textContent = "";
            return;
        }

        const observacao = contexto.observacao ? ` · ${contexto.observacao}` : "";

        contextoIndicador.dataset.nivel = nivelDaDor(contexto.dor);
        contextoDetalhe.textContent =
            `${formatarData(contexto.data)}: dor ${formatarNota(contexto.dor)}, ` +
            `disposição ${formatarNota(contexto.disposicao)}${observacao}`;
    }

    function mostrarAreas(areas) {
        listaAreas.replaceChildren();

        if (areas.length === 0) {
            const vazio = document.createElement("li");
            vazio.className = "vazio";
            vazio.textContent = "Nenhuma área registrada no período.";
            listaAreas.append(vazio);
            return;
        }

        areas.forEach((area) => {
            const item = document.createElement("li");
            const nome = document.createElement("span");
            const citacoes = document.createElement("span");
            const intensidade = document.createElement("span");

            nome.textContent = area.regiao;
            citacoes.className = "citacoes";
            citacoes.textContent = area.citacoes === 1 ? "1 registro" : `${area.citacoes} registros`;
            nome.append(citacoes);

            intensidade.className = "valor";
            intensidade.textContent = formatarNota(Math.round(area.intensidadeMedia));
            intensidade.setAttribute("aria-label", `intensidade média ${intensidade.textContent}`);

            item.append(nome, intensidade);
            listaAreas.append(item);
        });
    }

    function mostrarCarga(carga) {
        if (!carga) {
            cargaValor.textContent = formatarNota(0, 1);
            cargaLegenda.textContent = "Sem sintomas registrados no período";
            return;
        }

        cargaValor.textContent = formatarNota(carga.media, 1);
        cargaLegenda.textContent = `Último dia observado: ${formatarData(carga.ultimoDia)}`;
    }

    function mostrarClima(clima) {
        climaTemperatura.textContent = `${clima.temperatura}°C`;
        climaCondicao.textContent = clima.condicao;
        climaAlerta.textContent = clima.alerta;
    }

    function mostrarInsights(insights) {
        insightDisposicao.dataset.tendencia = insights.disposicao.tendencia;
        insightDisposicaoTitulo.textContent = insights.disposicao.titulo;
        insightDisposicaoTexto.textContent = insights.disposicao.mensagem;

        insightDor.dataset.tipo = insights.dor.tipo;
        insightDorTexto.textContent = insights.dor.mensagem;

        // insight novo: o voto anterior não vale mais
        document.querySelectorAll(".feedback-btn").forEach((botao) => {
            botao.setAttribute("aria-pressed", "false");
        });
    }

    function marcarPeriodo(dias) {
        botoesPeriodo.forEach((botao) => {
            const ativo = botao.dataset.dias === String(dias);
            botao.classList.toggle("ativo", ativo);
            botao.setAttribute("aria-pressed", String(ativo));
        });
    }

    // os dados ficam no servidor (src/mocks); a tela só pede o resumo pronto
    async function carregarDashboard(dias) {
        const requisicao = ++requisicaoAtual;

        marcarPeriodo(dias);
        painel.setAttribute("aria-busy", "true");
        mensagemStatus.textContent = "";

        try {
            const resposta = await fetch(
                `/api/dashboard?pacienteId=${encodeURIComponent(pacienteId)}&dias=${dias}`
            );
            const dados = await resposta.json();

            if (requisicao !== requisicaoAtual) return;

            if (!resposta.ok) {
                mensagemStatus.textContent = dados.error || "Não foi possível carregar o dashboard.";
                return;
            }

            mostrarPaciente(dados.paciente);
            mostrarDor(dados.dor, dados.periodo);
            mostrarContexto(dados.contexto);
            mostrarAreas(dados.areas);
            mostrarCarga(dados.cargaSintomas);
            mostrarClima(dados.clima);
            mostrarInsights(dados.insights);
        } catch {
            // servidor fora do ar ou sem conexão
            if (requisicao !== requisicaoAtual) return;
            mensagemStatus.textContent = "Não foi possível conectar. Tente novamente em instantes.";
        } finally {
            if (requisicao === requisicaoAtual) {
                painel.setAttribute("aria-busy", "false");
            }
        }
    }

    botoesPeriodo.forEach((botao) => {
        botao.addEventListener("click", () => carregarDashboard(Number(botao.dataset.dias)));
    });

    // útil / não útil: só um voto por card. o envio do feedback para a API
    // entra em outra entrega; por enquanto fica só na tela.
    document.querySelectorAll(".feedback").forEach((grupo) => {
        const botoes = [...grupo.querySelectorAll(".feedback-btn")];

        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                const marcar = botao.getAttribute("aria-pressed") !== "true";

                botoes.forEach((outro) => outro.setAttribute("aria-pressed", "false"));
                botao.setAttribute("aria-pressed", String(marcar));
            });
        });
    });

    carregarDashboard(7);
});
