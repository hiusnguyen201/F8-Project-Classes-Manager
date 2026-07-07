# Admin Home Controller (`src/http/controllers/web/admin/home.controller.js`)

This controller handles the requests for the main administrator dashboard. Its primary responsibility is to fetch key system statistics and render the dashboard view with this information.

## Actions

### 1. Index (Dashboard View)

-   **Route Handled**: `GET /` (within the admin routes, typically mounted as `/admin/`)
-   **Handler**: `index(req, res)`
-   **Functionality**:
    1.  **Fetches Statistics**: It retrieves crucial counts from various services:
        *   Total number of admin users.
        *   Total number of teacher users.
        *   Total number of student users.
        *   Total number of courses.
        *   Total number of classes.
    2.  **Renders Dashboard View**: It renders the admin dashboard view (`RENDER_PATH.ADMIN.HOME_ADMIN`) using EJS templating.
    3.  **Passes Data to View**: The following data is passed to the view for dynamic rendering:
        *   `req`: The Express request object.
        *   `user`: The authenticated administrator's user object (`req.user`).
        *   `title`: Set to "Dashboard".
        *   `REDIRECT_PATH`: Contains routing path constants for redirects.
        *   `currPage`: Set to "dashboard" for navigation highlighting.
        *   `breadcrumb`: Structure for breadcrumb navigation, indicating the current page.
        *   `countAdmin`, `countTeacher`, `countStudent`, `countCourse`, `countClass`: The fetched summary statistics.

## Dependencies

-   **Services**:
    -   `UserService`: For fetching user counts by type.
    -   `CourseService`: For fetching the total course count.
    -   `ClassService`: For fetching the total class count.
-   **Constants**:
    -   `RENDER_PATH`: Maps logical view paths to file locations.
    -   `REDIRECT_PATH`: Provides routing path constants.

## Usage

This controller is tied to the main admin dashboard route (`GET /` under the admin scope). It ensures that administrators see a concise overview of the system's status upon logging in or navigating to the dashboard.
