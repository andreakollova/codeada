#!/bin/bash
# Push notification cron - called by Render

HOUR=$(date -u +%H)
DAY=$(date -u +%u) # 1=Monday, 7=Sunday

if [ "$1" = "glossary" ] || [ "$HOUR" = "09" ]; then
  echo "Sending glossary notification..."
  curl -s -X POST "https://www.coduy.sk/api/push/send" \
    -H "Content-Type: application/json" \
    -d '{"type": "glossary"}'
elif [ "$1" = "reminder" ] || ([ "$HOUR" = "17" ] && ([ "$DAY" = "1" ] || [ "$DAY" = "3" ] || [ "$DAY" = "5" ])); then
  echo "Sending reminder notification..."
  curl -s -X POST "https://www.coduy.sk/api/push/send" \
    -H "Content-Type: application/json" \
    -d '{"type": "reminder"}'
else
  echo "No notification to send at this time"
fi
