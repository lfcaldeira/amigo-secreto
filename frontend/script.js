document.addEventListener("DOMContentLoaded", () => {

    const casasDiv = document.getElementById("casas");
    const btnAdicionarAgregado = document.getElementById("adicionar-agregado");
    const btnSortear = document.getElementById("sortear");
    const resultadoDiv = document.getElementById("resultado");

    // -------------------------
    // ADICIONAR AGREGADO
    // -------------------------
    btnAdicionarAgregado.addEventListener("click", () => {
        const familiaNome = document.getElementById("nome-familia").value.trim();

        if (!familiaNome) {
            alert("Por favor introduz o nome da família/grupo.");
            return;
        }

        const casaId = Date.now(); // ID simples para identificar

        const casaDiv = document.createElement("div");
        casaDiv.classList.add("casa");
        casaDiv.setAttribute("data-id", casaId);

        casaDiv.innerHTML = `
            <h3>${familiaNome}</h3>

            <div class="pessoas"></div>

            <button class="adicionar-pessoa">Adicionar Pessoa</button>
        `;

        casasDiv.appendChild(casaDiv);

        const btnAddPessoa = casaDiv.querySelector(".adicionar-pessoa");
        btnAddPessoa.addEventListener("click", () => adicionarPessoa(casaDiv.querySelector(".pessoas")));
    });

    // -------------------------
    // ADICIONAR PESSOA A UMA CASA
    // -------------------------
    function adicionarPessoa(container) {
        const pessoaDiv = document.createElement("div");

        pessoaDiv.innerHTML = `
            <input type="text" class="pessoa-nome" placeholder="Nome">
            <input type="email" class="pessoa-email" placeholder="Email">
        `;

        container.appendChild(pessoaDiv);
    }

    // -------------------------
    // SORTEAR
    // -------------------------
    btnSortear.addEventListener("click", async () => {

        const casas = [];

        document.querySelectorAll(".casa").forEach(casaDiv => {
            const familia = casaDiv.querySelector("h3").textContent.trim();

            const pessoasNodes = casaDiv.querySelectorAll(".pessoas div");
            const pessoas = [];

            pessoasNodes.forEach(node => {
                const nome = node.querySelector(".pessoa-nome")?.value.trim();
                const email = node.querySelector(".pessoa-email")?.value.trim();

                if (nome && email) {
                    pessoas.push({ nome, email });
                }
            });

            // Só adicionamos casas válidas
            if (pessoas.length > 0) {
                casas.push({ familia, pessoas });
            }
        });

        if (casas.length === 0) {
            alert("Não há casas válidas para sortear.");
            return;
        }

        try {
            const response = await fetch("/sortear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(casas)
            });

            const data = await response.json();

            resultadoDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

        } catch (error) {
            resultadoDiv.innerHTML = "Erro ao comunicar com o servidor.";
        }
    });

});
