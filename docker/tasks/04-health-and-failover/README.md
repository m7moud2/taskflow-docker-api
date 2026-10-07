# Task 4: Health checks and failover

Start one monitoring stack before running the health check.

For Nginx:

```bash
docker compose -f docker-compose.nginx.yml up -d
./scripts/health-check.sh
```

For WordPress, stop Nginx first, then start WordPress:

```bash
docker compose -f docker-compose.nginx.yml down
docker compose -f docker-compose.wordpress.yml up -d
./scripts/health-check.sh
```

The script checks Prometheus, Grafana, Alertmanager, and whichever exporter is active.

To see an Nginx recovery test, run:

```bash
./scripts/chaos-test.sh nginx
```

The script stops the Nginx container briefly, then starts it again. Do not run it while using the Nginx service for anything important.

To test WordPress database recovery, start the WordPress stack first and run:

```bash
./scripts/chaos-test.sh wordpress
```

This briefly stops and starts the MySQL container. Use only the local learning stack; the test interrupts database access.

Check recovery:

```bash
docker compose -f docker-compose.wordpress.yml ps
docker compose -f docker-compose.wordpress.yml logs --tail=30 mysql_db
```
