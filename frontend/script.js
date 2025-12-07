let casas = [];
const casasDiv = document.getElementById("casas");
const resultadoDiv = document.getElementById("resultado");
const avisosDiv = document.getElementById("avisos");

document.getElementById("addCasa").onclick = () => addCasa();

function addCasa() {
    const casa = { pessoas: [""] };
    casas.push(casa);
    render();
}

function render() {
    casasDiv.innerHTML = "";

    casas.forEach((casa, idxCasa) => {
        const div = document.createElement("div");
        div.className = "casa";

        const title = document.createElement("div");
        title.className = "casa-title";
        title.textContent = `Casa ${idxCasa + 1}`;
        div.appendChild(title);

        casa.pessoas.forEach((nome, idxPessoa) => {
            const pDiv = document.createElement("div");
            pDiv.className = "pessoa";

            const input = document.createElement("input");
            input.value = nome;
            input.placeholder = "Pessoa / email / número";
            input.oninput = () => updatePessoa(idxCasa, idxPessoa, input.value);

            pDiv.appendChild(input);
            div.appendChild(pDiv);
        });

        casasDiv.appendChild(div);
    });
}

function updatePessoa(idxCasa, idxPessoa, valor) {
    const casa = casas[idxCasa];

    if (valor.trim() === "") {
        casa.pessoas.splice(idxPessoa, 1);
    } else {
        casa.pessoas[idxPessoa] = valor.trim();
        // se for o último slot preenchido, cria novo slot
        if (idxPessoa === casa.pessoas.length - 1) {
            casa.pessoas.push("");
        }
    }

    render();
}

document.getElementById("sortear").onclick = async () => {
    resultadoDiv.textContent = "";
    avisosDiv.textContent = "";

    const payload = { casas: casas.map(c => c.pessoas.filter(p => p.trim() !== "")) };

    const resp = await fetch("/api/sortear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await resp.json();

    resultadoDiv.textContent = data.resultado;

    if (data.avisos) {
        avisosDiv.innerHTML = `<strong>${data.avisos}</strong>`;
    }
};
