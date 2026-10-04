# Kubernetes Work

A beginner lab for deploying and managing a simple Nginx site on Kubernetes.

## Requirements

- Docker Desktop with Kubernetes enabled, or Minikube
- `kubectl`
- An internet connection to download the Nginx image

Check that your cluster is running:

```bash
kubectl cluster-info
```

For Minikube, start the cluster first:

```bash
minikube start
```

## Run the app

From the repository root:

```bash
cd projects/kubernetes-work
kubectl apply -f k8s/
kubectl rollout status deployment/web -n kubernetes-work
kubectl port-forward service/web 8080:80 -n kubernetes-work
```

Open [http://localhost:8080](http://localhost:8080). Stop port forwarding with `Ctrl+C`.

## Practice

List the app resources:

```bash
kubectl get all -n kubernetes-work
```

Scale the app to three replicas:

```bash
kubectl scale deployment/web --replicas=3 -n kubernetes-work
kubectl get pods -n kubernetes-work
```

Delete one Pod and watch Kubernetes replace it:

```bash
kubectl get pods -n kubernetes-work
kubectl delete pod <pod-name> -n kubernetes-work
kubectl get pods --watch -n kubernetes-work
```

Update the Nginx image:

```bash
kubectl set image deployment/web nginx=nginx:1.28-alpine -n kubernetes-work
kubectl rollout status deployment/web -n kubernetes-work
```

Change the page in `k8s/10-configmap.yaml`, then apply the change:

```bash
kubectl apply -f k8s/10-configmap.yaml
kubectl rollout restart deployment/web -n kubernetes-work
```

## Files

- `00-namespace.yaml` creates the lab namespace
- `10-configmap.yaml` contains the web page
- `20-deployment.yaml` runs two Nginx Pods
- `30-service.yaml` provides an internal address for the Pods

## Clean up

```bash
kubectl delete -f k8s/
```
