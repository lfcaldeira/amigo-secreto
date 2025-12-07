const adicionarAgregadoBtn = document.getElementById("adicionar-agregado");
const sortearBtn = document.getElementById("sortear");
const casasContainer = document.getElementById("casas");
const nomeFamiliaInput = document.getElementById("nome-familia");

let casas = [];

// Função para criar um novo agregado
function criarAgregado() {
    const casaDiv = document.createElement("div");
    casaDiv.classList.add("casa");

    const pessoasDiv = document.createElement("div");
    pessoasDiv.classList.add("pessoas");

    // Botão para adicionar pessoa dentro do agregado
    const adicionarPessoaBtn = document.createElement("button");
    adicionarPessoaBtn.textContent = "Adicionar Pessoa";

    adicionarPessoaBtn.addEventListener("click", () => {
        const pessoaDiv = document.createElement("div");

        const nomeInput = document.createElement("input");
        nomeInput.type = "text";
        nomeInput.placeholder = "Nome";
        nomeInput.classList.add("pessoa");

        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "Email";
        emailInput.classList.add("pessoa");

        pessoaDiv.appendChild(nomeInput);
        pessoaDiv.appendChild(emailInput);
        pessoasDiv.appendChild(pessoaDiv);

        // Mantemos referência das pessoas no agregado
        if (!casaDiv.pessoas) casaDiv.pessoas = [];
        casaDiv.pessoas.push({ nomeInput, emailInput });
    });

    casaDiv.appendChild(pessoasDiv);
    casaDiv.appendChild(adicionarPessoaBtn);

    casasContainer.appendChild(casaDiv);
    casas.push(casaDiv);
}

// Função para sortear
async function sortear() {
    const nomeFamilia = nomeFamiliaInput.value.trim();
    if (!nomeFamilia) {
        alert("Por favor, insere o nome da família.");
        return;
    }

    // Criar payload
    const payload = {
        familia: nomeFamilia,
        casas: casas.map(c =>
            c.pessoas.map(p => ({
                nome: p.nomeInput.value.trim(),
                email: p.emailInput.value.trim()
            }))
        )
    };

    try {
        const res = await fetch("http://192.168.1.123:8000/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao sortear");

        const data = await res.json();

        // Mostrar apenas mensagem de sucesso
        const resultadoDiv = document.getElementById("resultado");
        resultadoDiv.innerHTML = `<h3>🎅 Sorteio da família ${nomeFamilia} concluído com sucesso! 🎁</h3>`;
    } catch (err) {
        console.error(err);
        alert("Ocorreu um erro ao tentar sortear. Vê o console.");
    }
}

// Ligar botões às funções
adicionarAgregadoBtn.addEventListener("click", criarAgregado);
sortearBtn.addEventListener("click", sortear);
