# Student Routes (/src/routes/web/students/index.js)

This file defines the web routes specifically for student users. It currently includes a single route for the student dashboard.

## Route Definitions

### 1. Student Dashboard

-   **`GET /`**
    -   **Handler**: `HomeController.index` (from `src/http/controllers/web/students/home.controller`)
    -   **Description**: Renders a minimal home page passing only `title`, `user`, and `REDIRECT_PATH`. Note: the handler calls `res.render(RENDER_PATH, REDIRECT_PATH.HOME_STUDENT, {...})` — passing the whole `RENDER_PATH` object as the view name instead of `RENDER_PATH.HOME_STUDENT` — which looks like a bug relative to the equivalent teacher/admin handlers (compare `src/http/controllers/web/teachers/home.controller.js`).

## Dependencies

-   **Controllers**: `HomeController` (from `src/http/controllers/web/students/home.controller`)
-   **Libraries**: `express`

## Usage

Mounted in `src/app.js` as `app.use("/", studentsRouter)` (student routes are mounted at the application root).
