# 🚀 DevOps Observability & Monitoring Platform

A production-grade DevOps monitoring and alerting stack powered by **Prometheus**, **Grafana**, and **Alertmanager**.

This repository provides two independent, modular environments:
1. **🌐 Nginx Web Server Monitoring Stack**: Standalone Nginx web server with `/stub_status` metrics and Nginx Prometheus Exporter.
2. **📝 WordPress & MySQL Monitoring Stack**: WordPress CMS with MySQL 8.0 database and MySQL Prometheus Exporter.

---

## 🗂️ Repository Architecture

```
docker-work/
├── docker-compose.yml              # Default entrypoint (Nginx Monitoring Stack)
├── docker-compose.nginx.yml        # Nginx Standalone Monitoring Stack
├── docker-compose.wordpress.yml    # WordPress & MySQL 8.0 Monitoring Stack
├── nginx/
│   └── nginx.conf                  # Nginx configuration with /stub_status enabled
├── docker/
│   ├── prometheus/
│   │   ├── prometheus-nginx.yml    # Prometheus scrape config for Nginx
│   │   ├── prometheus-wordpress.yml# Prometheus scrape config for WordPress & MySQL
│   │   ├── alert.rules.nginx.yml   # Prometheus alert rules for Nginx
│   │   └── alert.rules.wordpress.yml# Prometheus alert rules for MySQL
│   ├── alertmanager/
│   │   └── alertmanager.yml        # Alertmanager routing configuration
│   └── grafana/
│       └── provisioning/
│           ├── datasources/
│           │   └── prometheus.yml  # Automated Grafana Prometheus datasource
│           └── dashboards/
│               ├── dashboards.yml  # Automated dashboard provider
│               ├── nginx-dashboard.json     # Pre-configured Nginx metrics dashboard
│               └── wordpress-dashboard.json # Pre-configured MySQL/WordPress dashboard
├── scripts/
│   ├── health-check.sh             # Operational monitoring health check script
│   └── chaos-test.sh               # Failover and Alertmanager testing script
└── .github/
    └── workflows/
        └── ci.yml                  # GitHub Actions CI pipeline
```

---

## ⚡ Quick Start Guide

### Option 1: Launch Nginx Monitoring Stack
```bash
docker compose -f docker-compose.nginx.yml up -d
```
*(Or run `docker compose up -d` for the default stack)*

#### Endpoints & Services:
* 🌐 **Nginx Web Server:** [http://localhost](http://localhost)
* 📈 **Grafana Dashboard:** [http://localhost:3001](http://localhost:3001)
* 🚨 **Alertmanager UI:** [http://localhost:9093](http://localhost:9093)
* 📊 **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
* ⚙️ **Nginx Exporter Metrics:** [http://localhost:9113/metrics](http://localhost:9113/metrics)

---

### Option 2: Launch WordPress & MySQL Monitoring Stack
```bash
docker compose -f docker-compose.wordpress.yml up -d
```

#### Endpoints & Services:
* 📝 **WordPress Site:** [http://localhost:8000](http://localhost:8000)
* 📈 **Grafana Dashboard:** [http://localhost:3001](http://localhost:3001)
* 🚨 **Alertmanager UI:** [http://localhost:9093](http://localhost:9093)
* 📊 **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
* ⚙️ **MySQL Exporter Metrics:** [http://localhost:9104/metrics](http://localhost:9104/metrics)

---

## 🧪 Operational Scripts & Testing

### Infrastructure Health Check
Run the automated health checker to verify endpoint connectivity:
```bash
./scripts/health-check.sh
```

### Chaos Engineering & Alert Testing
Test Alertmanager alert firing and failover routing:
```bash
# Test Nginx Failover
./scripts/chaos-test.sh nginx

# Test WordPress / MySQL Failover
./scripts/chaos-test.sh wordpress
```

---

## 🛑 Tear Down Environment

To stop and remove containers and volumes for Nginx:
```bash
docker compose -f docker-compose.nginx.yml down -v
```

To stop and remove containers and volumes for WordPress:
```bash
docker compose -f docker-compose.wordpress.yml down -v
```
