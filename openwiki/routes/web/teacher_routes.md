# Teacher Routes (/src/routes/web/teachers/index.js)

This file defines the web routes specifically for teacher users. It currently includes a single route for the teacher dashboard.

## Route Definitions

### 1. Teacher Dashboard

-   **`GET /`**
    -   **Handler**: `HomeController.index` (from `src/http/controllers/web/teachers/home.controller`)
    -   **Description**: Renders a minimal home page (`RENDER_PATH.HOME_TEACHER`) passing only `title`, `user`, and `REDIRECT_PATH` — the handler itself contains no class/progress-fetching logic; any teacher-facing functionality lives in the view or is not yet implemented.

## Dependencies

-   **Controllers**: `HomeController` (from `src/http/controllers/web/teachers/home.controller`)
-   **Libraries**: `express`

## Usage

Mounted in `src/app.js` as `app.use("/teacher", teachersRouter)`.
