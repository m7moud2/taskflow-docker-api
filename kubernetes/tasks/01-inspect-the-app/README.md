# Task 1: Inspect the app

Learn how the Docker image-and-container model maps to Kubernetes resources.

## 1. Check the namespace

```bash
kubectl get namespace kubernetes-work
```

The namespace keeps this lab's resources separate from system resources and other apps.

## 2. Find the Deployment and Pods

```bash
kubectl get deployment,replicaset,pods -n kubernetes-work
kubectl get pods -n kubernetes-work -o wide
kubectl describe deployment web -n kubernetes-work
```

The Deployment asks Kubernetes to keep two replicas running. Its ReplicaSet creates the Pods, and each Pod runs an Nginx container from the `nginx:1.27-alpine` image.

## 3. Find the Service

```bash
kubectl get service web -n kubernetes-work
kubectl describe service web -n kubernetes-work
```

The Service has a stable cluster address. It selects Pods with the label `app=kubernetes-work-web`; Pod IPs can change when Pods are replaced.

## 4. Compare with Docker

```bash
docker image ls nginx
docker ps
kubectl get pods -n kubernetes-work
```

`docker ps` shows containers managed directly by Docker. Kubernetes Pods run inside the Docker Desktop cluster and are listed with `kubectl`, not as regular app containers in `docker ps`.

## Checkpoint

- How many replicas does the Deployment request?
- Which image does each Pod use?
- What stays stable when a Pod is replaced?
