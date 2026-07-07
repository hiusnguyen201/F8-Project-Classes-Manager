# Admin Dashboard Route (`src/routes/web/admin/dashboard.js`)

This file defines the route for the main administrator dashboard.

## Route Definitions

### 1. Admin Dashboard

-   **`GET /`**
    -   **Handler**: `HomeController.index` (from `src/http/controllers/web/admin/home.controller`)
    -   **Description**: Renders the main dashboard for administrators, providing an overview of system statistics, recent activity, and quick links to other admin sections.

## Dependencies

-   **Controllers**: `HomeController` (from `src/http/controllers/web/admin/home.controller`)
-   **Libraries**: `express`
