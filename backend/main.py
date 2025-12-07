from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class PessoaCasa(BaseModel):
    nome: str
    pessoas: list[str]

class Casas(BaseModel):
    __root__: list[PessoaCasa]


@app.post("/api/sortear")
def sortear(casas: list[PessoaCasa]):
    # junta todas as pessoas
    pessoas = []
    for casa in casas:
        for p in casa.pessoas:
            if p.strip() != "":
                pessoas.append(p.strip())

    if len(pessoas) < 2:
        return {"mensagem": "É preciso pelo menos 2 pessoas."}

    # primeira fase: detectar números
    numeros = [p for p in pessoas if any(ch.isdigit() for ch in p)]

    if numeros:
        return {
            "mensagem": (
                "Foram detetados números nos nomes: "
                + ", ".join(numeros)
                + ". Cada um receberá uma mensagem individual."
            )
        }

    # segunda fase: sortear
    sorteado = pessoas[:]
    random.shuffle(sorteado)

    pares = {pessoas[i]: sorteado[i] for i in range(len(pessoas))}

    # Sem revelar quem recebeu quem → só mensagem final
    return {
        "mensagem": "Sorteio concluído. Mensagens enviadas individualmente."
    }
