#!/bin/sh
export $(grep -v '^#' .env | xargs)
read -p "Input name for your migration: " migrationName
npx typeorm migration:create ./src/database/migrations/"$migrationName"