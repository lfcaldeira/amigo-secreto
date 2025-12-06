const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let persons = [];
let links = {}; // { A: ["B","C"], ... }
let selected = null;

canvas.addEventListener("click", (e) => {
  const { offsetX, offsetY } = e;

  for (const p of persons) {
    const dx = p.x - offsetX;
    const dy = p.y - offsetY;
    if (dx*dx + dy*dy < 25*25) {
      if (!selected) {
        selected = p;
      } else {
        if (selected.name !== p.name) {
          if (!links[selected.name]) links[selected.name] = [];
          links[selected.name].push(p.name);

          if (!links[p.name]) links[p.name] = [];
          links[p.name].push(selected.name);
        }
        selected = null;
      }
      draw();
      return;
    }
  }
});

function addPerson() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) return;

  persons.push({
    name,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  });

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // lines
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  for (const a in links) {
    for (const b of links[a]) {
      const pa = persons.find(p => p.name === a);
      const pb = persons.find(p => p.name === b);
      if (pa && pb) {
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
  }

  // persons
  for (const p of persons) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#eee";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.name, p.x, p.y);
  }
}

async function drawSecret() {
  const payload = {
    participants: persons.map(p => p.name),
    restrictions: links
  };

  const res = await fetch("http://localhost:3000/draw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Resultado:", data);
  alert(JSON.stringify(data, null, 2));
}
