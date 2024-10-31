export $(grep -v '^#' .env.migrations | xargs)
npx typeorm-ts-node-commonjs migration:revert -d ./src/database/init.ts