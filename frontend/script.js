document.addEventListener("DOMContentLoaded", () => {
  const casasContainer = document.getElementById("casas-container");
  const addCasaBtn = document.getElementById("add-casa");
  const sortearBtn = document.getElementById("sortear");
  const resultadoDiv = document.getElementById("resultado");

  // Adiciona uma nova casa
  addCasaBtn.addEventListener("click", () => {
    const casaDiv = document.createElement("div");
    casaDiv.className = "casa";
    casaDiv.innerHTML = `
      <strong>Casa</strong>
      <div class="pessoas-container"></div>
      <button type="button" class="add-pessoa">Adicionar Pessoa</button>
    `;
    casasContainer.appendChild(casaDiv);

    const addPessoaBtn = casaDiv.querySelector(".add-pessoa");
    const pessoasContainer = casaDiv.querySelector(".pessoas-container");

    addPessoaBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nome ou email";
      pessoasContainer.appendChild(input);
    });
  });

  // Função para enviar dados para o backend
  sortearBtn.addEventListener("click", async () => {
    const casas = [];
    const casasDivs = document.querySelectorAll(".casa");

    casasDivs.forEach(casaDiv => {
      const pessoas = [];
      casaDiv.querySelectorAll("input").forEach(input => {
        const val = input.value.trim();
        if (val) pessoas.push(val);
      });
      if (pessoas.length) casas.push(pessoas);
    });

    // Limpa o output anterior
    resultadoDiv.innerHTML = "";

    try {
      const response = await fetch("http://backend:8000/sortear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casas })
      });

      if (!response.ok) {
        resultadoDiv.innerHTML = `<p>Erro ao contactar o servidor: ${response.status}</p>`;
        return;
      }

      const resultado = await response.json();
      mostrarResultado(resultado);

    } catch (err) {
      resultadoDiv.innerHTML = `<p>Erro de conexão: ${err.message}</p>`;
    }
  });

  // Função para mostrar resultado
  function mostrarResultado(resultado) {
    for (const [quem, para] of Object.entries(resultado)) {
      resultadoDiv.innerHTML += `<p>${quem} → ${para}</p>`;
    }
  }
});
