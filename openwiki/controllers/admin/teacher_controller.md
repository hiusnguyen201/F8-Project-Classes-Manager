# Admin Teacher Controller (`src/http/controllers/web/admin/teacher.controller.js`)

This controller manages all teacher-related operations within the administrator panel. It interacts with `UserService`, `TypeService`, and `ClassService` to handle teacher data, including listing, viewing details, creating, editing, deleting, and importing/exporting teachers.

## Actions

### 1. List Teachers

-   **Route**: `GET /` (within admin teacher routes)
-   **Handler**: `index(req, res)`
-   **Functionality**:
    -   Fetches teachers (including 'assistant' type) with pagination and search using `userService.findAllWithTypesAndSearchAndPaginate`.
    -   Renders the teacher list view (`RENDER_PATH.ADMIN.HOME_TEACHERS`).
    -   Passes data like `teachers`, `meta` information, flash messages, CSRF token, and utility functions to the view.

### 2. View Teacher Details

-   **Route**: `GET /details/:id`
-   **Handler**: `details(req, res, next)`
-   **Functionality**:
    -   Fetches a single teacher by `id` using `userService.findById`.
    -   Retrieves classes the teacher is associated with using `teacher.getClasses()`.
    -   Renders the teacher detail view (`RENDER_PATH.ADMIN.DETAILS_TEACHER`).
    -   Passes teacher details, associated classes, breadcrumb information, and flash messages.
-   **Route**: `GET /details/:id/calendars/:classId`
    -   **Handler**: `calendars(req, res, next)`
    -   **Functionality**: Retrieves specific calendar/schedule information for a teacher within a given class.

### 3. Show Create Teacher Form

-   **Route**: `GET /create`
-   **Handler**: `create(req, res)`
-   **Functionality**:
    -   Renders the form for creating a new teacher (`RENDER_PATH.ADMIN.CREATE_TEACHER`).
    -   Fetches user types for dropdown selection.

### 4. Handle Create Teacher Submission

-   **Route**: `POST /create`
-   **Handler**: `handleCreateTeacher(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(TEACHER_RULES.CREATE)`
-   **Functionality**:
    -   Processes the form data for creating a new teacher.
    -   Calls `userService.create` to register the teacher.
    -   Handles success or error feedback.

### 5. Show Edit Teacher Form

-   **Route**: `GET /edit/:id`
-   **Handler**: `edit(req, res, next)`
-   **Functionality**:
    -   Fetches the teacher by `id` and their associated type.
    -   Renders the edit teacher form (`RENDER_PATH.ADMIN.EDIT_TEACHER`).

### 6. Handle Edit Teacher Submission

-   **Route**: `PATCH /edit/:id`
-   **Handler**: `handleEditTeacher(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(TEACHER_RULES.EDIT)`
-   **Functionality**:
    -   Processes the form data for editing an existing teacher.
    -   Calls `userService.update` to save changes.
    -   Handles success or error feedback.

### 7. Handle Delete Teachers

-   **Route**: `DELETE /`
-   **Handler**: `handleDeleteTeachers(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**:
    -   Processes the deletion request for selected teachers.
    -   Uses `userService.remove` for each teacher to be deleted.

### 8. Import Teachers Page

-   **Route**: `GET /import`
-   **Handler**: `importTeachersPage(req, res)`
-   **Functionality**:
    -   Renders the page for uploading an Excel file to import teachers (`RENDER_PATH.ADMIN.IMPORT_TEACHERS`).

### 9. Handle Import Teachers

-   **Route**: `POST /import`
-   **Handler**: `handleImportTeachers(req, res, next)`
-   **Middleware**: `fileMiddleware`, `validator.file("excel")`
-   **Functionality**:
    -   Processes the uploaded Excel file for importing teacher data.
    -   Reads data, validates, and creates teachers using `userService.create`.
    -   Handles import errors.

### 10. Handle Export Teachers

-   **Route**: `GET /export`
-   **Handler**: `handleExportTeachers(req, res, next)`
-   **Functionality**:
    -   Fetches teacher data from the database.
    -   Formats data and exports it to an Excel file using `fileExcel.writeFile`.

## Dependencies

-   **Services**: `UserService`, `TypeService`, `ClassService`
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Utilities**: `stringUtil`, `fileExcel`
-   **Constants**: `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `RENDER_PATH`, `REDIRECT_PATH`, `STATUS_CODE`, `FILE_NAME_EXPORT`, `SHEET_HEADERS_EXPORT`, `RULES_REQUEST.TEACHER_RULES`
-   **Libraries**: `express`, `http-errors`, `moment`, `sequelize` (implicitly)

## Usage

This controller is invoked by the admin teacher routes (`/admin/teachers`) to manage teacher-related functionalities.
