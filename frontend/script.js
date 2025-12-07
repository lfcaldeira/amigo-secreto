let casas = [
    { nome: "Casa", pessoas: [""] }
];

function render() {
    const container = document.getElementById("casas");
    container.innerHTML = "";

    casas.forEach((casa, idxCasa) => {
        const div = document.createElement("div");
        div.className = "casa";

        const h = document.createElement("h2");
        h.textContent = casa.nome;
        div.appendChild(h);

        // Lista de pessoas
        casa.pessoas.forEach((pessoa, idxPessoa) => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = pessoa;

            input.oninput = () => {
                casas[idxCasa].pessoas[idxPessoa] = input.value.trim();
            };

            input.onblur = () => {
                // Quando sair da caixa e for a última, cria nova
                if (
                    idxPessoa === casa.pessoas.length - 1 &&
                    input.value.trim() !== ""
                ) {
                    casas[idxCasa].pessoas.push("");
                    render();
                }
            };

            div.appendChild(input);
        });

        container.appendChild(div);
    });
}

document.getElementById("sortear").onclick = async () => {
    const output = document.getElementById("output");
    output.textContent = "A sortear...";

    try {
        const resp = await fetch("http://localhost:8000/api/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(casas)
        });

        const data = await resp.json();
        output.textContent = data.mensagem;
    } catch (e) {
        output.textContent = "Erro ao contactar o servidor.";
    }
};

render();
