from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

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
