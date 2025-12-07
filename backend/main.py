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

# Cada agregado é uma lista de dicionários {"nome": ..., "email": ...}
class Casas(BaseModel):
    casas: List[List[dict]]

def enviar_email(destinatario: str, assunto: str, html_conteudo: str):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    FROM_EMAIL = "friend@giftmatchwill.work"

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=destinatario,
        subject=assunto,
        html_content=html_conteudo
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email enviado para {destinatario}: {response.status_code}")
    except Exception as e:
        print(f"Erro ao enviar email para {destinatario}: {e}")

def gerar_email_adicao(nome, grupo) -> str:
    return f"""
    <div style='font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px; text-align:center;'>
        <h1>🎄 Amigo Secreto 🎁</h1>
        <p>Olá <strong>{nome}</strong>! 👋</p>
        <p>Foste adicionado ao grupo do Amigo Secreto do <strong>{grupo}</strong>.</p>
        <p>Em breve receberás o nome do teu amigo secreto e poderás preparar a tua prenda!</p>
        <p>✨🎅🎁🎄✨</p>
    </div>
    """

def gerar_email_sorteio(nome, amigo) -> str:
    return f"""
    <div style='font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px; text-align:center;'>
        <h1>🎄 Amigo Secreto 🎁</h1>
        <p>Olá <strong>{nome}</strong>! 👋</p>
        <p>O teu amigo secreto é: <strong>{amigo}</strong> 🎁</p>
        <p>Prepara a tua prenda e guarda segredo até ao grande dia!</p>
        <p>✨🎅🎁🎄✨</p>
    </div>
    """

def is_email(valor: str) -> bool:
    padrao = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(padrao, valor) is not None

@app.post("/adicionar_participante")
def adicionar_participante(nome: str, email: str, grupo: str):
    html_email = gerar_email_adicao(nome, grupo)
    enviar_email(destinatario=email, assunto=f"Foste adicionado ao grupo do Amigo Secreto! 🎄", html_conteudo=html_email)
    return {"status": "email enviado", "nome": nome, "grupo": grupo}

@app.post("/sortear")
def sortear(casas: Casas):
    # Flatten: lista de dicts {nome, email}
    todos = [p for casa in casas.casas for p in casa]

    # Mapeia cada pessoa à sua casa
    pessoa_para_casa = {id(p): casa for casa in casas.casas for p in casa}

    def gerar_sorteio():
        destinatarios_disponiveis = todos.copy()
        resultado = {}

        for pessoa in todos:
            # Excluir membros da mesma casa e a própria pessoa
            validos = [d for d in destinatarios_disponiveis if d not in pessoa_para_casa[id(pessoa)]]
            if not validos:
                return None
            escolha = random.choice(validos)
            resultado[pessoa['nome']] = escolha['nome']  # ou podes usar email para enviar
            destinatarios_disponiveis.remove(escolha)

        return resultado

    # Tenta gerar até conseguir
    for _ in range(1000):
        sorteio = gerar_sorteio()
        if sorteio:
            # Aqui podes enviar emails
            for pessoa in todos:
                email_dest = pessoa['email']
                nome_dest = pessoa['nome']
                amigo = sorteio[nome_dest]
                enviar_email(
                    destinatario=email_dest,
                    assunto="Amigo Secreto Natal 🎄",
                    conteudo=f"Olá {nome_dest}! O teu amigo secreto é: {amigo} 🎁"
                )
            return sorteio

    return {"error": "Não foi possível gerar um sorteio válido."}

