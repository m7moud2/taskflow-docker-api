# Task 3: Scale and recover

Learn how a Deployment maintains the requested number of app replicas.

## 1. Scale to three replicas

```bash
kubectl scale deployment/web --replicas=3 -n kubernetes-work
kubectl get deployment web -n kubernetes-work
kubectl get pods -n kubernetes-work -o wide
```

Wait until all three Pods show `Running` and `1/1` in the `READY` column.

## 2. Check the Service endpoints

```bash
kubectl get endpointslices -n kubernetes-work
```

The Service routes traffic to ready Pod addresses. The Service address stays stable as replicas change.

## 3. Delete one Pod

Copy one Pod name from `kubectl get pods`, then replace `<pod-name>` below:

```bash
kubectl delete pod <pod-name> -n kubernetes-work
kubectl get pods --watch -n kubernetes-work
```

The Deployment notices that fewer than three replicas are running. Its ReplicaSet creates a replacement Pod. Stop watching with `Ctrl+C`.

## Checkpoint

- Who creates the replacement Pod?
- Does deleting the Pod delete the Deployment?
- How many ready Pod addresses should the Service have after recovery?
