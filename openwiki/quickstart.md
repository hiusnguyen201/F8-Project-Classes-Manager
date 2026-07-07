# Quickstart Guide

Welcome to the **Class Management System** repository! This project is a Node.js Express application that manages classroom operations using MySQL as the backend database.

## Project Overview
- **Purpose**: A web-based system for managing classes, students, teachers, and administrative tasks.
- **Tech Stack**: 
  - Backend: Node.js 18+ with Express
  - Database: MySQL (via sequelize)
  - Authentication: Passport.js with multiple strategies (local, Google, GitHub, Facebook)
  - Views: EJS templates with layout support
  - Utilities: dotenv for environment variables, express-flash for notifications

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Adjust values as needed for your local environment
   - Key variables include:
     - `PORT` - Application port (default from `npm start` script)
     - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection
     - `SESSION_SECRET` - Session encryption secret

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000` (or the port defined in your configuration)
   - The application will load with default admin credentials (refer to `src/app.js` for hardcoded admin user)

## Project Structure

```
src/
├── app.js                 # Main application entry point
├── config/                # Sequelize environment config
├── constants/             # Constants and status codes
├── database/               # Migrations and seeders
├── helpers/               # Helper utilities and passport strategies
├── http/
│   ├── controllers/       # Request handlers (web)
│   ├── middlewares/       # Authentication and authorization middleware
│   └── services/          # Business logic services
├── models/                # Sequelize data models
├── routes/                # Route definitions (mounted onto controllers)
└── resources/views/       # EJS view templates
public/                    # Static files (CSS, JS, images)
```

## Available Scripts
- `npm start` - Start the development server with auto-reload
- Additional scripts may be defined in `package.json` under `scripts`

## Documentation Navigation
- **[Architecture Overview](architecture.md)** - System architecture, key components, and core domains
- **[Codebase Overview](codebase_overview.md)** - Directory structure and development workflow
- **Domain docs** ([user_management.md](domain/user_management.md), [course_management.md](domain/course_management.md), [class_management.md](domain/class_management.md), [exercise_and_attendance.md](domain/exercise_and_attendance.md), [configuration_and_settings.md](domain/configuration_and_settings.md)) - Business logic per area
- **Routes** ([routes/web/](routes/web/)) and **Controllers** ([controllers/admin/](controllers/admin/)) - Per-route and per-controller reference
- **[Operations Guide](operations/deployment.md)** - Deployment procedures and operations notes

For more detailed information, explore the documentation directory structure in `/openwiki/`.