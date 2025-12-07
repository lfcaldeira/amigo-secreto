const casasContainer = document.getElementById("casas-container");
const addCasaBtn = document.getElementById("add-casa-btn");
const sortearBtn = document.getElementById("sortear-btn");
const output = document.getElementById("output");

addCasa();

// cria uma casa nova
function addCasa() {
    const casaDiv = document.createElement("div");
    casaDiv.className = "casa";

    const pessoasDiv = document.createElement("div");
    pessoasDiv.className = "pessoas";

    const addPessoaBtn = document.createElement("button");
    addPessoaBtn.textContent = "Adicionar Pessoa";
    addPessoaBtn.onclick = () => addPessoa(pessoasDiv);

    casaDiv.appendChild(pessoasDiv);
    casaDiv.appendChild(addPessoaBtn);

    casasContainer.appendChild(casaDiv);

    addPessoa(pessoasDiv);
}

// cria uma pessoa na casa
function addPessoa(container) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nome / email / número";
    input.className = "pessoa-input";
    container.appendChild(input);
}

addCasaBtn.onclick = () => addCasa();

// envio do sorteio
sortearBtn.onclick = async () => {
    const casas = [];

    document.querySelectorAll(".casa").forEach(casaEl => {
        const pessoas = [];
        casaEl.querySelectorAll(".pessoa-input").forEach(inp => {
            if (inp.value.trim() !== "") {
                pessoas.push(inp.value.trim());
            }
        });

        if (pessoas.length > 0) {
            casas.push({
                nome: "Casa",
                pessoas: pessoas
            });
        }
    });

    output.textContent = "A contactar o servidor...";

    try {
        const response = await fetch("/api/sortear", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(casas)
        });

        if (!response.ok) {
            throw new Error("Erro do servidor");
        }

        const data = await response.json();
        output.textContent = data.mensagem;

    } catch (e) {
        output.textContent = "Erro ao contactar o servidor.";
    }
};
