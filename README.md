# taskflow-monitoring

DevOps observability environment with Prometheus, Grafana, and Alertmanager.

Supports two isolated Docker Compose stacks:
- Nginx Web Server with `stub_status` metrics exporter
- WordPress with MySQL 8.0 database exporter

## Stack Architecture

```
.
├── docker-compose.yml              # Default entrypoint (Nginx stack)
├── docker-compose.nginx.yml        # Nginx monitoring stack
├── docker-compose.wordpress.yml    # WordPress & MySQL monitoring stack
├── nginx/
│   └── nginx.conf                  # Nginx stub_status config
├── docker/
│   ├── prometheus/
│   │   ├── prometheus-nginx.yml
│   │   ├── prometheus-wordpress.yml
│   │   ├── alert.rules.nginx.yml
│   │   └── alert.rules.wordpress.yml
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   └── grafana/
│       └── provisioning/
│           ├── datasources/
│           │   └── prometheus.yml
│           └── dashboards/
│               ├── dashboards.yml
│               ├── nginx-dashboard.json
│               └── wordpress-dashboard.json
└── scripts/
    ├── health-check.sh             # Health check script
    └── chaos-test.sh               # Failover testing script
```

## Quick Start

### 1. Nginx Monitoring Stack

Run Nginx web server with Prometheus, Grafana, and Alertmanager:

```bash
docker compose -f docker-compose.nginx.yml up -d
```

Endpoints:
- Nginx: http://localhost
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093
- Nginx Exporter: http://localhost:9113/metrics

### 2. WordPress & MySQL Monitoring Stack

Run WordPress, MySQL 8.0, and `mysqld-exporter`:

```bash
docker compose -f docker-compose.wordpress.yml up -d
```

Endpoints:
- WordPress: http://localhost:8000
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093
- MySQL Exporter: http://localhost:9104/metrics

## Operational Scripts

Run health check across endpoints:
```bash
./scripts/health-check.sh
```

Simulate service failover and test Alertmanager alerts:
```bash
./scripts/chaos-test.sh nginx
./scripts/chaos-test.sh wordpress
```

## Cleanup

Stop containers and remove volumes:

```bash
docker compose -f docker-compose.nginx.yml down -v
docker compose -f docker-compose.wordpress.yml down -v
```
