# Task 7: Persistent storage

Learn how a PersistentVolumeClaim keeps a file when a Pod is deleted and recreated.

Docker Desktop provides a local `standard` StorageClass for this exercise. Its data is for local learning, not a backup.

## 1. Create the claim and Pod

```bash
kubectl apply -f kubernetes/tasks/07-persistent-storage/manifest.yaml
kubectl get pvc,pod -n kubernetes-work
kubectl wait --for=jsonpath='{.status.phase}'=Bound pvc/learning-data -n kubernetes-work --timeout=120s
kubectl wait --for=condition=Ready pod/storage-demo -n kubernetes-work --timeout=120s
```

The PVC requests 256 MiB from the cluster's `standard` StorageClass. Kubernetes binds it to a PersistentVolume and mounts it at `/data`.

## 2. Write a file

```bash
kubectl exec storage-demo -n kubernetes-work -- sh -c 'echo "saved on the volume" > /data/hello.txt'
kubectl exec storage-demo -n kubernetes-work -- cat /data/hello.txt
```

## 3. Replace the Pod

```bash
kubectl delete pod storage-demo -n kubernetes-work
kubectl apply -f kubernetes/tasks/07-persistent-storage/manifest.yaml
kubectl wait --for=condition=Ready pod/storage-demo -n kubernetes-work --timeout=120s
kubectl exec storage-demo -n kubernetes-work -- cat /data/hello.txt
```

The file remains because the new Pod mounts the same PVC.

## Clean up

Deleting this PVC also deletes its local volume and the test file:

```bash
kubectl delete -f kubernetes/tasks/07-persistent-storage/manifest.yaml
```

The local volume can be lost if the Docker Desktop cluster is reset or removed. Keep a separate backup for important data.
