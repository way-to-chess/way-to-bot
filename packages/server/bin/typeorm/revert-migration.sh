#!/bin/sh
export $(grep -v '^#' .env | xargs)

npx tsx ../../node_modules/typeorm/cli.js migration:revert \
  -d ./src/database/ds/ds.ts