# Docker Learning Track

Start with the Compose basics, then run the Nginx and WordPress stacks and use the health-check scripts.

Each task has its own folder:

1. [Docker Compose basics](tasks/01-compose-basics/) — inspect and start the default Nginx stack.
2. [Nginx monitoring](tasks/02-nginx-monitoring/) — check Nginx, Prometheus, Grafana, and exporter metrics.
3. [WordPress and MySQL](tasks/03-wordpress-and-mysql/) — start a separate WordPress stack with persistent volumes.
4. [Health checks and failover](tasks/04-health-and-failover/) — use the scripts to check and test the stacks.
5. [Docker to Kubernetes](kubernetes-bridge/) — build a small image, run it as a container, and deploy it to Kubernetes.

The Docker Compose files remain at the repository root for compatibility with existing commands. Run commands from the repository root unless a task says otherwise.

## Important

- The Nginx and WordPress stacks both use ports `3001`, `9090`, and `9093`. Run one at a time.
- Use `docker compose down` to stop a stack while keeping its volumes.
- Avoid `docker compose down -v` unless you intend to permanently delete that stack's data.
- The WordPress stack uses learning-only credentials in its Compose file. Do not expose it to the internet or reuse those credentials elsewhere.
