# Task 5: Configuration and Secrets

Learn how to pass settings to a container without baking them into its image.

## 1. Create a throwaway Secret

Use only a fake learning value. Never put a real password or token in shell history or Git:

```bash
kubectl create secret generic app-credentials \
  --from-literal=API_TOKEN=learning-only \
  --namespace=kubernetes-work \
  --dry-run=client -o yaml | kubectl apply -f -
```

The Secret manifest is generated locally and is not stored in this repository.

## 2. Start the demo

```bash
kubectl apply -f projects/kubernetes-work/tasks/manifests/05-config-demo.yaml
kubectl rollout status deployment/config-demo -n kubernetes-work
```

The Deployment imports `APP_MODE` from a ConfigMap and `API_TOKEN` from a Secret.

## 3. Check the values without printing the token

```bash
kubectl exec deployment/config-demo -n kubernetes-work -- sh -c 'echo "APP_MODE=$APP_MODE"; test -n "$API_TOKEN" && echo "API_TOKEN is set"'
```

ConfigMaps are for non-sensitive configuration. Kubernetes Secret values are base64-encoded in API objects; base64 is not encryption. Do not commit real Secret data to Git.

## Clean up

```bash
kubectl delete -f projects/kubernetes-work/tasks/manifests/05-config-demo.yaml
kubectl delete secret app-credentials -n kubernetes-work
```
