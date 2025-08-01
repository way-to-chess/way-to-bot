#!/bin/sh
export $(grep -v '^#' .env.local | xargs)
read -p "Input name for your migration: " migrationName

npx tsx ./node_modules/typeorm/cli.js migration:generate \
  ./src/database/migrations/"$migrationName" \
  -d ./src/database/ds/ds.ts
