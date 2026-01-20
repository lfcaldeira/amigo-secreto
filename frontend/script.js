const adicionarAgregadoBtn = document.getElementById("adicionar-agregado");
const sortearBtn = document.getElementById("sortear");
const casasContainer = document.getElementById("casas");
const nomeFamiliaInput = document.getElementById("nome-familia");

let casas = [];
const API_BASE = "/api";

// Função para criar um novo agregado
function criarAgregado() {
    const casaDiv = document.createElement("div");
    casaDiv.classList.add("casa");
    casaDiv.pessoas = [];

    const pessoasDiv = document.createElement("div");
    pessoasDiv.classList.add("pessoas");

    // Botão para adicionar pessoa dentro do agregado
    const adicionarPessoaBtn = document.createElement("button");
    adicionarPessoaBtn.textContent = "Adicionar Pessoa";

    const removerAgregadoBtn = document.createElement("button");
    removerAgregadoBtn.textContent = "Remover Agregado";
    removerAgregadoBtn.classList.add("btn-remover");
    removerAgregadoBtn.addEventListener("click", () => {
        casas = casas.filter(c => c !== casaDiv);
        casaDiv.remove();
    });

    adicionarPessoaBtn.addEventListener("click", () => {
        const pessoaDiv = document.createElement("div");
        pessoaDiv.classList.add("pessoa-container");

        const nomeInput = document.createElement("input");
        nomeInput.type = "text";
        nomeInput.placeholder = "Nome";
        nomeInput.classList.add("pessoa");

        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "Email";
        emailInput.classList.add("pessoa");

        const removerPessoaBtn = document.createElement("button");
        removerPessoaBtn.textContent = "Remover";
        removerPessoaBtn.classList.add("btn-remover");
        removerPessoaBtn.addEventListener("click", () => {
            casaDiv.pessoas = casaDiv.pessoas.filter(p => p.nomeInput !== nomeInput);
            pessoaDiv.remove();
        });

        pessoaDiv.appendChild(nomeInput);
        pessoaDiv.appendChild(emailInput);
        pessoaDiv.appendChild(removerPessoaBtn);
        pessoasDiv.appendChild(pessoaDiv);
        casaDiv.pessoas.push({ nomeInput, emailInput });
    });

    casaDiv.appendChild(pessoasDiv);
    casaDiv.appendChild(adicionarPessoaBtn);
    casaDiv.appendChild(removerAgregadoBtn);

    casasContainer.appendChild(casaDiv);
    casas.push(casaDiv);
}

// Validação de email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para sortear
async function sortear() {
    const nomeFamilia = nomeFamiliaInput.value.trim();
    if (!nomeFamilia) {
        alert("Por favor, insere o nome da família.");
        return;
    }

    if (casas.length === 0) {
        alert("Adiciona pelo menos um agregado.");
        return;
    }

    // Verificar se todos os emails são válidos
    for (const casa of casas) {
        if (!casa.pessoas || casa.pessoas.length === 0) {
            alert("Todos os agregados devem ter pelo menos uma pessoa.");
            return;
        }
        for (const p of casa.pessoas) {
            if (!p.nomeInput.value.trim()) {
                alert("Todos os nomes devem estar preenchidos.");
                return;
            }
            if (!validarEmail(p.emailInput.value.trim())) {
                alert(`Email inválido: ${p.emailInput.value.trim()}`);
                return;
            }
        }
    }

    const payload = {
        familia: nomeFamilia,
        casas: casas.map(c =>
            c.pessoas.map(p => ({
                nome: p.nomeInput.value.trim(),
                email: p.emailInput.value.trim()
            }))
        )
    };

    try {
        const res = await fetch(`${API_BASE}/sortear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao sortear");

        const data = await res.json();

        const resultadoDiv = document.getElementById("resultado");
        resultadoDiv.innerHTML = `<h3>🎅 Sorteio da família ${nomeFamilia} concluído com sucesso! 🎁</h3>`;
    } catch (err) {
        console.error(err);
        alert("Ocorreu um erro ao tentar sortear. Vê o console.");
    }
}

adicionarAgregadoBtn.addEventListener("click", criarAgregado);
sortearBtn.addEventListener("click", sortear);
