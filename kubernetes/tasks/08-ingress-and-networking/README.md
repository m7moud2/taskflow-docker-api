# Task 8: Ingress and networking

Learn how an Ingress controller routes HTTP requests to a Kubernetes Service.

The Ingress controller is installed in the Docker Desktop cluster as the `traefik` Helm release in the `ingress-system` namespace.

## 1. Create the route

```bash
kubectl apply -f kubernetes/tasks/08-ingress-and-networking/manifest.yaml
kubectl get ingress -n kubernetes-work
kubectl describe ingress web -n kubernetes-work
```

The rule sends requests for `kubernetes-work.local` to the existing `web` Service. Ingress configures routing; the Traefik controller implements it.

## 2. Forward traffic to Traefik

In a separate terminal:

```bash
kubectl port-forward service/traefik 8081:80 -n ingress-system
```

Keep port forwarding active and test the hostname:

```bash
curl -H 'Host: kubernetes-work.local' http://127.0.0.1:8081/
```

This uses a local port-forward, so it does not expose the app to the internet. The existing TaskFlow Nginx service already uses host port 80; this lab uses 8081 instead.

## Clean up

```bash
kubectl delete -f kubernetes/tasks/08-ingress-and-networking/manifest.yaml
```
