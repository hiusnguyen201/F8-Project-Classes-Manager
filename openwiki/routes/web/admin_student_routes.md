# Admin Student Management Routes (`src/routes/web/admin/students.js`)

This file defines the routes for managing students within the administrator panel. It offers comprehensive functionalities for handling student data, including listing, creation, viewing details, editing, deletion, and import/export operations.

## Route Definitions

### 1. List Students

-   **`GET /`**
    -   **Handler**: `StudentController.index`
    -   **Description**: Displays a paginated list of all students, potentially with search and filtering options.

### 2. Create Student

-   **`GET /create`**
    -   **Handler**: `StudentController.create`
    -   **Description**: Renders the form for adding a new student.
-   **`POST /create`**
    -   **Handler**: `StudentController.handleCreateStudent`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.CREATE)`
    -   **Description**: Processes the new student form submission, validates input against `USER_RULES.CREATE`, and creates the student record.

### 3. Student Details

-   **`GET /details/:id`**
    -   **Handler**: `StudentController.details`
    -   **Description**: Displays detailed information about a specific student identified by `:id`.

### 4. Edit Student

-   **`GET /edit/:id`**
    -   **Handler**: `StudentController.edit`
    -   **Description**: Renders the form for editing an existing student's information (`:id`).
-   **`PATCH /edit/:id`**
    -   **Handler**: `StudentController.handleEditStudent`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.EDIT)`
    -   **Description**: Handles the update of an existing student's details, ensuring input validity via `USER_RULES.EDIT`.

### 5. Delete Student

-   **`DELETE /`**
    -   **Handler**: `StudentController.handleDeleteStudents`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Processes the deletion of one or more students. (Assumes IDs are provided in the request body).

### 6. Import/Export Students

-   **`GET /import`**
    -   **Handler**: `StudentController.importStudentsPage`
    -   **Description**: Presents the interface for uploading a file to import student data.
-   **`POST /import`**
    -   **Handler**: `StudentController.handleImportStudents`
    -   **Middleware**: `fileMiddleware`, `validator.file("excel")`
    -   **Description**: Handles the file upload for importing students, validating the Excel file before processing.
-   **`GET /export`**
    -   **Handler**: `StudentController.handleExportStudents`
    -   **Description**: Exports student data to a downloadable Excel file (`writeFile` + `SHEET_HEADERS_EXPORT`).

## Dependencies

-   **Controllers**: `StudentController` (from `src/http/controllers/web/admin/student.controller`)
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Constants**: `RULES_REQUEST.USER_RULES` (reused for student-specific rules)
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/students` in the main application file (`src/app.js`).
