#!/usr/bin/env bash
set -eo pipefail

echo "=========================================================="
echo " 🛡️ TASKFLOW DEVOPS INFRASTRUCTURE HEALTH & SLA CHECKER "
echo "=========================================================="

BASE_URL="${1:-http://localhost}"

echo "➡️ [1/4] Checking Nginx Gateway on ${BASE_URL}..."
if curl -s -f -o /dev/null "${BASE_URL}/"; then
    echo "  ✅ Nginx Gateway: ONLINE (HTTP 200)"
else
    echo "  ❌ Nginx Gateway: DOWN"
fi

echo "➡️ [2/4] Checking Express API Health Endpoint..."
HEALTH_RESP=$(curl -s "${BASE_URL}/api/v1/health" || echo '{"status":"FAIL"}')
echo "  📊 Health Payload: ${HEALTH_RESP}"

echo "➡️ [3/4] Checking Redis Ping via Docker..."
if docker exec taskflow_redis redis-cli ping > /dev/null 2>&1; then
    echo "  ✅ Redis RAM Cache: PONG (ONLINE)"
else
    echo "  ⚠️ Redis RAM Cache: CONTAINER NOT REACHABLE"
fi

echo "➡️ [4/4] Checking PostgreSQL Readiness..."
if docker exec taskflow_postgres pg_isready -U postgres -d taskflow_db > /dev/null 2>&1; then
    echo "  ✅ PostgreSQL DB: ACCEPTING CONNECTIONS"
else
    echo "  ⚠️ PostgreSQL DB: NOT READY"
fi

echo "=========================================================="
echo " ✅ SLA & Health Check Completed Cleanly!"
echo "=========================================================="
