// Definir o URL do backend (alterar para o IP do servidor se necessário)
const API_URL = window.API_URL || "http://192.168.1.123:8000";
document.addEventListener("DOMContentLoaded", () => {
const adicionarCasaBtn = document.getElementById("add-casa");
const sortearBtn = document.getElementById("sortear");
const casasContainer = document.getElementById("casas");


adicionarCasaBtn.addEventListener("click", () => {
    adicionarCasa();
});

sortearBtn.addEventListener("click", () => {
    sortear();
});

// Inicializa com uma casa
adicionarCasa();


});

function adicionarCasa() {
const casasContainer = document.getElementById("casas");

const casaDiv = document.createElement("div");
casaDiv.classList.add("casa");

const pessoasContainer = document.createElement("div");
pessoasContainer.classList.add("pessoas");

const adicionarPessoaBtn = document.createElement("button");
adicionarPessoaBtn.type = "button";
adicionarPessoaBtn.textContent = "Adicionar Pessoa";
adicionarPessoaBtn.addEventListener("click", () => {
    adicionarPessoa(pessoasContainer);
});

casaDiv.appendChild(pessoasContainer);
casaDiv.appendChild(adicionarPessoaBtn);
casasContainer.appendChild(casaDiv);

// Adiciona uma pessoa inicial
adicionarPessoa(pessoasContainer);

}

function adicionarPessoa(container) {
const input = document.createElement("input");
input.type = "text";
input.placeholder = "Nome / Email / Número";
input.classList.add("pessoa");
container.appendChild(input);
}

function coletarCasas() {
const casasDivs = document.querySelectorAll(".casa");
const casas = [];


casasDivs.forEach(casaDiv => {
    const pessoas = [];
    casaDiv.querySelectorAll(".pessoa").forEach(input => {
        const valor = input.value.trim();
        if (valor) {
            pessoas.push(valor);
        }
    });
    if (pessoas.length > 0) {
        casas.push(pessoas);
    }
});

return casas;


}

async function sortear() {
const casas = coletarCasas();


if (casas.length === 0) {
    alert("Adicione pelo menos uma pessoa antes de sortear.");
    return;
}

try {
    const resp = await fetch(`${API_URL}/sortear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(casas)
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro do servidor: ${resp.status} - ${text}`);
    }

    const resultado = await resp.json();
    mostrarResultado(resultado);
} catch (e) {
    alert("Erro ao contactar o servidor: " + e.message);
}


}

function mostrarResultado(resultado) {
const resDiv = document.getElementById("resultado");
resDiv.innerHTML = ""; // Limpa resultados anteriores


for (const [quem, para] of Object.entries(resultado)) {
    resDiv.innerHTML += `<p>${quem} → ${para}</p>`;
}


}
