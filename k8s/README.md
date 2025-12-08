# Passos para testar no k3s

## Certifica-te de que as imagens Docker locais estão no k3s:

### exemplo: importar imagens locais para containerd do k3s
```bash
sudo ctr -n k8s.io images import backend/amigo-secreto-backend.tar
sudo ctr -n k8s.io images import frontend/amigo-secreto-frontend.tar
```

### Cria a aplicação no Argo CD:

```bash
kubectl apply -f k8s/argocd-application.yaml
```

No Argo CD UI (normalmente https://<ip-do-cluster>:8080), vais ver a aplicação amigo-secreto sincronizada.

Qualquer alteração nos manifests dentro de k8s/ será automaticamente aplicada pelo Argo CD se syncPolicy.automated estiver ativo.