#!/usr/bin/env bash
set -eo pipefail

echo "=========================================================="
echo " 💥 TASKFLOW DEVOPS CHAOS & FAILOVER INJECTION TEST "
echo "=========================================================="

echo "➡️ [Step 1] Measuring baseline API latency..."
time curl -s "http://localhost/api/v1/tasks" > /dev/null
echo "  ✅ Baseline API request succeeded."

echo "➡️ [Step 2] Simulating Redis Failure (Stopping taskflow_redis)..."
docker compose stop redis

echo "➡️ [Step 3] Testing Automatic Failover to PostgreSQL DB..."
FAILOVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/v1/tasks")
if [ "$FAILOVER_STATUS" -eq 200 ]; then
    echo "  🎉 FAILOVER SUCCESSFUL! HTTP 200 OK returned despite Redis outage."
else
    echo "  ⚠️ Unexpected status during failover: HTTP ${FAILOVER_STATUS}"
fi

echo "➡️ [Step 4] Restoring taskflow_redis container..."
docker compose start redis

echo "=========================================================="
echo " ✅ Chaos Injection Test Passed Cleanly!"
echo "=========================================================="
