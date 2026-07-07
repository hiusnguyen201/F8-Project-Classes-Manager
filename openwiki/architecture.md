
# Architecture Overview

The Classes Manager project utilizes a server-rendered architecture, primarily leveraging Node.js with the Express framework. The application follows a Model-View-Controller (MVC) pattern, where:

-   **Models**: Represent the data and interact with the database. Primarily defined in `src/models/`.
-   **Views**: Render the user interface, using EJS templating. Found in `src/resources/views/`.
-   **Controllers**: Handle incoming requests, orchestrate business logic, and interact with models and services. Located in `src/http/controllers/web/`.

Business logic is further abstracted into services, typically found in `src/http/services/`. The application uses a relational database, with migrations managed by Sequelize, as indicated by the migration file naming conventions.

## Key Components

-   **Routing**: Web routes are defined in `src/routes/web/` and map URLs to controller actions.
-   **Authentication & Authorization**: Handled through controllers and services, using Passport.js — local, Google, GitHub, and Facebook strategies are registered in `src/app.js` from `src/helpers/passports/`.
-   **Database Management**: Sequelize ORM is used for database interactions, with migrations in `src/database/migrations/`.
-   **Frontend**: EJS templates are used for server-side rendering, with static assets (CSS, JS, images) in the `public/` directory.
-   **Constants and Utilities**: `src/constants/` and `src/utils/` provide reusable configurations and helper functions.

## Technologies

-   **Backend**: Node.js, Express.js
-   **Database**: MySQL (via the `mysql2` driver, configured in `src/config/config.js`)
-   **Templating**: EJS
-   **ORM**: Sequelize
-   **Authentication**: Passport.js (local, Google, GitHub, Facebook strategies)

## Core Domains

The application is structured around several logical domains:

-   **User Management**: Covers authentication, roles, permissions, and user profiles.
-   **Course Management**: Manages courses and their constituent modules.
-   **Class Management**: Handles class creation, scheduling, student enrollment, and teacher assignments.
-   **Exercise & Assignment Management**: Facilitates the creation and submission of exercises.
-   **Attendance Tracking**: Records student attendance for classes.

This architecture provides a solid foundation for managing educational institution data, with clear separation of concerns.
