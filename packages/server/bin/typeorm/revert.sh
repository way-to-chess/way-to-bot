export $(grep -v '^#' .env.local | xargs)
npx typeorm-ts-node-esm migration:revert -d ./src/database/init.ts
