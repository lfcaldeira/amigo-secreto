import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@example.com";

// -------- Função de sorteio com restrições ----------
function shuffle(array) {
  return array
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((obj) => obj.v);
}

function validAssignment(list, restrictions) {
  const shuffled = shuffle(list);
  const assignment = {};
  for (let i = 0; i < list.length; i++) {
    const giver = list[i];
    const receiver = shuffled[i];

    if (giver === receiver) return null;
    if (restrictions[giver]?.includes(receiver)) return null;

    assignment[giver] = receiver;
  }
  return assignment;
}

function generateAssignment(list, restrictions) {
  for (let i = 0; i < 5000; i++) {
    const result = validAssignment(list, restrictions);
    if (result) return result;
  }
  return null;
}

// -------- API: sorteio ----------
app.post("/draw", (req, res) => {
  const { participants, restrictions } = req.body;

  const assignment = generateAssignment(participants, restrictions);

  if (!assignment) {
    return res.status(400).json({ error: "Não foi possível gerar sorteio válido." });
  }

  res.json({ assignment });
});

// -------- API: envio de email ----------
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      subject,
      text: message,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
