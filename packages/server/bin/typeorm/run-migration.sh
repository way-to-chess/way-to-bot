#!/bin/sh
export $(grep -v '^#' .env | xargs)
export PROJECT_ROOT=dist
npx typeorm migration:run -d ./dist/database/ds/ds.js