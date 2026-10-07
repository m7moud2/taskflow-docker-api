# Kubernetes Learning Track

Ten hands-on tasks, from inspecting your first Deployment to using Helm and autoscaling.

For a guided exercise that bridges image builds in Docker with Kubernetes deployments, see [Docker to Kubernetes](../docker/kubernetes-bridge/README.md).

## Start here

You need Docker Desktop with Kubernetes enabled, `kubectl`, and an active `docker-desktop` context:

```bash
kubectl config current-context
kubectl cluster-info
kubectl get nodes
```

From the repository root, create the base app:

```bash
kubectl apply -f kubernetes/base/
kubectl rollout status deployment/web -n kubernetes-work
kubectl get all -n kubernetes-work
```

Open the site locally:

```bash
kubectl port-forward service/web 8080:80 -n kubernetes-work
```

Keep the command running and open <http://localhost:8080>. Stop forwarding with `Ctrl+C`.

## Tasks

Each task has its own folder. Read its `README.md` and apply only that task's `manifest.yaml` when provided.

### Foundations

1. [Inspect the app](tasks/01-inspect-the-app/) — Deployments, ReplicaSets, Pods, Services, labels, and Docker comparison.
2. [Change the web page](tasks/02-change-the-web-page/) — ConfigMaps and Service endpoints.
3. [Scale and recover](tasks/03-scale-and-recover/) — replicas and self-healing.
4. [Update and roll back](tasks/04-update-and-rollback/) — image updates and rollout history.

### Next steps

5. [Configuration and Secrets](tasks/05-configuration-and-secrets/) — environment configuration and safe Secret handling.
6. [Probes and resources](tasks/06-probes-and-resources/) — health checks, CPU, and memory.
7. [Persistent storage](tasks/07-persistent-storage/) — PVCs and Pod replacement.
8. [Ingress and networking](tasks/08-ingress-and-networking/) — HTTP routing with Traefik.
9. [Helm basics](tasks/09-helm-basics/) — chart install, upgrade, and rollback.
10. [Metrics and autoscaling](tasks/10-metrics-and-autoscaling/) — Metrics Server, HPA, and optional Prometheus and Grafana.

## Local cluster add-ons

Tasks 8 and 10 require Traefik and Metrics Server. Install Helm on macOS with Homebrew:

```bash
brew install helm
```

Install the local-only Traefik controller:

```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update traefik
helm upgrade --install traefik traefik/traefik --version 41.6.1 \
  --namespace ingress-system --create-namespace \
  --set service.spec.type=ClusterIP
```

Install Metrics Server and allow it to read the self-signed kubelet certificates used by Docker Desktop:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/components.yaml
kubectl patch deployment metrics-server -n kube-system --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl rollout status deployment/metrics-server -n kube-system
kubectl top nodes
```

`--kubelet-insecure-tls` is only for this local learning cluster. Do not use it in production.

## Clean up

Remove task resources and the base app:

```bash
kubectl delete -R -f kubernetes/tasks/ --ignore-not-found=true
kubectl delete secret app-credentials -n kubernetes-work --ignore-not-found
helm uninstall demo-web -n kubernetes-work --ignore-not-found
kubectl delete -f kubernetes/base/
```

The PVC task's cleanup deletes its test data. The optional monitoring stack, Traefik, Metrics Server, and Kubernetes cluster are separate; their cleanup instructions are in the relevant task or above.
