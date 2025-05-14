#!/bin/sh
export $(grep -v '^#' .env.local | xargs)
read -p "Input name for your migration: " migrationName
npx typeorm-ts-node-esm migration:generate ./src/database/migrations/"$migrationName" -d ./src/database/ds/ds.mts
