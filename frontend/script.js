const casasContainer = document.getElementById("casas-container");
const resultado = document.getElementById("resultado");

document.getElementById("adicionar-casa").addEventListener("click", () => {
    const casaDiv = document.createElement("div");
    casaDiv.className = "casa";

    const addPessoaBtn = document.createElement("button");
    addPessoaBtn.textContent = "Adicionar Pessoa";

    addPessoaBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.placeholder = "Nome / Email / Número";
        casaDiv.appendChild(input);
    });

    casaDiv.appendChild(addPessoaBtn);
    casasContainer.appendChild(casaDiv);
});

document.getElementById("sortear").addEventListener("click", async () => {
    const casasDivs = document.querySelectorAll(".casa");
    const casas = [];

    casasDivs.forEach(casaDiv => {
        const inputs = casaDiv.querySelectorAll("input");
        const membros = [];
        inputs.forEach(input => {
            const val = input.value.trim();
            if(val) membros.push(val);
        });
        if(membros.length) casas.push({ membros });
    });

    if(casas.length === 0) {
        resultado.textContent = "Adicione pelo menos uma pessoa!";
        return;
    }

    try {
        const resp = await fetch("/api/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ casas })
        });
        const data = await resp.json();
        resultado.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        resultado.textContent = "Erro ao contactar o servidor.";
    }
});
