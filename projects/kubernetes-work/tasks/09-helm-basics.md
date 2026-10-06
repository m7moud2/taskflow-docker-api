# Task 9: Helm basics

Helm packages Kubernetes manifests into charts and tracks installed apps as releases.

Install Helm on macOS with Homebrew if it is not already installed:

```bash
brew install helm
helm version
```

## 1. Create a chart

From the repository root:

```bash
helm create kubernetes-work-chart
```

Open `kubernetes-work-chart/values.yaml`. Set `replicaCount` to `1`, `image.repository` to `nginx`, `image.tag` to `1.27-alpine`, and `service.type` to `ClusterIP`.

## 2. Preview and install it

```bash
helm lint ./kubernetes-work-chart
helm template demo-web ./kubernetes-work-chart -n kubernetes-work
helm upgrade --install demo-web ./kubernetes-work-chart -n kubernetes-work --create-namespace
kubectl rollout status deployment/demo-web-kubernetes-work-chart -n kubernetes-work
```

Helm renders the chart templates using `values.yaml`, then records the installed resources as the `demo-web` release.

## 3. Upgrade and roll back

Change `replicaCount` to `2`, then run:

```bash
helm upgrade demo-web ./kubernetes-work-chart -n kubernetes-work
helm history demo-web -n kubernetes-work
helm rollback demo-web 1 -n kubernetes-work
helm status demo-web -n kubernetes-work
```

The rollback returns the release to revision 1.

## Clean up

```bash
helm uninstall demo-web -n kubernetes-work
```

The generated chart directory is a local exercise. Do not commit it unless you want to keep your chart project.
