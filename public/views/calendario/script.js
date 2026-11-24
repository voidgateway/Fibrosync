
/*1. ELEMENTOS HTML*/
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const dayRecords = document.getElementById("dayRecords");
const selectedDateLabel = document.getElementById("selectedDateLabel");
const newRecordButton = document.getElementById("newRecordButton");
/*2. CONFIGURAÇÕES*/
const monthNames = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO"
];
/*3. RECUPERAR USUÁRIO DO LOGIN*/
function readLoggedUser() {
    const possibleKeys = [
        "fibrosync_usuario",
        "usuarioLogado",
        "usuario",
        "user",
        "loggedUser",
        "currentUser"
    ];
    const stores = [
        localStorage,
        sessionStorage
    ];
    for (const store of stores) {
        for (const key of possibleKeys) {
            try {
                const value = store.getItem(key);
                if (!value) continue;
                let user;
                try {
                    user = JSON.parse(value);
                } catch {
                    user = {
                        nome: value
                    };
                }
                if (typeof user === "string") {
                    user = {
                        nome: user
                    };
                }
                if (!user || typeof user !== "object") {
                    continue;
                }
                const name =
                    user.nome ||
                    user.name ||
                    user.nomeCompleto ||
                    user.fullName ||
                    user.nameUser || "";
                const email =
                    user.email ||
                    user.usuario || "";
                if (name || email) {
                    return {
                        nome: String(name).trim(),
                        email: String(email).trim()
                    };
                }
            } catch (error) {
                console.warn(
                    "Não foi possível recuperar o usuário.",
                    error
                );
            }
        }
    }
    return {
        nome: "", email: ""
    };
}
/* 4. ATUALIZAR PERFIL LATERAL */
function updateSidebarUser() {
    const user = readLoggedUser();
    const sidebarName = document.getElementById(
        "sidebarName"
    );
    const sidebarAvatar = document.getElementById(
        "sidebarAvatar"
    );
    if (!sidebarName || !sidebarAvatar) return;
    const displayName =
        user.nome ||
        user.email.split("@")[0] ||
        "Usuário";
    sidebarName.textContent = displayName;
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
    sidebarAvatar.textContent = initials || "?";
}
const loggedUser = readLoggedUser();

const userIdentifier = loggedUser.email.toLowerCase() || loggedUser.nome.toLowerCase() || "visitante";

const STORAGE_KEY ="fibrosync_calendar_" + encodeURIComponent(userIdentifier);
/* 5. DATAS INICIAIS */
//Calendário começa em junho de 2026.
let viewDate = new Date(2026, 5, 1);

// Dia inicialmente selecionado.
let selectedDate = "2026-06-19";
/* 6. FUNÇÕES DE DATA*/
function dateKey(date) {
    const year = date.getFullYear();
    const month = String( 
        date.getMonth() + 1
    ).padStart(2, "0");
    
    const day = String(
        date.getDate()
    ).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
}
function parseDate(key) {
    const [year, month, day] = key
        .split("-")
        .map(Number);
    return new Date(
        year,
        month - 1,
        day
    );
}
function formatDate(key) {
    return parseDate(key).toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}
/*7. ARMAZENAMENTO DOS REGISTROS */
function loadRecords() {
    try {
        const saved = localStorage.getItem(
            STORAGE_KEY
        );
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(
            "Erro ao carregar registros:",
            error
        );
        return [];
    }
}
let records = loadRecords();

function saveRecords() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(records)
        );
    } catch (error) {
        console.error(error);
        showToast(
            "Não foi possível salvar os registros."
        );
    }
}
/* 8. BUSCAR REGISTROS POR DATA */
function getRecordsByDate(date) {
    return records.filter(
        record => record.date === date
    );
}
function hasCrisis(date) {
    return getRecordsByDate(date).some(
        record => record.crisis === true
    );
}
/* 9. REDIRECIONAR PARA REGISTRO DIÁRIO */
function goToDailyRecord() {
    // Localiza o link de Registro Diário no menu.
    const dailyRecordLink = document.querySelector(
        '.menu a[data-page="registro-diario"]'
    );
    if (!dailyRecordLink) {
        showToast(
            "Link da tela Registro Diário não encontrado."
        );
        return;
    }
    const destination = dailyRecordLink.getAttribute(
        "href"
    );
    if (
        !destination ||
        destination.trim() === "" ||
        destination === "#"
    ) {
        showToast(
            "Configure o endereço da tela Registro Diário."
        );
        return;
    }
    // Redireciona para a página existente.
    window.location.href = dailyRecordLink.href;

}

