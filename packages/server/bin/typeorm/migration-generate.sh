export $(grep -v '^#' .env.local | xargs)
read -p "Input name for your migration: " migrationName
npx typeorm-ts-node-commonjs migration:generate ./src/database/migrations/"$migrationName" -d ./src/database/init.ts