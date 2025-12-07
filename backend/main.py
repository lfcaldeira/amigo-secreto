from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random, os, re
from fastapi.middleware.cors import CORSMiddleware
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = FastAPI()
origins = ["http://192.168.1.123:8080", "http://backend:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Casas(BaseModel):
    casas: List[List[dict]]  # cada dict: {"nome":..., "email":...}

def is_email(valor: str) -> bool:
    return re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", valor) is not None

def enviar_email(destinatario: str, assunto: str, conteudo: str):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    FROM_EMAIL = "friend@giftmatchwill.work"
    message = Mail(from_email=FROM_EMAIL, to_emails=destinatario, subject=assunto, html_content=conteudo)
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
        print(f"Email enviado para {destinatario}")
    except Exception as e:
        print(f"Erro ao enviar email para {destinatario}: {e}")

def gerar_email_html(nome, grupo, amigo_secreto) -> str:
    return f"""
    <html><body style="font-family:Arial; background:#fff8f0; color:#333; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border:2px solid #f44336; border-radius:10px; padding:30px; text-align:center;">
            <h1 style="color:#f44336;">🎄 Amigo Secreto 🎁</h1>
            <p>Olá <strong>{nome}</strong>! 👋</p>
            <p>Foste adicionado ao amigo secreto feito pelo <strong>{grupo}</strong>.</p>
            <p>Deverás dar a prenda a: <strong>{amigo_secreto}</strong> 🎁</p>
            <p>Cria mais grupos aqui: <a href="http://192.168.1.123:8080" target="_blank">Amigo Secreto Natal</a></p>
            <p>✨🎅🎁🎄✨</p>
            <p style="font-size:12px; color:#999;">Este é um email automático.</p>
        </div>
    </body></html>
    """

@app.post("/sortear")
def sortear(casas: Casas):
    todos = [p for casa in casas.casas for p in casa]
    pessoa_para_casa = {p["nome"]: [x["nome"] for x in casa] for casa in casas.casas for p in casa}

    def gerar_sorteio():
        disponiveis = set(p["nome"] for p in todos)
        resultado = {}
        for p in todos:
            nome = p["nome"]
            validos = [d for d in disponiveis if d not in pessoa_para_casa[nome]]
            if not validos:
                return None
            escolha = random.choice(validos)
            resultado[nome] = next(x for x in todos if x["nome"] == escolha)
            disponiveis.remove(escolha)
        return resultado

    for _ in range(1000):
        sorteio = gerar_sorteio()
        if sorteio:
            return sorteio

    return {"error": "Não foi possível gerar um sorteio válido."}

@app.post("/enviar_email")
def enviar_email_endpoint(destinatario: str, nome: str, grupo: str, amigo_secreto: str):
    html = gerar_email_html(nome, grupo, amigo_secreto)
    enviar_email(destinatario, f"🎄 Teu Amigo Secreto!", html)
    return {"status": "email enviado"}