/* 10. BOTÃO NOVO REGISTRO DO PAINEL*/
newRecordButton.addEventListener(
    "click",
    goToDailyRecord
);

/* 11. GERAR CALENDÁRIO*/
function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = monthNames[month];
    yearLabel.textContent = year;
    calendarGrid.innerHTML = "";

    // Primeiro dia do mês.
    const firstDay = new Date(
        year,
        month,
        1
    ).getDay();

    // Quantidade de dias do mês.
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    // Último dia do mês anterior.
    const previousMonthDays = new Date(
        year,
        month,
        0
    ).getDate();

    // Total de células.
    const totalCells = 42;
    const today = dateKey(new Date());

    for (let i = 0; i < totalCells; i++) {
        let day;
        let cellDate;
        let outside = false;

        // MÊS ANTERIOR.
        if (i < firstDay) {
            day = previousMonthDays - firstDay + i + 1;
            cellDate = new Date(
                year,
                month - 1,
                day
            );
            outside = true;
        }

        // PRÓXIMO MÊS.
        else if (i >= firstDay + daysInMonth) {
            day = i - firstDay - daysInMonth + 1;
            cellDate = new Date(
                year,
                month + 1,
                day
            );
            outside = true;
        }

        // MÊS ATUAL.
        else {
            day = i - firstDay + 1;
            cellDate = new Date(
                year,
                month,
                day
            );

        }

        const key = dateKey(cellDate);

        const recordsOfDay = getRecordsByDate(key);

        const hasRecords = recordsOfDay.length > 0;

        const crisis = hasCrisis(key);

        // CRIAR BOTÃO.
        const button = document.createElement("button");

        button.type = "button";

        button.className = "day-cell";

        button.dataset.date = key;

        if (outside) {

            button.classList.add("outside");

        }

        if (key === selectedDate) {

            button.classList.add("selected");

        }

        if (key === today) {

            button.classList.add("today");

        }

        if (hasRecords) {

            button.classList.add("has-record");

            if (crisis) {

                button.classList.add("has-crisis");

            }

        }

        button.setAttribute(
            "aria-label",
            `${formatDate(key)}${
                crisis
                    ? ", com crise registrada"
                    : hasRecords
                        ? ", com registro"
                        : ", sem registro"
            }`
        );

        button.setAttribute(
            "aria-pressed",
            key === selectedDate ? "true" : "false"
        );

        button.innerHTML = `

            <span class="day-number">
                ${day}
            </span>

            <span class="day-status">
                ${
                    crisis
                        ? "Crise"
                        : hasRecords
                            ? "Registro"
                            : ""
                }
            </span>

        `;

        // ABRIR POPUP AO CLICAR.
        button.addEventListener("click", () => {

            selectDay(key);

        });

        calendarGrid.appendChild(button);

    }

    renderSummary();

}

/* 12. SELECIONAR DIA*/
function selectDay(key) {

    selectedDate = key;

    const date = parseDate(key);

    viewDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

    renderCalendar();

    renderDayRecords();

    openDayPopup();

}

/* 13. NAVEGAÇÃO ENTRE MESES E ANOS */
function changeMonth(amount) {
    viewDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + amount,
        1
    );

    selectedDate = dateKey(viewDate);

    renderCalendar();

    renderDayRecords();

}

prevMonth.addEventListener("click", () => {

    changeMonth(-1);

});

nextMonth.addEventListener("click", () => {

    changeMonth(1);

});

