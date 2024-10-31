export $(grep -v '^#' .env.migrations | xargs)
read -p "Input name for your migration: " migrationName
npx typeorm-ts-node-commonjs migration:create ./src/database/migrations/"$migrationName"