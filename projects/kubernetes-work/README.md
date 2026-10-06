# Kubernetes Work

Ten beginner and early-intermediate tasks for learning Kubernetes by running and changing a small Nginx app.

The app uses the same image-and-container ideas as Docker, with Kubernetes resources to manage it:

```text
Namespace
├── ConfigMap provides the web page
├── Deployment
│   └── ReplicaSet
│       └── Pods run Nginx
└── Service routes requests to ready Pods
```

## Before you start

You need Docker Desktop with Kubernetes enabled and `kubectl` installed.

Check the active cluster:

```bash
kubectl config current-context
kubectl cluster-info
kubectl get nodes
```

For Docker Desktop, the context should normally be `docker-desktop`. If no context is selected:

```bash
kubectl config get-contexts
kubectl config use-context docker-desktop
```

`kubectl` talks to the Kubernetes API. If it tries `http://localhost:8080` and connection is refused, the cluster is not running or the context is not configured. This is different from the app's `localhost:8080` address used later by `port-forward`.

## Cluster add-ons

The Docker Desktop cluster used for this lab has Traefik as an Ingress controller and Metrics Server for `kubectl top` and HPA exercises.

Install Helm on macOS with Homebrew:

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

Install Metrics Server and allow it to read the self-signed kubelet certificates used by this local Docker Desktop cluster:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/components.yaml
kubectl patch deployment metrics-server -n kube-system --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl rollout status deployment/metrics-server -n kube-system
kubectl top nodes
```

`--kubelet-insecure-tls` disables kubelet certificate verification. It is only for this local learning cluster; do not copy it into a production cluster.

## Start the app

Run these commands from the repository root:

```bash
kubectl apply -f projects/kubernetes-work/k8s/
kubectl rollout status deployment/web -n kubernetes-work
kubectl get all -n kubernetes-work
```

Open a second terminal and forward a local port to the Kubernetes Service:

```bash
kubectl port-forward service/web 8080:80 -n kubernetes-work
```

Keep that command running and open <http://localhost:8080>. Stop port forwarding with `Ctrl+C`.

## The tasks

Complete these in order. The first four cover the basics. Tasks five to ten build on them.

1. [Inspect the app](tasks/01-inspect-the-app.md) — connect Docker images and containers to Kubernetes Pods and Deployments.
2. [Change the web page](tasks/02-change-the-web-page.md) — update a ConfigMap and see how a Service reaches the app.
3. [Scale and recover](tasks/03-scale-and-recover.md) — add replicas and watch a Deployment replace a deleted Pod.
4. [Update and roll back](tasks/04-update-and-rollback.md) — change the Nginx image and undo a rollout.
5. [Configuration and Secrets](tasks/05-configuration-and-secrets.md) — pass non-sensitive settings and a throwaway Secret to a container.
6. [Probes and resources](tasks/06-probes-and-resources.md) — configure health checks and CPU and memory requests and limits.
7. [Persistent storage](tasks/07-persistent-storage.md) — use a PVC to keep a file when its Pod is replaced.
8. [Ingress and networking](tasks/08-ingress-and-networking.md) — route local HTTP traffic through Traefik to the app Service.
9. [Helm basics](tasks/09-helm-basics.md) — create a chart, install it, upgrade it, and roll back a release.
10. [Metrics and autoscaling](tasks/10-metrics-and-autoscaling.md) — inspect resource metrics, create an HPA, and optionally install Prometheus and Grafana.

Tasks 8 and 10 use the local Ingress controller and Metrics Server installed on the Docker Desktop cluster. Task 10's Prometheus and Grafana section is optional and installs a larger monitoring stack.

## What each resource does

- **Namespace** groups the resources for this lab.
- **ConfigMap** stores the HTML page served by Nginx.
- **Deployment** describes the desired app state, including two replicas.
- **ReplicaSet** keeps the requested number of Pods running for the Deployment.
- **Pod** is the smallest Kubernetes workload unit. It runs the Nginx container.
- **Service** gives the Pods a stable address and sends traffic to ready replicas.
- **`kubectl port-forward`** temporarily connects a port on your computer to the Service. It does not expose the app to the internet.

Docker runs containers directly. Kubernetes runs and monitors Pods on cluster nodes. A Pod runs one app container in this lab. Docker Desktop uses its own cluster runtime, so `docker ps` may show the Kubernetes node containers but not the app Pods. Use `kubectl get pods` to see those.

## Useful commands

```bash
kubectl get all -n kubernetes-work
kubectl get pods -n kubernetes-work -o wide
kubectl describe deployment web -n kubernetes-work
kubectl describe pod <pod-name> -n kubernetes-work
kubectl logs deployment/web -n kubernetes-work
kubectl get events -n kubernetes-work --sort-by=.metadata.creationTimestamp
```

Replace `<pod-name>` with a real Pod name from `kubectl get pods`.

## Clean up

Delete only this lab's resources:

```bash
kubectl delete -f projects/kubernetes-work/k8s/
kubectl delete -f projects/kubernetes-work/tasks/manifests/
kubectl delete secret app-credentials -n kubernetes-work --ignore-not-found
helm uninstall demo-web -n kubernetes-work --ignore-not-found
```

If you installed the optional monitoring stack, remove it with `helm uninstall monitoring -n monitoring` and `kubectl delete namespace monitoring`. Remove the local Ingress controller and Metrics Server only if you no longer need them:

```bash
helm uninstall traefik -n ingress-system
kubectl delete namespace ingress-system
kubectl delete -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/components.yaml
```

This does not remove Docker images, other Docker containers, or the Kubernetes cluster. The PVC task's data is removed when its PVC is deleted.
