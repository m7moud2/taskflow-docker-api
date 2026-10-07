# Docker to Kubernetes

Build one small web app as a Docker image, run it as a Docker container, then run that same image as Kubernetes Pods.

This project uses its own Docker Compose file and Kubernetes namespace. It does not change the existing TaskFlow stacks or the `kubernetes-work` app.

## Requirements

- Docker Desktop
- Docker Desktop Kubernetes enabled
- `kubectl`
- Python is not required on the host

## 1. Build the image

Run from this directory:

```bash
docker build --build-arg APP_VERSION=1.0.0 -t docker-kubernetes-bridge:1.0.0 .
```

The Dockerfile packages the app and its version label into an image.

## 2. Run it as a Docker container

```bash
docker compose up -d
docker compose ps
curl http://localhost:8088/
curl --fail http://localhost:8088/healthz
docker compose logs
```

The app reports its version and the runtime handling the request. Compose maps host port `8088` to container port `8080`, avoiding the ports used by the existing projects.

Stop the container before continuing:

```bash
docker compose down
```

## 3. Push the image to a registry

Docker Desktop Engine and its Kubernetes nodes use separate image stores. A locally built image is not automatically available to Kubernetes, so publish the image to a registry that the cluster can access.

This example uses Docker Hub. Create a repository, then sign in:

```bash
docker login
```

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub account name:

```bash
docker tag docker-kubernetes-bridge:1.0.0 YOUR_DOCKERHUB_USERNAME/docker-kubernetes-bridge:1.0.0
docker push YOUR_DOCKERHUB_USERNAME/docker-kubernetes-bridge:1.0.0
```

Use a public repository for the simplest local learning setup. For a private repository, configure an `imagePullSecret` in Kubernetes; do not commit registry credentials.

## 4. Run the image on Kubernetes

Check that the active context is Docker Desktop:

```bash
kubectl config current-context
kubectl get nodes
```

Apply the Deployment and Service:

Edit `k8s/10-deployment.yaml` and replace `YOUR_DOCKERHUB_USERNAME` in the image name with your Docker Hub account name.

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/bridge-app -n docker-kubernetes-bridge
kubectl get pods,service -n docker-kubernetes-bridge
```

The Deployment pulls the same versioned image from Docker Hub. Docker and Kubernetes both run the artifact built from this project's Dockerfile.

Forward the Service to a different host port:

```bash
kubectl port-forward service/bridge-app 8089:8080 -n docker-kubernetes-bridge
```

In another terminal:

```bash
curl http://localhost:8089/
curl --fail http://localhost:8089/healthz
kubectl top pods -n docker-kubernetes-bridge
```

Compare the response with the Docker container response. The app image is unchanged; Kubernetes runs it in Pods and manages two replicas behind a Service.

## 5. Update the app image

Build and publish a second image version:

```bash
docker build --build-arg APP_VERSION=1.1.0 -t docker-kubernetes-bridge:1.1.0 .
docker tag docker-kubernetes-bridge:1.1.0 YOUR_DOCKERHUB_USERNAME/docker-kubernetes-bridge:1.1.0
docker push YOUR_DOCKERHUB_USERNAME/docker-kubernetes-bridge:1.1.0
```

Update the Deployment:

```bash
kubectl set image deployment/bridge-app app=YOUR_DOCKERHUB_USERNAME/docker-kubernetes-bridge:1.1.0 -n docker-kubernetes-bridge
kubectl rollout status deployment/bridge-app -n docker-kubernetes-bridge
```

Request the page again at <http://localhost:8089>. The response should report version `1.1.0`.

Roll back to the first image:

```bash
kubectl rollout undo deployment/bridge-app -n docker-kubernetes-bridge
kubectl rollout status deployment/bridge-app -n docker-kubernetes-bridge
```

## 6. Clean up

Stop port forwarding with `Ctrl+C`, then remove only this project's Kubernetes resources:

```bash
kubectl delete -f k8s/
```

Remove the Docker Compose container if it is still running:

```bash
docker compose down
```

The built images remain available locally. Remove them only if you no longer need them:

```bash
docker image rm docker-kubernetes-bridge:1.0.0 docker-kubernetes-bridge:1.1.0
```
