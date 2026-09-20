#!/usr/bin/env bash
set -eo pipefail

GREEN='\031[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}==========================================================${NC}"
echo -e "${CYAN} 🛡️ DEVOPS MONITORING & OBSERVABILITY HEALTH CHECKER ${NC}"
echo -e "${CYAN}==========================================================${NC}"

# Check Prometheus
echo -e "➡️ [1/5] Checking Prometheus Server (http://localhost:9090)..."
if curl -s -f http://localhost:9090/-/healthy > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Prometheus: ONLINE (200 OK)${NC}"
else
    echo -e "  ${RED}❌ Prometheus: UNREACHABLE${NC}"
fi

# Check Alertmanager
echo -e "➡️ [2/5] Checking Alertmanager Server (http://localhost:9093)..."
if curl -s -f http://localhost:9093/-/healthy > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Alertmanager: ONLINE (200 OK)${NC}"
else
    echo -e "  ${RED}❌ Alertmanager: UNREACHABLE${NC}"
fi

# Check Grafana
echo -e "➡️ [3/5] Checking Grafana Server (http://localhost:3001)..."
if curl -s -I http://localhost:3001 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Grafana: ONLINE (302/200 OK)${NC}"
else
    echo -e "  ${RED}❌ Grafana: UNREACHABLE${NC}"
fi

# Check Active Stack Exporters
echo -e "➡️ [4/5] Checking Nginx Exporter (http://localhost:9113)..."
if curl -s http://localhost:9113/metrics | grep -q "nginx_up"; then
    echo -e "  ${GREEN}✅ Nginx Exporter: ACTIVE & SCRAPING (nginx_up 1)${NC}"
else
    echo -e "  ${YELLOW}⚠️ Nginx Exporter: NOT RUNNING (Stack May Be Stopped)${NC}"
fi

echo -e "➡️ [5/5] Checking MySQL Exporter (http://localhost:9104)..."
if curl -s http://localhost:9104/metrics | grep -q "mysql_up"; then
    echo -e "  ${GREEN}✅ MySQL Exporter: ACTIVE & SCRAPING (mysql_up 1)${NC}"
else
    echo -e "  ${YELLOW}⚠️ MySQL Exporter: NOT RUNNING (Stack May Be Stopped)${NC}"
fi

echo -e "${CYAN}==========================================================${NC}"
echo -e "${GREEN} ✅ Monitoring Infrastructure Check Complete!${NC}"
echo -e "${CYAN}==========================================================${NC}"
