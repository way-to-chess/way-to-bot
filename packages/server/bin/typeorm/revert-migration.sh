#!/bin/sh
export $(grep -v '^#' .env | xargs)
npx typeorm migration:revert -d ./dist/database/ds/ds.mjs