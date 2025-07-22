# Way-to-Bot Project Guidelines

## Project Overview

Way-to-Bot is a Telegram bot platform built with a modern JavaScript/TypeScript stack. The project uses a monorepo
structure with npm workspaces to manage multiple packages.

## Project Structure

- **packages/**: Contains all project packages
    - **server/**: Express.js backend with TypeORM (PostgreSQL) and Telegram bot integration
    - **webapp/**: React 19 frontend for end users (Telegram Web App)
    - **adminui/**: React 19 admin interface with Ant Design
    - **shared/**: Common code, types, and utilities shared across packages

## Development Workflow

- Use `npm run dev` in respective package directories to start development servers
- For webapp: `npm run webapp:dev`
- For adminui: `npm run adminui:dev`
- For server: `cd packages/server && npm run dev`

## Code Style

- The project uses ESLint and Prettier for code formatting
- Follow TypeScript best practices with proper typing
- Use the existing architectural patterns in each package

## Docker

- The project includes Docker configuration for containerized deployment
- Docker Compose files are available for development and production environments

## Dependencies

- Keep dependencies up to date and consistent across packages
- Use the shared package for code that needs to be used in multiple packages
