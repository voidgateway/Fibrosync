// componente de alertas (reutilizável).
// qualquer botão com data-alerta-abrir abre o popup; ainda não há lógica de alertas,
// por enquanto ele só mostra "Sem alertas".
(() => {
    // capturado já na carga: document.currentScript só existe neste momento
    const ARQUIVO_COMPONENTE = new URL("index.html", document.currentScript.src);

    // mesmo valor de --alerta-duracao; garante o fechamento se o transitionend não vier
    const DURACAO_MS = 260;

    // na própria /alerta/ o <dialog> já está na página;
    // nas outras telas ele é copiado de alerta/index.html
    async function obterDialog() {
        const existente = document.getElementById("alerta");
        if (existente) return existente;

        const resposta = await fetch(ARQUIVO_COMPONENTE);
        const html = await resposta.text();
        const pagina = new DOMParser().parseFromString(html, "text/html");
        const dialog = document.importNode(pagina.getElementById("alerta"), true);

        document.body.append(dialog);
        return dialog;
    }

    function iniciar(dialog) {
        const gatilhos = [...document.querySelectorAll("[data-alerta-abrir]")];
        let gatilhoAtual = null;
        let fechando = false;

        gatilhos.forEach((gatilho) => {
            gatilho.setAttribute("aria-haspopup", "dialog");
            gatilho.setAttribute("aria-controls", "alerta");
            gatilho.setAttribute("aria-expanded", "false");
        });

        function abrir(gatilho) {
            if (dialog.open) return;

            gatilhoAtual = gatilho;
            gatilho?.setAttribute("aria-expanded", "true");
            dialog.showModal();

            // espera o navegador desenhar o estado fechado antes de animar a entrada
            requestAnimationFrame(() => {
                requestAnimationFrame(() => dialog.classList.add("aberto"));
            });
        }

        function fechar() {
            if (!dialog.open || fechando) return;
            fechando = true;

            dialog.classList.remove("aberto");

            const concluir = () => {
                if (!fechando) return;
                fechando = false;
                dialog.close();
                gatilhoAtual?.setAttribute("aria-expanded", "false");
                gatilhoAtual?.focus();
            };

            dialog.addEventListener("transitionend", concluir, { once: true });
            setTimeout(concluir, DURACAO_MS + 50);
        }

        gatilhos.forEach((gatilho) => {
            gatilho.addEventListener("click", () => abrir(gatilho));
        });

        dialog.querySelectorAll("[data-alerta-fechar]").forEach((botao) => {
            botao.addEventListener("click", fechar);
        });

        // Esc: troca o fechamento seco do navegador pela animação de saída
        dialog.addEventListener("cancel", (evento) => {
            evento.preventDefault();
            fechar();
        });

        // clique fora do popup (no fundo escurecido) também fecha
        dialog.addEventListener("click", (evento) => {
            if (evento.target === dialog) {
                const area = dialog.getBoundingClientRect();
                const dentro = evento.clientX >= area.left && evento.clientX <= area.right &&
                    evento.clientY >= area.top && evento.clientY <= area.bottom;

                if (!dentro) fechar();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", async () => {
        try {
            iniciar(await obterDialog());
        } catch {
            // sem o componente, o botão simplesmente não abre nada
        }
    });
})();
