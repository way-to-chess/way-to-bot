export $(grep -v '^#' .env.local | xargs)
npx typeorm-ts-node-commonjs migration:revert -d ./src/database/init.ts