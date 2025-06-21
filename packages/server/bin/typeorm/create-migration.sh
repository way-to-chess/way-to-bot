#!/bin/sh
export $(grep -v '^#' .env | xargs)
read -p "Input name for your migration: " migrationName
npx typeorm-ts-node-esm migration:create ./src/database/migrations/"$migrationName"