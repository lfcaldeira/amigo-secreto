const API_URL = "http://192.168.1.123:8000";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add-agregado").addEventListener("click", adicionarAgregado);
    document.getElementById("sortear").addEventListener("click", sortear);
    adicionarAgregado();
});

function adicionarAgregado() {
    const container = document.getElementById("agregados");
    const div = document.createElement("div");
    div.classList.add("agregado");

    const pessoasDiv = document.createElement("div");
    pessoasDiv.classList.add("pessoas");

    const addPessoaBtn = document.createElement("button");
    addPessoaBtn.type = "button";
    addPessoaBtn.textContent = "Adicionar Participante";
    addPessoaBtn.addEventListener("click", () => adicionarPessoa(pessoasDiv));

    div.appendChild(pessoasDiv);
    div.appendChild(addPessoaBtn);
    container.appendChild(div);

    adicionarPessoa(pessoasDiv);
}

function adicionarPessoa(container) {
    const nome = document.createElement("input");
    nome.type = "text";
    nome.placeholder = "Nome";
    nome.classList.add("nome");

    const email = document.createElement("input");
    email.type = "email";
    email.placeholder = "Email";
    email.classList.add("email");

    container.appendChild(nome);
    container.appendChild(email);
}

function coletarAgregados() {
    const agregadosDivs = document.querySelectorAll(".agregado");
    const agregados = [];

    agregadosDivs.forEach(div => {
        const participantes = [];
        const nomes = div.querySelectorAll(".nome");
        const emails = div.querySelectorAll(".email");
        nomes.forEach((input, idx) => {
            if(input.value.trim()) {
                participantes.push({ nome: input.value.trim(), email: emails[idx].value.trim() });
            }
        });
        if(participantes.length) agregados.push(participantes);
    });

    return agregados;
}

async function sortear() {
    const agregados = coletarAgregados();
    if (agregados.length === 0) return alert("Adicione pelo menos um participante!");

    try {
        const resp = await fetch(`${API_URL}/sortear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agregados })
        });

        if(!resp.ok) throw new Error(await resp.text());

        const resultado = await resp.json();
        mostrarResultado(resultado);

    } catch (e) {
        alert("Erro: " + e.message);
    }
}

function mostrarResultado(resultado) {
    const resDiv = document.getElementById("resultado");
    resDiv.innerHTML = "<h2>🎅 Resultado do Amigo Secreto 🎁</h2>";
    for (const [quem, para] of Object.entries(resultado)) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${quem}</strong> → ${para}`;
        resDiv.appendChild(p);
    }
}
