
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTOS DO PERFIL
    // ========================================

    const profileShortName = document.getElementById("profileShortName");
    const sidebarName = document.getElementById("sidebarName");

    const profileAvatar = document.getElementById("profileAvatar");
    const sidebarAvatar = document.getElementById("sidebarAvatar");


    // ========================================
    // CAMPOS EDITÁVEIS
    // ========================================

    const fields = {

        name: {
            input: document.getElementById("nameInput"),
            output: document.getElementById("fullName")
        },

        birthDate: {
            input: document.getElementById("birthDateInput"),
            output: document.getElementById("birthDate")
        },

        email: {
            input: document.getElementById("emailInput"),
            output: document.getElementById("emailValue")
        },

        weight: {
            input: document.getElementById("weightInput"),
            output: document.getElementById("weightValue")
        },

        height: {
            input: document.getElementById("heightInput"),
            output: document.getElementById("heightValue")
        },

        gender: {
            input: document.getElementById("genderInput"),
            output: document.getElementById("genderValue")
        }

    };


    // ========================================
    // RECUPERAR DADOS DO USUÁRIO
    // ========================================

    let userData = JSON.parse(
        localStorage.getItem("fibrosyncPerfil")
    ) || {};


    const defaultText = "Não informado";


    // ========================================
    // FORMATAR DATA
    // ========================================

    function formatDate(date) {

        if (!date) return defaultText;

        const [year, month, day] = date.split("-");

        return `${day}/${month}/${year}`;

    }


    // ========================================
    // ATUALIZAR NOME E AVATAR
    // ========================================

    function updateUserName() {

        const name = userData.name || "";

        const firstName = name.trim().split(/\s+/)[0] || "Usuário";

        const initial = name.trim().charAt(0).toUpperCase() || "?";

        profileShortName.textContent = firstName;

        sidebarName.textContent = name || "Usuário";

        profileAvatar.textContent = initial;

        sidebarAvatar.textContent = initial;

    }


    // ========================================
    // ATUALIZAR INFORMAÇÕES DO PE
    function updateProfile() {
        Object.entries(fields).forEach(([key, field]) => {
            const value = userData[key];
            if (!value) {
                field.output.textContent = defaultText;
                return;
            }
            // DATA DE NASCIMENTO
            if (key === "birthDate") {
                field.output.textContent = formatDate(value);
            }
            // PESO
            else if (key === "weight") {
                field.output.textContent = `${value} Kg`;
            }
            // ALTURA
            else if (key === "height") {
                field.output.textContent =`${(Number(value) / 100).toFixed(2).replace(".", ",")} m`;
            }
            // DEMAIS CAMPOS
            else {
                field.output.textContent = value;
            }
        });
        updateUserName();
    }
    // ABRIR CAMPO DE EDIÇÃO
    document.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            const fieldName = button.dataset.edit;
            const field = fields[fieldName];
            if (!field) return;
            const row = button.closest(".editable-row");
            // FECHAR OS OUTROS CAMPOS
            document.querySelectorAll(".editable-row").forEach((item) => {
                item.classList.remove("editing");
            });
            // ABRIR O CAMPO SELECIONADO
            row.classList.add("editing");
            // CARREGAR VALOR ATUAL
            field.input.value = userData[fieldName] || "";
            // LIMPAR VALIDAÇÃO ANTERIOR
            field.input.setCustomValidity("");
            field.input.focus();
        });
    });
    // SALVAR ALTERAÇÕES
    document.querySelectorAll("[data-save]").forEach((button) => {
        button.addEventListener("click", () => {
            const fieldName = button.dataset.save;
            const field = fields[fieldName];
            if (!field) return;
            const newValue = field.input.value.trim();
            const input = field.input;
            const row = button.closest(".editable-row");
            // LIMPAR ERROS ANTERIORES
            input.setCustomValidity("");
            // VERIFICAR SE O CAMPO ESTÁ VAZIO
            if (!newValue) {
                input.setCustomValidity("Preencha este campo antes de salvar.");
                input.reportValidity();
                input.focus();
                return;
            }
            // VALIDAR NOME
            if (fieldName === "name" && newValue.length < 3) {
                input.setCustomValidity("Digite um nome válido.");
                input.reportValidity();
                input.focus();
                return;
            }
            // VALIDAR E-MAIL
            if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
                input.setCustomValidity("Digite um e-mail válido.");
                input.reportValidity();
                input.focus();
                return;
            }
            // VALIDAR DATA DE NASCIMENTO
            if (fieldName === "birthDate") {
                const selectedDate = new Date(newValue + "T00:00:00");
                if (isNaN(selectedDate.getTime()) || selectedDate > new Date()) {
                    input.setCustomValidity("Informe uma data de nascimento válida.");
                    input.reportValidity();
                    input.focus();
                    return;
                }
            }
            // VALIDAR PESO
            if (fieldName === "weight") {
                const weight = Number(newValue);
                if (weight <= 0 || weight > 500) {
                    input.setCustomValidity("Informe um peso válido.");
                    input.reportValidity();
                    input.focus();
                    return;
                }
            }
            // VALIDAR ALTURA
            if (fieldName === "height") {
                const height = Number(newValue);
                if (height <= 0 || height > 250) {
                    input.setCustomValidity("Informe uma altura válida em centímetros.");
                    input.reportValidity();
                    input.focus();
                    return;
                }
            }
            // SALVAR INFORMAÇÕES
            userData[fieldName] = newValue;
            localStorage.setItem("fibrosyncPerfil", JSON.stringify(userData));
            // ATUALIZAR INFORMAÇÕES NA TELA
            updateProfile();
            // LIMPAR CAMPO
            input.value = "";
            // FECHAR EDIÇÃO
            row.classList.remove("editing");
            // MENSAGEM DE SUCESSO
            alert("Informação atualizada com sucesso!");
        });
    });
    // LIMPAR ERROS AO DIGITAR
    Object.values(fields).forEach((field) => {
        field.input.addEventListener("input", () => {
            field.input.setCustomValidity("");
        });
    });
    // SALVAR PRESSIONANDO ENTER
    Object.entries(fields).forEach(([key, field]) => {
        field.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && field.input.tagName !== "SELECT") {
                event.preventDefault();
                const row = field.input.closest(".editable-row");
                const saveButton = row.querySelector("[data-save]");
                saveButton.click();
            }
        });
    });
    // CARREGAR PERFIL AO ABRIR A PÁGINA
    updateProfile();
});
