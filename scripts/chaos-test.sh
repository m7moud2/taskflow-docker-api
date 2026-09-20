#!/usr/bin/env bash
set -eo pipefail

CYAN='\033[0;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}==========================================================${NC}"
echo -e "${CYAN} 🧪 DEVOPS CHAOS ENGINEERING & ALERT TESTING SCRIPT ${NC}"
echo -e "${CYAN}==========================================================${NC}"

TARGET_STACK="${1:-nginx}"

if [ "$TARGET_STACK" == "nginx" ]; then
    echo -e "${YELLOW}➡️ [1/3] Simulating Nginx Web Server Failover (docker stop)...${NC}"
    docker stop taskflow_nginx_server || true
    echo -e "${RED}  🚨 Nginx Server Stopped! Prometheus will detect downtime in 15 seconds.${NC}"
    echo -e "${CYAN}  👉 Check Alertmanager UI at: http://localhost:9093${NC}"
    sleep 5
    echo -e "${GREEN}➡️ [2/3] Restoring Nginx Web Server (docker start)...${NC}"
    docker start taskflow_nginx_server || true
    echo -e "${GREEN}  🟢 Nginx Restored to HEALTHY!${NC}"
elif [ "$TARGET_STACK" == "wordpress" ]; then
    echo -e "${YELLOW}➡️ [1/3] Simulating MySQL Database Failover (docker stop)...${NC}"
    docker stop taskflow_mysql_db || true
    echo -e "${RED}  🚨 MySQL DB Stopped! Prometheus will detect downtime in 15 seconds.${NC}"
    echo -e "${CYAN}  👉 Check Alertmanager UI at: http://localhost:9093${NC}"
    sleep 5
    echo -e "${GREEN}➡️ [2/3] Restoring MySQL Database (docker start)...${NC}"
    docker start taskflow_mysql_db || true
    echo -e "${GREEN}  🟢 MySQL Restored to HEALTHY!${NC}"
else
    echo -e "Usage: ./scripts/chaos-test.sh [nginx|wordpress]"
fi

echo -e "${CYAN}==========================================================${NC}"
echo -e "${GREEN} ✅ Chaos Engineering Test Completed!${NC}"
echo -e "${CYAN}==========================================================${NC}"
