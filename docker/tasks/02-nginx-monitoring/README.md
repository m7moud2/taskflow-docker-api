# Task 2: Nginx monitoring

Start the Nginx stack from the repository root:

```bash
docker compose -f docker-compose.nginx.yml up -d
docker compose -f docker-compose.nginx.yml ps
```

Open the services:

- Nginx: <http://localhost>
- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3001>
- Alertmanager: <http://localhost:9093>
- Exporter metrics: <http://localhost:9113/metrics>

Check service health from the terminal:

```bash
curl --fail http://localhost/stub_status
curl --fail http://localhost:9090/-/healthy
curl --fail http://localhost:9113/metrics
```

Prometheus collects metrics from the exporter. Grafana reads Prometheus data to display dashboards.

The WordPress stack uses some of the same host ports. Stop this stack before starting WordPress:

```bash
docker compose -f docker-compose.nginx.yml down
```
