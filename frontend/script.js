const API_URL = window.API_URL || "http://192.168.1.123:8000";

document.addEventListener("DOMContentLoaded", () => {
    const adicionarAgregadoBtn = document.getElementById("adicionar-agregado");
    const sortearBtn = document.getElementById("sortear");

    adicionarAgregadoBtn.addEventListener("click", adicionarAgregado);
    sortearBtn.addEventListener("click", sortear);

    adicionarAgregado(); // Inicializa com um agregado
});

function adicionarAgregado() {
    const casasContainer = document.getElementById("casas");

    const casaDiv = document.createElement("div");
    casaDiv.classList.add("casa");

    const pessoasContainer = document.createElement("div");
    pessoasContainer.classList.add("pessoas");

    const adicionarPessoaBtn = document.createElement("button");
    adicionarPessoaBtn.type = "button";
    adicionarPessoaBtn.textContent = "Adicionar Pessoa";
    adicionarPessoaBtn.addEventListener("click", () => adicionarPessoa(pessoasContainer));

    casaDiv.appendChild(pessoasContainer);
    casaDiv.appendChild(adicionarPessoaBtn);
    casasContainer.appendChild(casaDiv);

    adicionarPessoa(pessoasContainer); // Pessoa inicial
}

function adicionarPessoa(container) {
    const div = document.createElement("div");

    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.classList.add("pessoa");

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.placeholder = "Email";
    inputEmail.classList.add("pessoa");

    div.appendChild(inputNome);
    div.appendChild(inputEmail);
    container.appendChild(div);
}

function coletarCasas() {
    const casasDivs = document.querySelectorAll(".casa");
    const casas = [];

    casasDivs.forEach(casaDiv => {
        const pessoas = [];
        casaDiv.querySelectorAll(".pessoas div").forEach(div => {
            const inputs = div.querySelectorAll("input");
            const nome = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            if (nome && email) pessoas.push({ nome, email });
        });
        if (pessoas.length > 0) casas.push(pessoas);
    });

    return casas;
}

async function sortear() {
    const casas = coletarCasas();
    const familiaInput = document.getElementById("nome-familia").value.trim();
    if (!familiaInput) {
        alert("Por favor, preencha o nome da família/grupo.");
        return;
    }
    if (casas.length === 0) {
        alert("Adicione pelo menos uma pessoa antes de sortear.");
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/sortear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ casas, familia })
        });

        if (!resp.ok) throw new Error("Erro ao contactar o servidor");

        const resultado = await resp.json();
        mostrarResultado(resultado);

    } catch (e) {
        alert("Erro: " + e.message);
    }
}

function mostrarResultado(resultado) {
    const resDiv = document.getElementById("resultado");
    resDiv.innerHTML = "<h2>🎅 Resultado do Amigo Secreto 🎁</h2>";
    for (const [quem, para] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${quem}</strong> → ${para}`;
        resDiv.appendChild(p);
    }
}
