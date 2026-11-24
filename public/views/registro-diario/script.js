document.addEventListener("DOMContentLoaded", () => {
    const mensagemStatus = document.getElementById("mensagem-status");
    const etapa1 = document.getElementById("etapa-1");
    const etapa2 = document.getElementById("etapa-2");
    const pontos = [...document.querySelectorAll(".ponto")];
    const escalas = [...document.querySelectorAll(".escala-controle")];
    const cardClima = document.querySelector(".card-clima");
    const climaCidade = document.getElementById("clima-cidade");
    const climaCondicao = document.getElementById("clima-condicao");
    const campoLocal = document.getElementById("campo-local");
    const listaCidades = document.getElementById("lista-cidades");
    const erroLocal = document.getElementById("erro-local");

    // TODO(sessão): sem sessão, o paciente vem da URL (?paciente=1), como no dashboard.
    const pacienteId = new URLSearchParams(window.location.search).get("paciente") || "1";

    const SUBTITULOS = {
        1: "Registre como está se sentindo hoje",
        2: "Diga sua energia e o registro pode ser salvo"
    };

    // perguntas obrigatórias da etapa 1 e o aviso de cada uma
    const OBRIGATORIOS = {
        humor: "Conte como está o seu humor antes de continuar.",
        sono: "Conte como foi seu sono antes de continuar."
    };

    // mesmo valor de --popup-duracao no style.css
    const DURACAO_POPUP_MS = 260;

    // mensagem acima do formulário; tipo "info" muda a cor (vazia, some)
    function mostrarMensagem(texto, tipo = "erro") {
        mensagemStatus.textContent = texto;
        mensagemStatus.dataset.tipo = tipo;
    }

    function criarItem(texto) {
        const item = document.createElement("li");
        item.textContent = texto;
        return item;
    }

    // troca a etapa visível e o subtítulo do cabeçalho
    function mostrarEtapa(numero) {
        etapa1.hidden = numero !== 1;
        etapa2.hidden = numero !== 2;
        document.getElementById("subtitulo").textContent = SUBTITULOS[numero];
        mostrarMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // cada ponto do corpo liga e desliga ao ser tocado
    pontos.forEach((ponto) => {
        ponto.setAttribute("aria-label", ponto.dataset.regiao);
        ponto.addEventListener("click", () => {
            ponto.setAttribute("aria-pressed", String(ponto.getAttribute("aria-pressed") !== "true"));
        });
    });

    function locaisMarcados() {
        return pontos.filter((ponto) => ponto.getAttribute("aria-pressed") === "true").map((ponto) => ponto.dataset.regiao);
    }

    // monta os números da escala e, a cada mudança, atualiza o preenchimento,
    // o número em destaque e o texto lido pelo leitor de tela
    escalas.forEach((controle) => {
        const escala = controle.closest(".escala");
        const maximo = Number(controle.max);
        const [textoMinimo, textoMaximo] = [...escala.querySelectorAll(".escala-extremos span")].map((s) => s.textContent);
        const numeros = Array.from({ length: maximo + 1 }, (_, numero) => criarItem(numero));

        escala.querySelector(".escala-numeros").append(...numeros);

        controle.addEventListener("input", () => {
            const valor = Number(controle.value);

            // o preenchimento acompanha o centro do polegar (22px)
            escala.style.setProperty("--progresso", `calc(${valor / maximo} * (100% - 22px) + 11px)`);
            numeros.forEach((item, indice) => item.classList.toggle("atual", indice === valor));

            const extremo = valor === 0 ? textoMinimo : valor === maximo ? textoMaximo : "";
            controle.setAttribute("aria-valuetext", extremo ? `${valor}, ${extremo}` : String(valor));
        });

        controle.dispatchEvent(new Event("input"));
    });

    // abre e fecha um <dialog> com a animação do CSS (.aberto); Esc e clique no
    // fundo também fecham, e o navegador devolve o foco para quem abriu
    function criarPopup(dialog) {
        let gatilho = null;

        function abrir(origem) {
            if (dialog.open) return;
            gatilho = origem;
            gatilho.setAttribute("aria-expanded", "true");
            dialog.showModal();
            // espera o navegador desenhar o estado fechado antes de animar a entrada
            requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add("aberto")));
        }

        function fechar() {
            if (!dialog.classList.contains("aberto")) return;
            dialog.classList.remove("aberto");
            gatilho.setAttribute("aria-expanded", "false");
            setTimeout(() => dialog.close(), DURACAO_POPUP_MS);
        }

        dialog.querySelectorAll("[data-popup-fechar]").forEach((botao) => botao.addEventListener("click", fechar));

        dialog.addEventListener("cancel", (evento) => {
            evento.preventDefault();
            fechar();
        });

        // o padding do <dialog> também é o próprio dialog: só fecha fora da caixa
        dialog.addEventListener("click", (evento) => {
            const area = dialog.getBoundingClientRect();
            const fora = evento.clientX < area.left || evento.clientX > area.right ||
                evento.clientY < area.top || evento.clientY > area.bottom;
            if (evento.target === dialog && fora) fechar();
        });

        return { abrir, fechar };
    }

    // um único "Tem certeza?" para o "Limpar" e o "Finalizar":
    // quem abre informa o que o "Continuar" deve fazer
    const popupConfirmar = criarPopup(document.getElementById("popup-confirmar"));
    let acaoConfirmada = null;

    function confirmar(origem, acao) {
        acaoConfirmada = acao;
        popupConfirmar.abrir(origem);
    }

    document.getElementById("popup-confirmar-continuar").addEventListener("click", () => {
        popupConfirmar.fechar();
        acaoConfirmada?.();
        acaoConfirmada = null;
    });

    function temAlgoPreenchido() {
        const dados = new FormData(etapa1);
        return locaisMarcados().length > 0 || dados.has("humor") || dados.has("sono") ||
            escalas.some((controle) => Number(controle.value) > 0);
    }

    // "Limpar" só pede confirmação se houver algo a perder
    const botaoLimpar = document.getElementById("botao-limpar");
    botaoLimpar.addEventListener("click", () => {
        if (temAlgoPreenchido()) confirmar(botaoLimpar, () => etapa1.reset());
        else etapa1.reset();
    });

    etapa1.addEventListener("reset", () => {
        pontos.forEach((ponto) => ponto.setAttribute("aria-pressed", "false"));
        mostrarMensagem("");
        // o reset do form só muda o valor depois deste evento
        setTimeout(() => escalas.forEach((controle) => controle.dispatchEvent(new Event("input"))));
    });

    // "Próximo": confere as perguntas obrigatórias e mostra o resumo
    etapa1.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = new FormData(etapa1);
        const faltando = Object.keys(OBRIGATORIOS).find((nome) => !dados.get(nome));

        if (faltando) {
            mostrarMensagem(OBRIGATORIOS[faltando]);
            etapa1.querySelector(`input[name="${faltando}"]`).focus();
            return;
        }

        mostrarResumo();
        mostrarEtapa(2);
    });

    // texto da opção marcada, como aparece na tela ("Triste", "Péssimo"...)
    function textoMarcado(nome) {
        return etapa1.querySelector(`input[name="${nome}"]:checked`).closest("label").textContent.trim();
    }

    // "3/5": o número grande e o máximo menor, como no Figma
    function mostrarNota(id, controle) {
        const total = document.createElement("small");
        total.textContent = `/${controle.max}`;
        document.getElementById(id).replaceChildren(controle.value, total);
    }

    // preenche o card "Tudo certo?" da etapa 2 com o que foi marcado na etapa 1
    function mostrarResumo() {
        const locais = locaisMarcados();
        const resumoLocais = document.getElementById("resumo-locais");

        resumoLocais.replaceChildren(...(locais.length ? locais : ["Nenhum local marcado"]).map(criarItem));
        resumoLocais.firstChild.classList.toggle("vazio", locais.length === 0);

        mostrarNota("resumo-disposicao", document.getElementById("nivel-disposicao"));
        mostrarNota("resumo-dor", document.getElementById("nivel-dor"));
        document.getElementById("resumo-humor").textContent = textoMarcado("humor");
        document.getElementById("resumo-sono").textContent = textoMarcado("sono");
    }

    document.getElementById("voltar-etapa-1").addEventListener("click", () => mostrarEtapa(1));

    // "Finalizar" sempre pede confirmação, sem conferir o que foi preenchido
    etapa2.addEventListener("submit", (evento) => {
        evento.preventDefault();
        confirmar(evento.submitter, finalizarRegistro);
    });

    function finalizarRegistro() {
        const dados = new FormData(etapa1);
        const energia = new FormData(etapa2).get("energia");
        const registro = {
            pacienteId: Number(pacienteId),
            locais: locaisMarcados(),
            humor: dados.get("humor"),
            sono: dados.get("sono"),
            dor: Number(dados.get("dor")),
            disposicao: Number(dados.get("disposicao")),
            energia: energia ? Number(energia) : null
        };

        // TODO(registro): ainda não existe POST /api/registros, então o registro
        // não é salvo. quando a rota existir, enviar `registro` aqui e só
        // redirecionar se a resposta for ok (em erro, mostrarMensagem).
        console.info("registro (ainda não salvo):", registro);

        window.location.href = "../dashboard/index.html";
    }

    // nome e inicial do paciente no menu (o dashboard é a única rota que devolve o nome)
    async function carregarPaciente() {
        const usuarioNome = document.getElementById("usuario-nome");

        try {
            const resposta = await fetch(`/api/dashboard?pacienteId=${encodeURIComponent(pacienteId)}&dias=7`);
            if (!resposta.ok) throw new Error();

            const { paciente } = await resposta.json();
            usuarioNome.textContent = paciente.nome;
            document.getElementById("usuario-inicial").textContent = paciente.nome.trim().charAt(0).toUpperCase();
        } catch {
            usuarioNome.textContent = "Paciente";
        }
    }

    // busca e mostra o clima; devolve a mensagem de erro, ou nada se deu certo
    async function buscarClima(url) {
        cardClima.setAttribute("aria-busy", "true");

        try {
            const resposta = await fetch(url);
            const clima = await resposta.json();

            if (!resposta.ok) return clima.error || "Clima indisponível no momento.";

            climaCidade.textContent = clima.cidade;
            climaCondicao.textContent = clima.condicao;
            document.getElementById("clima-temperatura").textContent = clima.temperatura;
            document.getElementById("clima-extremos").textContent = `${clima.minima}° / ${clima.maxima}°`;
            document.getElementById("clima-ilustracao").dataset.tipo =
                /nubl|chuv|garoa|tempestade/i.test(clima.condicao) ? "nublado" : "sol";
        } catch {
            return "Não foi possível carregar o clima.";
        } finally {
            cardClima.setAttribute("aria-busy", "false");
        }
    }

    // sugestões do campo de cidade; sem a lista, o campo continua aceitando o nome digitado
    async function carregarCidades() {
        try {
            const resposta = await fetch("/api/clima/cidades");
            if (!resposta.ok) return;

            const cidades = await resposta.json();
            listaCidades.replaceChildren(...cidades.map(({ cidade, uf }) => new Option(uf, cidade)));
        } catch { }
    }

    const popupLocal = criarPopup(document.getElementById("popup-local"));
    const botaoMudarLocal = document.getElementById("mudar-localizacao");
    const formLocal = document.getElementById("form-local");
    const botaoAutomatico = document.getElementById("local-automatico");

    // troca a cidade do clima; em erro, avisa dentro do popup e ele continua aberto
    async function escolherLocal(url) {
        const erro = await buscarClima(url);

        if (erro) {
            erroLocal.textContent = erro;
            return;
        }

        popupLocal.fechar();
        mostrarMensagem(`Clima atualizado para ${climaCidade.textContent}.`, "info");
    }

    botaoMudarLocal.addEventListener("click", () => {
        campoLocal.value = "";
        erroLocal.textContent = "";
        popupLocal.abrir(botaoMudarLocal);
    });

    // escolher uma sugestão da lista já confirma, sem precisar apertar Enter
    campoLocal.addEventListener("input", () => {
        erroLocal.textContent = "";
        if ([...listaCidades.options].some((opcao) => opcao.value === campoLocal.value)) formLocal.requestSubmit();
    });

    formLocal.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const cidade = campoLocal.value.trim();

        if (!cidade) {
            erroLocal.textContent = "Digite o nome de uma cidade.";
            campoLocal.focus();
            return;
        }

        escolherLocal(`/api/clima?cidade=${encodeURIComponent(cidade)}`);
    });

    // TODO(localização): com um serviço de clima real, pedir navigator.geolocation
    // aqui e mandar lat/long; hoje /api/clima/automatica devolve a cidade do mock.
    botaoAutomatico.addEventListener("click", async () => {
        botaoAutomatico.setAttribute("aria-busy", "true");
        await escolherLocal("/api/clima/automatica");
        botaoAutomatico.setAttribute("aria-busy", "false");
    });

    carregarPaciente();
    buscarClima("/api/clima").then((erro) => {
        if (erro) climaCondicao.textContent = erro;
    });
    carregarCidades();
});
