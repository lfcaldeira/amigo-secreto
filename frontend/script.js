// script.js

let casas = []; // Lista de agregados
let casaAtual = null; // Agregado atual

const nomeFamiliaInput = document.getElementById("nome-familia");
const casasSection = document.getElementById("casas");
const adicionarAgregadoBtn = document.getElementById("adicionar-agregado");
const sortearBtn = document.getElementById("sortear");

adicionarAgregadoBtn.addEventListener("click", () => {
    const agregado = { pessoas: [] };
    casas.push(agregado);
    casaAtual = agregado;
    renderCasas();
});

function renderCasas() {
    casasSection.innerHTML = "";
    casas.forEach((casa, index) => {
        const casaDiv = document.createElement("div");
        casaDiv.classList.add("casa");
        casaDiv.innerHTML = `<h4>Agregado ${index + 1}</h4>`;

        casa.pessoas.forEach((pessoa, pIndex) => {
            const pDiv = document.createElement("div");
            pDiv.textContent = `${pessoa.nome} (${pessoa.email})`;
            casaDiv.appendChild(pDiv);
        });

        const nomeInput = document.createElement("input");
        nomeInput.placeholder = "Nome da pessoa";
        nomeInput.classList.add("pessoa");

        const emailInput = document.createElement("input");
        emailInput.placeholder = "Email da pessoa";
        emailInput.classList.add("pessoa");

        const addPessoaBtn = document.createElement("button");
        addPessoaBtn.textContent = "Adicionar Pessoa";
        addPessoaBtn.addEventListener("click", () => {
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            if (!nome || !email) {
                alert("Por favor preencha nome e email da pessoa!");
                return;
            }
            casa.pessoas.push({ nome, email });
            nomeInput.value = "";
            emailInput.value = "";
            renderCasas();
        });

        casaDiv.appendChild(nomeInput);
        casaDiv.appendChild(emailInput);
        casaDiv.appendChild(addPessoaBtn);

        casasSection.appendChild(casaDiv);
    });
}

sortearBtn.addEventListener("click", async () => {
    const familia = nomeFamiliaInput.value.trim();
    if (!familia) {
        alert("Por favor insira o nome da família!");
        return;
    }

    if (casas.length === 0) {
        alert("Adicione pelo menos um agregado com pessoas!");
        return;
    }

    // Validar se cada agregado tem pelo menos uma pessoa
    for (const casa of casas) {
        if (!casa.pessoas.length) {
            alert("Cada agregado deve ter pelo menos uma pessoa!");
            return;
        }
    }

    const payload = { familia, casas };
    
    try {
        const response = await fetch("http://192.168.1.123:8000/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const data = await response.json();
            alert(`Erro no backend: ${JSON.stringify(data)}`);
            return;
        }

        const resultado = await response.json();
        mostrarResultado(resultado, familia);
    } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
        alert("Erro ao comunicar com o backend. Veja o console para mais detalhes.");
    }
});

function mostrarResultado(resultado, familia) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<h3>🎅 Resultado do Amigo Secreto da família ${familia} 🎁</h3>`;
    for (const [nome, amigo] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.textContent = `Olá ${nome}, foste selecionado para dar uma prenda a ${amigo}!`;
        resultadoDiv.appendChild(p);
    }
}
