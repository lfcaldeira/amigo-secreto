from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import re

app = FastAPI()

origins = [
    "http://192.168.1.123:8080",  # IP do frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Modelos -----------------
class Agregados(BaseModel):
    agregados: List[List[dict]]  # cada participante: {"nome": str, "email": str}

# ----------------- Utilitários -----------------
def is_email(valor: str) -> bool:
    padrao = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(padrao, valor) is not None

def enviar_email(destinatario: str, assunto: str, conteudo: str):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")  
    FROM_EMAIL = "friend@giftmatchwill.work"

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=destinatario,
        subject=assunto,
        plain_text_content=conteudo
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email enviado para {destinatario}: {response.status_code}")
    except Exception as e:
        print(f"Erro ao enviar email para {destinatario}: {e}")

# ----------------- Endpoints -----------------
@app.post("/adicionar_participante")
def adicionar_participante(nome: str, email: str, grupo: str):
    conteudo = f"Olá {nome}! 🎄\nFoste adicionado ao grupo do Amigo Secreto do {grupo}.\nEm breve receberás o nome do teu amigo secreto!"
    enviar_email(destinatario=email, assunto=f"Foste adicionado ao grupo do Amigo Secreto! 🎄", conteudo=conteudo)
    return {"status": "email enviado", "nome": nome, "grupo": grupo}

@app.post("/sortear")
def sortear(agregados: Agregados):
    todos = [p for agregado in agregados.agregados for p in agregado]
    resultado = {}
    tentativas = 0

    while tentativas < 1000:
        tentativas += 1
        random.shuffle(todos)
        valido = True
        resultado.clear()

        for i, remetente in enumerate(todos):
            destinatario = todos[(i + 1) % len(todos)]
            # Ninguém pode receber alguém do mesmo agregado ou a si próprio
            for agregado in agregados.agregados:
                if remetente in agregado:
                    if destinatario in agregado:
                        valido = False
                        break
            if not valido:
                break
            resultado[remetente["nome"]] = destinatario["nome"]
            # Enviar email se tiver email
            if is_email(remetente.get("email", "")):
                enviar_email(
                    destinatario=remetente["email"],
                    assunto="🎄 Amigo Secreto 2025 🎁",
                    conteudo=f"Olá {remetente['nome']}! O teu amigo secreto é: {destinatario['nome']} 🎁"
                )
        if valido:
            return resultado

    return {"error": "Não foi possível gerar um sorteio válido."}
