# Task 3: WordPress and MySQL

The WordPress stack shares monitoring ports with the Nginx stack. Stop Nginx first if it is running:

```bash
docker compose -f docker-compose.nginx.yml down
```

Start WordPress and MySQL from the repository root:

```bash
docker compose -f docker-compose.wordpress.yml config
docker compose -f docker-compose.wordpress.yml up -d
docker compose -f docker-compose.wordpress.yml ps
```

Wait for MySQL to become healthy, then open:

- WordPress: <http://localhost:8000>
- Grafana: <http://localhost:3001>
- Prometheus: <http://localhost:9090>
- Alertmanager: <http://localhost:9093>
- MySQL exporter: <http://localhost:9104/metrics>

Check the database and application logs:

```bash
docker compose -f docker-compose.wordpress.yml logs --tail=50 mysql_db wordpress
docker compose -f docker-compose.wordpress.yml exec mysql_db mysqladmin ping -h 127.0.0.1 -u root -proot_password
```

Stop the stack while retaining WordPress and database data:

```bash
docker compose -f docker-compose.wordpress.yml down
```

This is a local learning stack with example credentials. Do not expose it to the internet.
