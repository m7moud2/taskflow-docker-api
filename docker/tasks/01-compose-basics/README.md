# Task 1: Docker Compose basics

Use Docker Compose to inspect and run the Nginx monitoring stack.

Run these commands from the repository root:

```bash
docker compose -f docker-compose.nginx.yml config
docker compose -f docker-compose.nginx.yml ps
docker compose -f docker-compose.nginx.yml up -d
docker compose -f docker-compose.nginx.yml ps
```

Compose reads the services from `docker-compose.nginx.yml`, creates their network and volumes, then starts the containers in the background.

Inspect the containers and images:

```bash
docker ps
docker image ls
docker compose -f docker-compose.nginx.yml logs --tail=30
```

The Nginx stack uses Nginx, an Nginx Prometheus exporter, Prometheus, Grafana, and Alertmanager.

Stop the stack without deleting its data:

```bash
docker compose -f docker-compose.nginx.yml down
```
