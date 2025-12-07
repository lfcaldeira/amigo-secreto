let casas = [];

function adicionarCasa() {
	const casa = [];
	casas.push(casa);
	renderizarCasas();
}

function adicionarPessoa(casaIdx) {
	const nome = prompt("Nome da pessoa:");
	if (!nome) return;
	if (casas.some(c => c.includes(nome))) {
		alert("Nome já existe!");
		return;
	}
	casas[casaIdx].push(nome);
	renderizarCasas();
}

function renderizarCasas() {
	const container = document.getElementById("casas-container");
	container.innerHTML = "";
	casas.forEach((casa, idx) => {
			const div = document.createElement("div");
			div.className = "casa";
			div.innerHTML = '<strong>Casa ' + (idx + 1) + '</strong>';
			casa.forEach(pessoa => {
					const span = document.createElement("span");
					span.className = "pessoa";
					span.textContent = pessoa;
					div.appendChild(span);
					});
			const btn = document.createElement("button");
			btn.textContent = "Adicionar Pessoa";
			btn.onclick = () => adicionarPessoa(idx);
			div.appendChild(btn);
			container.appendChild(div);
			});
}

async function sortear() {
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
const resDiv = document.getElementById("resultado");
resDiv.innerHTML = "Resultado";
for (const [quem, para] of Object.entries(resultado)) {
	resDiv.innerHTML += <p>${quem} → ${para}</p>;
}
}
