from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Casas(BaseModel):
    casas: List[List[str]]

@app.post("/sortear")
def sortear(casas: Casas):
    import random

    # Cria pares, evitando membros da mesma casa
    todos = [p for casa in casas.casas for p in casa]
    result = {}
    tentativas = 0
    max_tentativas = 1000
    while tentativas < max_tentativas:
        tentativas += 1
        shuffled = todos[:]
        random.shuffle(shuffled)
        result.clear()
        valido = True
        for i, casa in enumerate(casas.casas):
            for pessoa in casa:
                if shuffled[i] in casa:
                    valido = False
                    break
                result[pessoa] = shuffled[i]
            if not valido:
                break
        if valido:
            break
    return result
