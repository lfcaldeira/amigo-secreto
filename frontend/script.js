document.addEventListener("DOMContentLoaded", () => {
    const btnAdicionar = document.getElementById("adicionar-agregado");
    const btnSortear = document.getElementById("sortear");

    btnAdicionar.addEventListener("click", adicionarAgregado);
    btnSortear.addEventListener("click", sortear);

    // Inicializa com um agregado
    adicionarAgregado();
});

function adicionarAgregado() {
    const container = document.getElementById("casas");

    const casaDiv = document.createElement("div");
    casaDiv.classList.add("casa");

    const pessoasDiv = document.createElement("div");
    pessoasDiv.classList.add("pessoas");

    const btnAdicionarPessoa = document.createElement("button");
    btnAdicionarPessoa.type = "button";
    btnAdicionarPessoa.textContent = "Adicionar Pessoa";
    btnAdicionarPessoa.addEventListener("click", () => adicionarPessoa(pessoasDiv));

    casaDiv.appendChild(pessoasDiv);
    casaDiv.appendChild(btnAdicionarPessoa);
    container.appendChild(casaDiv);

    // Uma pessoa inicial
    adicionarPessoa(pessoasDiv);
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
            const val = input.value.trim();
            if (val) pessoas.push(val);
        });
        if (pessoas.length > 0) casas.push(pessoas);
    });
    return casas;
}

function sortear() {
    const casas = coletarCasas();
    if (casas.length === 0) {
        alert("Adicione pelo menos uma pessoa.");
        return;
    }

    const todos = casas.flat();
    const resultado = {};
    let disponiveis = [...todos];

    for (let pessoa of todos) {
        const validos = disponiveis.filter(p => !casas.some(c => c.includes(pessoa) && c.includes(p)));
        let escolha = validos[Math.floor(Math.random() * validos.length)];

        // backtrack se não houver opção
        if (!escolha) {
            alert("Não foi possível sortear, tente novamente.");
            return;
        }

        resultado[pessoa] = escolha;
        disponiveis = disponiveis.filter(p => p !== escolha);
    }

    mostrarResultado(resultado);
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
