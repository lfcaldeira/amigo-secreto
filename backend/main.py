from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

origins = [
    "http://192.168.1.123:8080",  # substitui pelo IP da máquina a servir o frontend
    "http://backend:8080",      # opcional, se testares local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Casas(BaseModel):
    casas: List[List[str]]

@app.post("/sortear")
def sortear(casas: Casas):
    todos = [p for casa in casas.casas for p in casa]

    # Mapeia cada pessoa à sua casa
    pessoa_para_casa = {p: casa for casa in casas.casas for p in casa}

    def gerar_sorteio():
        destinatarios_disponiveis = set(todos)
        resultado = {}

        for pessoa in todos:
            validos = [d for d in destinatarios_disponiveis if d not in pessoa_para_casa[pessoa]]
            if not validos:
                return None  # backtrack, falha
            escolha = random.choice(validos)
            resultado[pessoa] = escolha
            destinatarios_disponiveis.remove(escolha)

        return resultado

    # Tenta gerar até conseguir
    for _ in range(1000):
        sorteio = gerar_sorteio()
        if sorteio:
            for remetente, destinatario in sorteio.items():
                # aqui podes usar remetente como nome ou email real
                if is_email(remetente):
                    enviar_email(destinatario=remetente, 
                                 assunto="Amigo Secreto", 
                                 conteudo=f"Recebeste para oferecer a: {destinatario}")

            return sorteio

    return {"error": "Não foi possível gerar um sorteio válido."}

def is_email(valor: str) -> bool:
    padrao = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(padrao, valor) is not None