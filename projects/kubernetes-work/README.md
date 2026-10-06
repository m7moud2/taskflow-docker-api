# Kubernetes Work

Four beginner tasks for learning Kubernetes by running and changing a small Nginx app.

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

## The four tasks

Complete these in order. Each task builds on the previous one.

1. [Inspect the app](tasks/01-inspect-the-app.md) — connect Docker images and containers to Kubernetes Pods and Deployments.
2. [Change the web page](tasks/02-change-the-web-page.md) — update a ConfigMap and see how a Service reaches the app.
3. [Scale and recover](tasks/03-scale-and-recover.md) — add replicas and watch a Deployment replace a deleted Pod.
4. [Update and roll back](tasks/04-update-and-rollback.md) — change the Nginx image and undo a rollout.

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
```

This does not remove Docker images, other Docker containers, or the Kubernetes cluster.
