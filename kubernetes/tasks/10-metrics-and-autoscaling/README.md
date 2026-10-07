# Task 10: Metrics and autoscaling

Learn to inspect resource usage, configure a HorizontalPodAutoscaler, and recognize when you need a full monitoring stack.

## 1. Check Metrics Server

Metrics Server is installed in the Docker Desktop cluster for this lab. Docker Desktop's local kubelet certificates are self-signed, so the local install uses `--kubelet-insecure-tls`. Do not use that setting in production:

```bash
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods -n kubernetes-work
```

Metrics Server supplies recent CPU and memory metrics for `kubectl top` and the HPA. It is not a long-term monitoring or alerting system.

## 2. Apply an HPA

The `web` Deployment has CPU requests, which the HPA needs to calculate CPU utilization:

```bash
kubectl apply -f projects/kubernetes-work/tasks/manifests/10-web-hpa.yaml
kubectl get hpa web -n kubernetes-work
kubectl describe hpa web -n kubernetes-work
```

The HPA keeps between two and four replicas and targets average CPU use of 60 percent of the requested CPU. It may take a minute for new metrics and scaling decisions.

If the `TARGETS` column shows `<unknown>`, check Metrics Server and its API:

```bash
kubectl get apiservice v1beta1.metrics.k8s.io
kubectl describe apiservice v1beta1.metrics.k8s.io
kubectl logs deployment/metrics-server -n kube-system
```

## 3. Optional: Prometheus and Grafana

This installs a larger monitoring stack and uses additional cluster resources. Skip it on a resource-limited machine.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update prometheus-community
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set prometheus.prometheusSpec.retention=1d
```

Check the rollout and forward the Grafana service to your computer:

```bash
kubectl get pods -n monitoring
kubectl port-forward service/monitoring-grafana 3002:80 -n monitoring
```

Open <http://localhost:3002>. Read the admin password from the `monitoring-grafana` Secret; do not add it to Git:

```bash
kubectl get secret monitoring-grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 -D; echo
```

Remove the optional monitoring stack when finished:

```bash
helm uninstall monitoring -n monitoring
kubectl delete namespace monitoring
```

## Clean up the HPA

```bash
kubectl delete -f projects/kubernetes-work/tasks/manifests/10-web-hpa.yaml
```

An HPA changes replica count based on metrics. Prometheus and Grafana provide dashboards, history, and alerting. They solve different problems.
