const API_URL = window.API_URL || "[http://192.168.1.123:8000](http://192.168.1.123:8000)"; // IP do servidor Docker

document.addEventListener("DOMContentLoaded", () => {
const adicionarCasaBtn = document.getElementById("add-casa");
const sortearBtn = document.getElementById("sortear");


adicionarCasaBtn.addEventListener("click", adicionarCasa);
sortearBtn.addEventListener("click", sortear);

// Inicializa com uma casa
adicionarCasa();


});

function adicionarCasa() {
const casasContainer = document.getElementById("casas");
if (!casasContainer) return;


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

adicionarPessoa(pessoasContainer);


}

function adicionarPessoa(container) {
const input = document.createElement("input");
input.type = "text";
input.placeholder = "Nome ou Email";
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
        if (valor) pessoas.push(valor);
    });
    if (pessoas.length > 0) casas.push(pessoas);
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
        body: JSON.stringify({ casas })
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro do servidor: ${resp.status} - ${text}`);
    }

    const resultado = await resp.json();
    mostrarResultado(resultado);

    // O envio de emails é feito no backend. Nenhuma chamada extra aqui.
} catch (e) {
    alert("Erro ao contactar o servidor: " + e.message);
}


}

function mostrarResultado(resultado) {
const resDiv = document.getElementById("resultado");
if (!resDiv) return;
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
