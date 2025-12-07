const API_URL = window.API_URL || "http://192.168.1.123:8000";

document.addEventListener("DOMContentLoaded", () => {
    const btnAdicionar = document.getElementById("adicionar-agregado");
    const btnSortear = document.getElementById("sortear");

    btnAdicionar.addEventListener("click", adicionarAgregado);
    btnSortear.addEventListener("click", sortear);

    adicionarAgregado(); // adiciona um agregado inicial
});

function adicionarAgregado() {
    const casasContainer = document.getElementById("casas");
    if (!casasContainer) return;

    const casaDiv = document.createElement("div");
    casaDiv.classList.add("casa");

    const pessoasContainer = document.createElement("div");
    pessoasContainer.classList.add("pessoas");

    const btnAdicionarPessoa = document.createElement("button");
    btnAdicionarPessoa.type = "button";
    btnAdicionarPessoa.textContent = "Adicionar Pessoa";
    btnAdicionarPessoa.addEventListener("click", () => adicionarPessoa(pessoasContainer));

    casaDiv.appendChild(pessoasContainer);
    casaDiv.appendChild(btnAdicionarPessoa);
    casasContainer.appendChild(casaDiv);

    adicionarPessoa(pessoasContainer); // uma pessoa inicial
}

function adicionarPessoa(container) {
    const div = document.createElement("div");
    div.classList.add("pessoa-container");

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
        casaDiv.querySelectorAll(".pessoa-container").forEach(div => {
            const nome = div.children[0].value.trim();
            const email = div.children[1].value.trim();
            if (nome && email) pessoas.push({ nome, email });
        });
        if (pessoas.length > 0) casas.push(pessoas);
    });

    return casas;
}

function sortear() {
    const casas = coletarCasas();
    if (casas.length === 0) {
        alert("Adicione pelo menos uma pessoa antes de sortear.");
        return;
    }

    fetch(`${API_URL}/sortear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casas })
    })
    .then(resp => resp.json())
    .then(resultado => mostrarResultado(resultado))
    .catch(err => alert("Erro ao contactar o servidor: " + err));
}

function mostrarResultado(resultado) {
    const resDiv = document.getElementById("resultado");
    resDiv.innerHTML = "";
    const titulo = document.createElement("h2");
    titulo.textContent = "🎅 Resultado do Amigo Secreto 🎁";
    resDiv.appendChild(titulo);

    for (const [quem, para] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${quem}</strong> → ${para}`;
        resDiv.appendChild(p);
    }
}