/*14. RESUMO CLÍNICO*/
function renderSummary() {

    const year = viewDate.getFullYear();

    const month = viewDate.getMonth();

    // Registros do mês.
    const monthRecords = records.filter(record => {
        const date = parseDate(record.date);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );

    });

    // Dias diferentes com registros.
    const daysWithRecords = new Set(
        monthRecords.map(record => record.date)
    ).size;

    // Média de dor.
    const average = monthRecords.length
        ? monthRecords.reduce(
            (total, record) =>
                total + Number(record.pain),
            0
        ) / monthRecords.length
        : 0;

    document.getElementById(
        "totalRecords"
    ).textContent = monthRecords.length;

    document.getElementById(
        "frequency"
    ).textContent = daysWithRecords;

    document.getElementById(
        "averagePain"
    ).textContent = average.toFixed(1);

    // COBERTURA.
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const coverage = Math.round(
        daysWithRecords / daysInMonth * 100
    );

    document.getElementById(
        "coverageText"
    ).textContent = coverage + "%";

    document.getElementById(
        "coverageBar"
    ).style.width = coverage + "%";

}

/* 15. REGISTROS DO DIA NO PAINEL */
function renderDayRecords() {
    selectedDateLabel.textContent = formatDate(
        selectedDate
    );
    const list = getRecordsByDate(selectedDate);

    // DIA SEM REGISTROS.
    if (!list.length) {

        dayRecords.innerHTML = `

            <div class="empty-state">

                <span class="material-symbols-rounded">
                    event_busy
                </span>

                <p>
                    Nenhum registro encontrado nesta data.
                    <br>
                    Consulte outra data ou adicione
                    um novo registro.
                </p>

            </div>

        `;
        return;
    }
    // EXIBIR REGISTROS.
    dayRecords.innerHTML = list.map(record => `

        <article class="record-item">

            <span class="record-bar ${
                record.crisis ? "crisis" : ""
            }"></span>

            <div class="record-copy">

                <b>${escapeHTML(record.symptoms)}</b>

                <small>
                    ${escapeHTML(record.time || "--:--")}
                    • Dor ${Number(record.pain)}/10
                    • Sono: ${escapeHTML(record.sleep || "Não informado")}
                </small>

                <small>
                    ${
                        record.crisis
                            ? "Crise de fibromialgia"
                            : "Registro comum"
                    }
                </small>
            </div>
            <span class="record-tags">
                ${record.crisis ? "CRISE" : "REGISTRO"}
            </span>

        </article>

    `).join("");
}
/* 16. CRIAR POPUP INDIVIDUAL */
function createDayPopup() {

    if (
        document.getElementById("dayPopupBackdrop")
    ) {
        return;
    }
    const backdrop = document.createElement("div");
    backdrop.id = "dayPopupBackdrop";
    backdrop.className = "day-popup-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    backdrop.innerHTML = `
        <section class="day-popup" role="dialog" aria-modal="true" aria-labelledby="popupDayNumber">
            
            <!-- CABEÇALHO -->
            <header class="popup-header">
                <button type="button" id="popupPrevDay" class="popup-arrow" aria-label="Dia anterior" >
                    <span class="material-symbols-rounded">
                        chevron_left
                    </span>
                </button>

                <div class="popup-date">
                    <strong id="popupDayNumber">
                        19
                    </strong>
                    <span id="popupMonthYear">
                        Julho 2026
                    </span>
                </div>

                <button type="button"  id="popupNextDay" class="popup-arrow" aria-label="Próximo dia">

                    <span class="material-symbols-rounded">
                        chevron_right
                    </span>

                </button>

            </header>


            <!-- REGISTROS -->

            <div
                class="popup-records"
                id="popupRecords"
            ></div>


            <!-- ESTADO VAZIO -->

            <div
                class="popup-empty"
                id="popupEmpty " hidden >
                <span class="material-symbols-rounded">
                    event_available
                </span>

                <p>
                    Nenhum registro neste dia.
                </p>

                <small>
                    Você pode consultar outra data
                    ou adicionar um novo registro.
                </small>

            </div>

            <!-- AÇÕES -->
            <footer class="popup-actions">

                <button type="button" class="popup-delete" id="popupDelete">
                    Excluir
                </button>

                <button type="button" class="popup-new" id="popupNewRecord">
                    Novo Registro
                </button>
            </footer>
        </section>

    `;

    document.body.appendChild(backdrop);

    // DIA ANTERIOR.
    document.getElementById(
        "popupPrevDay"
    ).addEventListener("click", () => {

        changeSelectedDay(-1);

    });

    // PRÓXIMO DIA.
    document.getElementById(
        "popupNextDay"
    ).addEventListener("click", () => {

        changeSelectedDay(1);

    });

    // REDIRECIONAR PARA REGISTRO DIÁRIO.
    document.getElementById(
        "popupNewRecord"
    ).addEventListener("click", () => {

        goToDailyRecord();

    });
    // EXCLUIR REGISTROS DO DIA.
    document.getElementById(
        "popupDelete"
    ).addEventListener("click", deleteSelectedDay);
    
    // FECHAR CLICANDO FORA.
    backdrop.addEventListener("click", event => {
        if (event.target === backdrop) {
            closeDayPopup();
        }
    });
}
/*17. ABRIR POPUP */
function openDayPopup() {
    createDayPopup();
    const backdrop = document.getElementById(
        "dayPopupBackdrop"
    );
    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");
    renderPopupContent();

}
/* 18. CONTEÚDO DO POPUP*/
function renderPopupContent() {
    const date = parseDate(selectedDate);
    const list = getRecordsByDate(selectedDate);
    // DATA.
    document.getElementById(
        "popupDayNumber"
    ).textContent = date.getDate();
    document.getElementById(
        "popupMonthYear"
    ).textContent = date.toLocaleDateString(
        "pt-BR",
        {
            month: "long", year: "numeric"
        }
    );
    const popupRecords = document.getElementById(
        "popupRecords"
    );
    const popupEmpty = document.getElementById(
        "popupEmpty"
    );
    const deleteButton = document.getElementById(
        "popupDelete"
    );
    popupRecords.innerHTML = "";
    popupEmpty.hidden = list.length > 0;
    deleteButton.disabled = list.length === 0;
    if (!list.length) return;
    // MOSTRAR TODOS OS REGISTROS DO DIA.
    list.forEach(record => {
        const article = document.createElement("article");
        article.className = "popup-record";
        article.innerHTML = `
            <span class="popup-record-bar ${
                record.crisis ? "crisis" : "" }"> </span>

            <div class="popup-record-info">

                <strong>
                    ${escapeHTML(record.symptoms)}
                </strong>

                <small>
                    Dor ${Number(record.pain)}/10
                    • Sono ${escapeHTML(record.sleep || "Não informado")}
                </small>

                <small>
                    ${escapeHTML(record.time || "--:--")}
                    ${
                        record.crisis ? " • Crise de fibromialgia"  : " • Registro comum"
                    }
                </small>
                ${
                    record.notes ? `<p>${escapeHTML(record.notes)}</p>` : ""
                }
            </div> `;
        popupRecords.appendChild(article);
    });
}
/* 19. NAVEGAR ENTRE DIAS*/
function changeSelectedDay(amount) {
    const date = parseDate(selectedDate);
    date.setDate(
        date.getDate() + amount
    );
    selectedDate = dateKey(date);
    viewDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
    renderCalendar();
    renderDayRecords();
    renderPopupContent();
}
/* 20. FECHAR POPUP */

function closeDayPopup() {
    const backdrop = document.getElementById(
        "dayPopupBackdrop"
    );
    if (!backdrop) return;
    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");
}
/* 21. EXCLUIR REGISTROS DO DIA*/
function deleteSelectedDay() {
    const list = getRecordsByDate(selectedDate);
    if (!list.length) return;
    const confirmation = confirm(
        "Deseja excluir todos os registros desta data?"
    );
    if (!confirmation) return;
    records = records.filter(
        record => record.date !== selectedDate
    );
    saveRecords();
    renderCalendar();
    renderDayRecords();
    renderPopupContent();
    showToast(
        "Registros excluídos com sucesso."
    );
}
/* 22. PROTEÇÃO CONTRA HTML INJETADO*/
function escapeHTML(value) {
    return String(value).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character])
    );
}
/* 23. NOTIFICAÇÕES*/
function showToast(message) {
    const toast = document.getElementById(
        "toast"
    );
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
/* 24. TECLA ESC */
document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    const popup = document.getElementById(
        "dayPopupBackdrop"
    );
    if (
        popup &&
        popup.classList.contains("show")
    ) {
        closeDayPopup();
    }
});
/*25. INICIALIZAÇÃO */
updateSidebarUser();
renderCalendar();
renderDayRecords();

