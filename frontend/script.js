async function sortear() {
    const casas = obterCasasDoFrontend(); // função que lê as casas e pessoas do UI

    const response = await fetch("/api/sortear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casas })
    });

    if (!response.ok) {
        alert("Erro ao contactar o servidor.");
        return;
    }

    const resultado = await response.json();
    console.log(resultado);
    mostrarResultadoNoUI(resultado); // função que mostra no frontend
}
