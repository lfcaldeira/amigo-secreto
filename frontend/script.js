const API_URL = window.API_URL || "http://192.168.1.123:8000";

document.addEventListener("DOMContentLoaded", () => {
    const addAgregadoBtn = document.getElementById("add-agregado");
    const sortearBtn = document.getElementById("sortear");

    addAgregadoBtn.addEventListener("click", adicionarAgregado);
    sortearBtn.addEventListener("click", sortear);

    adicionarAgregado();
});

function adicionarAgregado() {
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
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.classList.add("pessoa-nome");

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.placeholder = "Email";
    inputEmail.classList.add("pessoa-email");

    container.appendChild(inputNome);
    container.appendChild(inputEmail);
}

function coletarCasas() {
    const casasDivs = document.querySelectorAll(".casa");
    const casas = [];

    casasDivs.forEach(casaDiv => {
        const pessoas = [];
        const nomes = casaDiv.querySelectorAll(".pessoa-nome");
        const emails = casaDiv.querySelectorAll(".pessoa-email");
        for (let i = 0; i < nomes.length; i++) {
            const nome = nomes[i].value.trim();
            const email = emails[i].value.trim();
            if (nome && email) pessoas.push({nome, email});
        }
        if (pessoas.length) casas.push(pessoas);
    });

    return casas;
}

async function sortear() {
    const casas = coletarCasas();
    const nomeFamilia = document.getElementById("nome-familia").value.trim();
    if (!nomeFamilia) { alert("Preenche o nome da família!"); return; }

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

        // enviar emails
        for (const [quem, para] of Object.entries(resultado)) {
            fetch(`${API_URL}/enviar_email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destinatario: quem.email,
                    nome: quem.nome,
                    grupo: nomeFamilia,
                    amigo_secreto: para.nome
                })
            });
        }
    } catch(e) {
        alert("Erro: " + e.message);
    }
}

function mostrarResultado(resultado) {
    const resDiv = document.getElementById("resultado");
    if (!resDiv) return;
    resDiv.innerHTML = "<h2>🎅 Resultado do Amigo Secreto 🎁</h2>";
    for (const [quem, para] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${quem.nome}</strong> → ${para.nome}`;
        resDiv.appendChild(p);
    }
}
