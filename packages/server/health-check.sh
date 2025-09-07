#!/bin/sh
if [ ! -f /tmp/health_started ]; then
  if curl -f http://localhost:3000/api/ping; then
    echo "Health check started" > /tmp/health_started
    exit 0
  else
    exit 1
  fi
else
  exit 0
fi