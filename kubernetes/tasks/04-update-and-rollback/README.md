# Task 4: Update and roll back

Learn how a Deployment replaces Pods during an image update and how to undo a rollout.

## 1. Record the current image

```bash
kubectl get deployment web -n kubernetes-work -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
kubectl rollout history deployment/web -n kubernetes-work
```

The image tag identifies the Nginx version Kubernetes should run.

## 2. Update the image

```bash
kubectl set image deployment/web nginx=nginx:1.28-alpine -n kubernetes-work
kubectl rollout status deployment/web -n kubernetes-work
kubectl get pods -n kubernetes-work
```

Kubernetes creates Pods with the new image and replaces the old Pods as the new ones become ready. The Service continues routing traffic to ready Pods.

## 3. Roll back

```bash
kubectl rollout undo deployment/web -n kubernetes-work
kubectl rollout status deployment/web -n kubernetes-work
kubectl get deployment web -n kubernetes-work -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
```

The Deployment returns to the previous Pod template and image.

Because `kubectl set image` changes the live Deployment rather than the YAML file, a later `kubectl apply -f kubernetes/base/20-deployment.yaml` will set the image back to the version declared in that file.

## Checkpoint

- Which image tag is running after the rollback?
- Which resource records and performs the rollout?
- Why can the Service keep its address during an update?
