// Lista de agregados
let casas = [];

// Adicionar um novo agregado
document.getElementById("adicionar-agregado").addEventListener("click", () => {
    const casaIndex = casas.length;
    casas.push([]); // cada agregado é uma lista de pessoas

    const casasContainer = document.getElementById("casas");

    const divCasa = document.createElement("div");
    divCasa.classList.add("casa");
    divCasa.id = `casa-${casaIndex}`;

    const titulo = document.createElement("h3");
    titulo.textContent = `Agregado ${casaIndex + 1}`;
    divCasa.appendChild(titulo);

    const pessoasDiv = document.createElement("div");
    pessoasDiv.classList.add("pessoas");
    divCasa.appendChild(pessoasDiv);

    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.placeholder = "Nome da pessoa";
    nomeInput.classList.add("pessoa");

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Email da pessoa";
    emailInput.classList.add("pessoa");

    const adicionarPessoaBtn = document.createElement("button");
    adicionarPessoaBtn.textContent = "Adicionar Pessoa";

    adicionarPessoaBtn.addEventListener("click", () => {
        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();

        if (!nome || !email) {
            alert("Por favor, preencha nome e email!");
            return;
        }

        casas[casaIndex].push({ nome, email });

        // Mostrar na lista
        const pessoaSpan = document.createElement("span");
        pessoaSpan.textContent = `${nome} (${email})`;
        pessoasDiv.appendChild(pessoaSpan);
        pessoasDiv.appendChild(document.createElement("br"));

        // Limpar campos
        nomeInput.value = "";
        emailInput.value = "";
    });

    divCasa.appendChild(nomeInput);
    divCasa.appendChild(emailInput);
    divCasa.appendChild(adicionarPessoaBtn);

    casasContainer.appendChild(divCasa);
});

// Sortear
document.getElementById("sortear").addEventListener("click", async () => {
    const familia = document.getElementById("nome-familia").value.trim();
    if (!familia) {
        alert("Por favor, insira o nome da família/grupo!");
        return;
    }

    if (casas.length === 0 || casas.every(c => c.length === 0)) {
        alert("Adicione pelo menos uma pessoa a algum agregado!");
        return;
    }

    const payload = { familia, casas };

    try {
        const response = await fetch("http://192.168.1.123:8000/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const texto = await response.text();
            console.error("Erro no backend:", texto);
            alert("Erro ao sortear. Veja o console para detalhes.");
            return;
        }

        const resultado = await response.json();
        mostrarResultado(resultado, familia);

    } catch (err) {
        console.error(err);
        alert("Erro na comunicação com o backend!");
    }
});

// Mostrar resultado no HTML
function mostrarResultado(resultado, familia) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<h3>🎅 Resultado do Amigo Secreto da família ${familia} 🎁</h3>`;

    for (const [nome, amigo] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.textContent = `Olá ${nome}, foste selecionado para dar uma prenda a ${amigo}!`;
        resultadoDiv.appendChild(p);
    }
}
