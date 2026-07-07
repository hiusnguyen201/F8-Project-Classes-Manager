# Admin Teacher Management Routes (`src/routes/web/admin/teachers.js`)

This file defines the routes for managing teachers within the administrator panel. It offers comprehensive functionalities for handling teacher data, including listing, creation, viewing details, editing, deletion, and import/export operations.

## Route Definitions

### 1. List Teachers

-   **`GET /`**
    -   **Handler**: `TeacherController.index`
    -   **Description**: Displays a paginated list of all teachers, potentially with search and filtering options.

### 2. Create Teacher

-   **`GET /create`**
    -   **Handler**: `TeacherController.create`
    -   **Description**: Renders the form for adding a new teacher.
-   **`POST /create`**
    -   **Handler**: `TeacherController.handleCreateTeacher`
    -   **Middleware**: `csrf.verify`, `validator.make(TEACHER_RULES.CREATE)`
    -   **Description**: Processes the new teacher form submission, validates input against `TEACHER_RULES.CREATE`, and creates the teacher record.

### 3. Teacher Details

-   **`GET /details/:id`**
    -   **Handler**: `TeacherController.details`
    -   **Description**: Displays detailed information about a specific teacher identified by `:id`.
-   **`GET /details/:id/calendars/:classId`**
    -   **Handler**: `TeacherController.calendars`
    -   **Description**: Retrieves and displays calendar information for a specific teacher, filtered by a particular class (`:classId`).

### 4. Edit Teacher

-   **`GET /edit/:id`**
    -   **Handler**: `TeacherController.edit`
    -   **Description**: Renders the form for editing an existing teacher's information (`:id`).
-   **`PATCH /edit/:id`**
    -   **Handler**: `TeacherController.handleEditTeacher`
    -   **Middleware**: `csrf.verify`, `validator.make(TEACHER_RULES.EDIT)`
    -   **Description**: Handles the update of an existing teacher's details, ensuring input validity via `TEACHER_RULES.EDIT`.

### 5. Delete Teacher

-   **`DELETE /`**
    -   **Handler**: `TeacherController.handleDeleteTeachers`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Processes the deletion of one or more teachers. (Assumes IDs are provided in the request body).

### 6. Import/Export Teachers

-   **`GET /import`**
    -   **Handler**: `TeacherController.importTeachersPage`
    -   **Description**: Presents the interface for uploading a file to import teacher data.
-   **`POST /import`**
    -   **Handler**: `TeacherController.handleImportTeachers`
    -   **Middleware**: `fileMiddleware`, `validator.file("excel")`
    -   **Description**: Handles the file upload for importing teachers, validating the Excel file before processing.
-   **`GET /export`**
    -   **Handler**: `TeacherController.handleExportTeachers`
    -   **Description**: Exports teacher data to a downloadable Excel file (`writeFile` + `SHEET_HEADERS_EXPORT`).

## Dependencies

-   **Controllers**: `TeacherController` (from `src/http/controllers/web/admin/teacher.controller`)
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Constants**: `RULES_REQUEST.TEACHER_RULES`
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/teachers` in the main application file (`src/app.js`).
