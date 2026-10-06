# Task 2: Change the web page

Learn how a ConfigMap provides app configuration and how a Service gives the app a stable address.

## 1. Open the page

If port forwarding is not already running, start it:

```bash
kubectl port-forward service/web 8080:80 -n kubernetes-work
```

Keep the command running and open <http://localhost:8080> in your browser.

## 2. Edit the ConfigMap

Open `projects/kubernetes-work/k8s/10-configmap.yaml` and change the heading or paragraph inside `index.html`.

Apply the updated file:

```bash
kubectl apply -f projects/kubernetes-work/k8s/10-configmap.yaml
kubectl rollout restart deployment/web -n kubernetes-work
kubectl rollout status deployment/web -n kubernetes-work
```

Refresh the browser. The page content comes from the `web-content` ConfigMap mounted into each Pod.

## 3. Inspect the connection

```bash
kubectl get configmap web-content -n kubernetes-work -o yaml
kubectl get service web -n kubernetes-work
kubectl get endpointslices -n kubernetes-work
```

The Service selects the app's ready Pods. Port forwarding connects your computer to that Service; the app is not public on the internet.

## Checkpoint

- Which file contains the page?
- Which Kubernetes resource sends traffic to the Pods?
- What does port `8080:80` mean in the port-forward command?
