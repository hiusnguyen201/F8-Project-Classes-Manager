# Admin Student Controller (`src/http/controllers/web/admin/student.controller.js`)

This controller manages all student-related operations within the administrator panel. It interfaces with `UserService` and `TypeService` to handle student data, including listing, viewing details, creating, editing, deleting, and importing/exporting students.

## Actions

### 1. List Students

-   **Route**: `GET /` (within admin student routes)
-   **Handler**: `index(req, res)`
-   **Functionality**:
    -   Fetches students with pagination and search using `userService.findAllWithTypesAndSearchAndPaginate`, filtering for the 'student' type.
    -   Renders the student list view (`RENDER_PATH.ADMIN.HOME_STUDENTS`).
    -   Passes data like `students`, `meta` information, flash messages, CSRF token, and utility functions to the view.

### 2. View Student Details

-   **Route**: `GET /details/:id`
-   **Handler**: `details(req, res, next)`
-   **Functionality**:
    -   Fetches a single student by `id` using `userService.findById`.
    -   Renders the student detail view (`RENDER_PATH.ADMIN.DETAILS_STUDENT`).
    -   Passes student details, breadcrumb information, and flash messages.

### 3. Show Create Student Form

-   **Route**: `GET /create`
-   **Handler**: `create(req, res)`
-   **Functionality**:
    -   Renders the form for creating a new student (`RENDER_PATH.ADMIN.CREATE_STUDENT`).
    -   Fetches user types using `typeService.findAll()` for dropdown selection.

### 4. Handle Create Student Submission

-   **Route**: `POST /create`
-   **Handler**: `handleCreateStudent(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.CREATE)`
-   **Functionality**:
    -   Processes the form data submitted for creating a new student.
    -   Calls `userService.create` to register the student.
    -   Handles success by redirecting or shows an error message.

### 5. Show Edit Student Form

-   **Route**: `GET /edit/:id`
-   **Handler**: `edit(req, res, next)`
-   **Functionality**:
    -   Fetches the student by `id` and their associated type.
    -   Renders the edit student form (`RENDER_PATH.ADMIN.EDIT_STUDENT`).

### 6. Handle Edit Student Submission

-   **Route**: `PATCH /edit/:id`
-   **Handler**: `handleEditStudent(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.EDIT)`
-   **Functionality**:
    -   Processes the form data for editing an existing student.
    -   Calls `userService.update` to save changes.
    -   Handles success or error feedback.

### 7. Handle Delete Students

-   **Route**: `DELETE /`
-   **Handler**: `handleDeleteStudents(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**:
    -   Processes the deletion request for selected students (checks IDs in request body).
    -   Uses `userService.remove` for each student to be deleted.

### 8. Import Students Page

-   **Route**: `GET /import`
-   **Handler**: `importStudentsPage(req, res)`
-   **Functionality**:
    -   Renders the page for uploading an Excel file to import students (`RENDER_PATH.ADMIN.IMPORT_STUDENTS`).

### 9. Handle Import Students

-   **Route**: `POST /import`
-   **Handler**: `handleImportStudents(req, res, next)`
-   **Middleware**: `fileMiddleware`, `validator.file("excel")`
-   **Functionality**:
    -   Processes the uploaded Excel file for importing student data.
    -   Reads data using `fileExcel.readFile`.
    -   Validates and creates students using `userService.create`.
    -   Handles import errors.

### 10. Handle Export Students

-   **Route**: `GET /export`
-   **Handler**: `handleExportStudents(req, res, next)`
-   **Functionality**:
    -   Fetches student data.
    -   Formats data and exports it to an Excel file using `fileExcel.writeFile`.

## Dependencies

-   **Services**: `UserService`, `TypeService`
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Utilities**: `stringUtil`, `fileExcel`
-   **Constants**: `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `RENDER_PATH`, `REDIRECT_PATH`, `STATUS_CODE`, `FILE_NAME_EXPORT`, `SHEET_HEADERS_EXPORT`, `RULES_REQUEST.USER_RULES`
-   **Libraries**: `express`, `http-errors`, `moment`

## Usage

This controller is invoked by the admin student routes (`/admin/students`) to manage student-related functionalities.
