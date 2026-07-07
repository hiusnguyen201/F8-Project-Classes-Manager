# Admin Routes - Main (`src/routes/web/admin/index.js`)

This file serves as the main entry point for all web-based administrative routes. It aggregates various sub-routers, each responsible for a specific section of the admin panel.

## Route Aggregation

The router uses `express.Router()` and mounts other specific routers under their respective base paths. When this main router is used in `app.js`, all these paths will be prefixed accordingly (e.g., `/admin/...`).

### Mounted Routers

-   **Dashboard**:
    -   Mounted at: `/`
    -   Source: `./dashboard.js`
-   **Users**:
    -   Mounted at: `/users`
    -   Source: `./users.js`
-   **Courses**:
    -   Mounted at: `/courses`
    -   Source: `./courses.js`
-   **Teachers**:
    -   Mounted at: `/teachers`
    -   Source: `./teachers.js`
-   **Students**:
    -   Mounted at: `/students`
    -   Source: `./students.js`
-   **Classes**:
    -   Mounted at: `/classes`
    -   Source: `./classes.js`
-   **Settings**:
    -   Mounted at: `/settings`
    -   Source: `./setting.js`

## Dependencies

-   **Sub-routers**: Imported from their respective files within `./admin/`.
-   **Libraries**: `express`

## Usage

This router is intended to be mounted in the main application file (`src/app.js`) with a base path, such as `/admin`, to grant access to the administrative panel.
