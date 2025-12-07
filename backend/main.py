from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from typing import List, Dict
import random
from fastapi.middleware.cors import CORSMiddleware
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = FastAPI()

origins = [
    "http://192.168.1.123:8080",
    "http://backend:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class Pessoa(BaseModel):
    nome: str
    email: EmailStr

class Casas(BaseModel):
    casas: List[List[Pessoa]]

class SorteioRequest(BaseModel):
    familia: str
    casas: List[List[Pessoa]]

# Função para enviar email
def enviar_email(destinatario: str, assunto: str, conteudo: str):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    FROM_EMAIL = "friend@giftmatchwill.work"

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=destinatario,
        subject=assunto,
        html_content=conteudo
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email enviado para {destinatario}: {response.status_code}")
    except Exception as e:
        print(f"Erro ao enviar email para {destinatario}: {e}")

# Gera HTML do email
def gerar_email_html(nome_pessoa: str, amigo_secreto: str, familia: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Amigo Secreto</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                background-color: #fff8f0;
                color: #333;
                padding: 20px;
            }}
            .container {{
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                border: 2px solid #f44336;
                border-radius: 10px;
                padding: 30px;
                text-align: center;
            }}
            h1 {{
                color: #f44336;
            }}
            p {{
                font-size: 16px;
                line-height: 1.5;
            }}
            .emoji {{
                font-size: 24px;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎄 Amigo Secreto 🎁</h1>
            <p>Olá <strong>{nome_pessoa}</strong>! 👋</p>
            <p>Foste selecionado para o amigo secreto da família <strong>{familia}</strong>.</p>
            <p>O teu amigo secreto é: <strong>{amigo_secreto}</strong> 🎁</p>
            <p class="emoji">✨🎅🎁🎄✨</p>
            <p class="footer">Este é um email automático, não é necessário responder.</p>
        </div>
    </body>
    </html>
    """

# Endpoint do sorteio
@app.post("/sortear")
def sortear(request: SorteioRequest):
    familia = request.familia
    casas = request.casas

    todos = [p for casa in casas for p in casa]

    pessoa_para_casa = {p.email: [x.email for x in casa] for casa in casas for p in casa}

    def gerar_sorteio():
        destinatarios_disponiveis = set(p.email for p in todos)
        resultado = {}

        for pessoa in todos:
            validos = [d for d in destinatarios_disponiveis if d not in pessoa_para_casa[pessoa.email]]
            if not validos:
                return None
            escolha = random.choice(validos)
            resultado[pessoa] = resultado[pessoa.email] = next(p.nome for p in todos if p.email == escolha)
            destinatarios_disponiveis.remove(escolha)

        return resultado

    for _ in range(1000):
        sorteio = gerar_sorteio()
        if sorteio:
            for pessoa_obj, amigo_nome in sorteio.items():
                html_email = gerar_email_html(pessoa_obj.nome, amigo_nome, familia)
                enviar_email(destinatario=pessoa_obj.email, assunto="O teu Amigo Secreto 🎄", conteudo=html_email)
            return {p.nome: a for p, a in sorteio.items()}

    return {"error": "Não foi possível gerar um sorteio válido."}
