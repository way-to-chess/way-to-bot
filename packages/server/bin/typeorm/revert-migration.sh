#!/bin/sh
export $(grep -v '^#' .env | xargs)
npx typeorm-ts-node-esm migration:revert -d ./src/database/ds/ds.mts