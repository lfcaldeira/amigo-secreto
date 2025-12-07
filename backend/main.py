from fastapi import FastAPI
from pydantic import BaseModel
import random
import re

app = FastAPI()

class CasasInput(BaseModel):
    casas: list[list[str]]

def is_email(s):
    return "@" in s and "." in s

def is_phone(s):
    return re.match(r"^(\+351)?9\d{8}$", s)

@app.post("/api/sortear")
def sortear(data: CasasInput):
    casas = data.casas

    pessoas = [p for casa in casas for p in casa]
    proibidos = {p: set(casa) - {p} for casa in casas for p in casa}

    for tentativa in range(2000):
        random.shuffle(pessoas)
        valido = True
        pares = {}

        for dador, recetor in zip(pessoas, pessoas[1:] + pessoas[:1]):
            if recetor in proibidos[dador]:
                valido = False
                break
            pares[dador] = recetor

        if valido:
            break

    if not valido:
        return {"resultado": "Erro: impossível sortear com estas casas."}

    saida = []
    numeros_detectados = False

    for d, r in pares.items():
        saida.append(f"{d} → {r}")
        if is_phone(d):
            numeros_detectados = True

    avisos = ""
    if numeros_detectados:
        avisos = "Foram detetados números. Será enviada uma mensagem para cada um."

    return {"resultado": "\n".join(saida), "avisos": avisos}
