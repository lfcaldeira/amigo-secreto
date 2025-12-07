from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class Casa(BaseModel):
    nome: str
    pessoas: list[str]

@app.post("/api/sortear")
def sortear(casas: list[Casa]):
    pessoas = []

    for casa in casas:
        for p in casa.pessoas:
            pessoas.append(p)

    if len(pessoas) < 2:
        return {"mensagem": "É preciso pelo menos duas pessoas."}

    # detectar se há números (telefones)
    numeros = [p for p in pessoas if any(c.isdigit() for c in p)]
    if numeros:
        return {
            "mensagem":
                "Foram detetados números: "
                + ", ".join(numeros)
                + ". Serão enviadas mensagens individuais."
        }

    # sortear
    shuffled = pessoas[:]
    random.shuffle(shuffled)

    # pares (não retornados no frontend)
    pares = {pessoas[i]: shuffled[i] for i in range(len(pessoas))}

    return {"mensagem": "Sorteio concluído. Mensagens enviadas individualmente."}
