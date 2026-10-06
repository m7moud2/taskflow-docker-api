# Task 6: Probes and resources

Learn how Kubernetes checks whether an app has started, is ready for traffic, and needs restarting.

## 1. Start the example

```bash
kubectl apply -f projects/kubernetes-work/tasks/manifests/06-web-health.yaml
kubectl rollout status deployment/web-health -n kubernetes-work
kubectl get pod -l app=web-health -n kubernetes-work
```

## 2. Inspect the probes and resource settings

```bash
kubectl describe deployment web-health -n kubernetes-work
kubectl get deployment web-health -n kubernetes-work -o yaml
```

- `startupProbe` gives the app time to start before the other probes run.
- `readinessProbe` controls whether the Pod receives Service traffic.
- `livenessProbe` restarts a container that repeatedly fails its health check.
- `requests` reserve CPU and memory for scheduling.
- `limits` cap container CPU and memory use.

## 3. Compare usage with requests

After completing Task 10 and confirming Metrics Server is ready:

```bash
kubectl top pod -l app=web-health -n kubernetes-work
```

## Clean up

```bash
kubectl delete -f projects/kubernetes-work/tasks/manifests/06-web-health.yaml
```
