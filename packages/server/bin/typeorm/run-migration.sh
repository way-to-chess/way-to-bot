#!/bin/sh
export $(grep -v '^#' .env | xargs)
npx typeorm migration:run -d ./dist/database/ds/ds.mjs