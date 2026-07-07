# Deployment & Operations

This project has no CI/CD pipeline, Dockerfile, or process-manager config checked into the repo — it runs as a plain Node.js process configured entirely through environment variables.

## Running the app

- Entry point: `bin/www` creates the HTTP server from `src/app.js` and listens on `process.env.PORT` (defaults to `3000`).
- Start command: `npm start` runs `nodemon ./bin/www` (see `package.json`) — used for both development and production; there is no separate build step or process manager (no PM2/systemd config in the repo).

## Environment configuration

All configuration is read from a `.env` file (see `.env.example` for the full list of keys) and loaded via `dotenv`. Key groups:

- **App**: `APP_NAME`, `NODE_ENV`, `PORT`
- **Database**: `DB_DRIVER`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` — consumed by `src/config/config.js` and passed to Sequelize (see [Database Configuration](../database/configuration.md))
- **Redis**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASS`
- **Mail**: `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_AUTH_USER`, `MAIL_AUTH_PASS`
- **OTP**: `OTP_EXPIRE_MINUTES`, `TIMEZONE`
- **OAuth**: `GOOGLE_CLIENT_ID`/`SECRET`/`CALLBACK_URL`, `GITHUB_CLIENT_ID`/`SECRET`/`CALLBACK_URL`, `FACEBOOK_APP_ID`/`SECRET`/`CALLBACK_URL` — used by the Passport strategies in `src/helpers/passports/`
- **Auth tokens**: `JWT_SECRET`, `JWT_EXPIRE`
- **Uploads**: `SIZE_FILE_LIMIT`

Copy `.env.example` to `.env` and fill in real values before starting the app; `NODE_ENV` selects which block of `src/config/config.js` Sequelize uses (`development`, `test`, or `production`).

## Database migrations

Schema changes are managed with `sequelize-cli` (a dev dependency) against the files in `src/database/migrations/` and `src/database/seeders/`. There is no migration step wired into `npm start` — migrations must be run manually (e.g. `npx sequelize-cli db:migrate`) against the target environment before starting the app.

## Deploying

Because there's no containerization or CI config in the repo, deploying means: provision a MySQL database, set the environment variables above on the target host, run migrations, then start the process with `npm start` (or an external process manager of your choice, since none is configured here).
