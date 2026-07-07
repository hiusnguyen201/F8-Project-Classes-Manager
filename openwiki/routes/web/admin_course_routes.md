# Admin Course Management Routes (`src/routes/web/admin/courses.js`)

This file defines the routes for managing courses and their associated modules within the administrator panel. It provides functionalities for listing, creating, editing, deleting, importing, and exporting course data, as well as managing modules within each course.

## Route Definitions

### 1. List Courses

-   **`GET /`**
    -   **Handler**: `CourseController.index`
    -   **Description**: Displays a paginated list of all courses, potentially with search and filtering options.

### 2. Create Course

-   **`GET /create`**
    -   **Handler**: `CourseController.create`
    -   **Description**: Renders the form for adding a new course.
-   **`POST /create`**
    -   **Handler**: `CourseController.handleCreateCourse`
    -   **Middleware**: `csrf.verify`, `validator.make(COURSE_RULES.CREATE)`
    -   **Description**: Processes the new course form submission, validates input against `COURSE_RULES.CREATE`, and creates the course record.

### 3. Course Details & Module Management

-   **`GET /details/:id`**
    -   **Handler**: `CourseController.details`
    -   **Description**: Displays detailed information about a specific course identified by `:id`, including its modules.

-   **Module Management (nested under `/details/:id/modules/`)**
    -   **`GET /create`**:
        -   **Handler**: `CourseController.createModule`
        -   **Description**: Renders the form to add a new module to a specific course.
    -   **`POST /create`**:
        -   **Handler**: `CourseController.handleCreateModule`
        -   **Middleware**: `fileMiddleware`, `validator.file(["word", "pdf"])`, `validator.make(MODULE_RULES.CREATE)`
        -   **Description**: Handles the creation of a new module, including uploading allowed file types (Word, PDF) and validating against `MODULE_RULES.CREATE`.
    -   **`GET /edit/:moduleId`**:
        -   **Handler**: `CourseController.editModule`
        -   **Description**: Renders the form to edit an existing module (`:moduleId`) within a course.
    -   **`POST /edit/:moduleId`**:
        -   **Handler**: `CourseController.handleEditModule`
        -   **Middleware**: `fileMiddleware`, `validator.file(["word", "pdf"])`, `validator.make(MODULE_RULES.EDIT)`
        -   **Description**: Processes the edits to an existing module, allowing file updates and validating against `MODULE_RULES.EDIT`.
    -   **`DELETE /delete/:moduleId`**:
        -   **Handler**: `CourseController.handleDeleteModules`
        -   **Description**: Handles the deletion of a specific module (`:moduleId`) from a course.

### 4. Edit Course

-   **`GET /edit/:id`**
    -   **Handler**: `CourseController.edit`
    -   **Description**: Renders the form for editing an existing course's information (`:id`).
-   **`PATCH /edit/:id`**
    -   **Handler**: `CourseController.handleEditCourse`
    -   **Middleware**: `csrf.verify`, `validator.make(COURSE_RULES.EDIT)`
    -   **Description**: Processes the update of an existing course, validating input via `COURSE_RULES.EDIT`.

### 5. Delete Course

-   **`DELETE /`**
    -   **Handler**: `CourseController.handleDeleteCourses`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Processes the deletion of one or more courses. (Assumes IDs are provided in the request body).

### 6. Import/Export Courses

-   **`GET /import`**
    -   **Handler**: `CourseController.importCoursesPage`
    -   **Description**: Displays the interface for uploading a file to import course data.
-   **`POST /import`**
    -   **Handler**: `CourseController.handleImportCourses`
    -   **Middleware**: `fileMiddleware`, `validator.file("excel")`
    -   **Description**: Handles the file upload for importing courses, validating the Excel file before processing.
-   **`GET /export`**
    -   **Handler**: `CourseController.handleExportCourses`
    -   **Description**: Exports course data to a downloadable Excel file (`writeFile` + `SHEET_HEADERS_EXPORT`).

## Dependencies

-   **Controllers**: `CourseController` (from `src/http/controllers/web/admin/course.controller`)
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Constants**: `RULES_REQUEST.COURSE_RULES`, `RULES_REQUEST.MODULE_RULES`
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/courses` in the main application file (`src/app.js`).
