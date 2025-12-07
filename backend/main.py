from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

class Casa(BaseModel):
    membros: List[str]

class CasasRequest(BaseModel):
    casas: List[Casa]

@app.post("/api/sortear")
def sortear(casas_request: CasasRequest):
    # Constrói lista de todos os membros e mapeia as casas
    todas_pessoas = []
    casa_map = {}
    for i, casa in enumerate(casas_request.casas):
        for pessoa in casa.membros:
            todas_pessoas.append(pessoa)
            casa_map[pessoa] = i

    # Tenta sortear evitando membros da mesma casa
    sorteio = {}
    tentativas = 0
    max_tentativas = 1000
    sucesso = False

    while tentativas < max_tentativas and not sucesso:
        tentativas += 1
        lista_aleatoria = todas_pessoas.copy()
        random.shuffle(lista_aleatoria)
        sucesso = True
        sorteio = {}
        for idx, pessoa in enumerate(todas_pessoas):
            presente = lista_aleatoria[idx]
            if casa_map[pessoa] == casa_map[presente]:
                sucesso = False
                break
            sorteio[pessoa] = presente

    if not sucesso:
        return {"erro": "Não foi possível sortear sem conflitos. Tenta novamente."}

    # Detecta números/emails
    mensagens = {}
    for pessoa, presente in sorteio.items():
        if "@" in presente:
            mensagens[presente] = f"Enviar email a {presente} de {pessoa}"
        elif any(c.isdigit() for c in presente):
            mensagens[presente] = f"Enviar mensagem a {presente} de {pessoa}"

    return {"sorteio": sorteio, "mensagens": mensagens}
