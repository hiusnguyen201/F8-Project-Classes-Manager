# Admin Course Controller (`src/http/controllers/web/admin/course.controller.js`)

This controller manages course and module-related operations within the administrator panel. It leverages `CourseService`, `UserService` (for teacher selection), and file utilities for import/export and module content.

## Actions

### 1. List Courses

-   **Route**: `GET /` (within admin course routes)
-   **Handler**: `index(req, res)`
-   **Functionality**:
    -   Fetches courses with pagination and search using `courseService.findAllWithSearchAndPaginate`.
    -   Renders the course list view (`RENDER_PATH.ADMIN.HOME_COURSES`).
    -   Passes data including `courses`, `meta` information, flash messages, CSRF token, and utility functions.

### 2. Show Create Course Form

-   **Route**: `GET /create`
-   **Handler**: `create(req, res)`
-   **Functionality**:
    -   Renders the form for creating a new course (`RENDER_PATH.ADMIN.CREATE_COURSE`).
    -   Fetches available teachers using `userService.findAllWithTypes("teacher")` to populate a dropdown.

### 3. Handle Create Course Submission

-   **Route**: `POST /create`
-   **Handler**: `handleCreateCourse(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(COURSE_RULES.CREATE)`
-   **Functionality**:
    -   Processes the form data for creating a new course.
    -   Calls `courseService.create` to save the course.
    -   Handles success redirection or error feedback.

### 4. View Course Details & Manage Modules

-   **Route**: `GET /details/:id`
-   **Handler**: `details(req, res, next)`
-   **Functionality**:
    -   Fetches a specific course by `id` using `courseService.findById`.
    -   Renders the course details view (`RENDER_PATH.ADMIN.DETAILS_COURSE`).

-   **Create Module Form**:
    -   **Route**: `GET /details/:id/modules/create`
    -   **Handler**: `createModule(req, res)`
    -   **Functionality**: Renders the form to add a new module to a course (`RENDER_PATH.ADMIN.CREATE_MODULE`).

-   **Handle Create Module Submission**:
    -   **Route**: `POST /details/:id/modules/create`
    -   **Handler**: `handleCreateModule(req, res, next)`
    -   **Middleware**: `fileMiddleware`, `validator.file(["word", "pdf"])`, `validator.make(MODULE_RULES.CREATE)`
    -   **Functionality**: Processes new module creation, including uploading module content files (Word, PDF) and validating data.

-   **Edit Module Form**:
    -   **Route**: `GET /details/:id/modules/edit/:moduleId`
    -   **Handler**: `editModule(req, res)`
    -   **Functionality**: Renders the form to edit an existing module.

-   **Handle Edit Module Submission**:
    -   **Route**: `POST /details/:id/modules/edit/:moduleId`
    -   **Handler**: `handleEditModule(req, res, next)`
    -   **Middleware**: `fileMiddleware`, `validator.file(["word", "pdf"])`, `validator.make(MODULE_RULES.EDIT)`
    -   **Functionality**: Processes module edits, including updating content files and validating data.

-   **Handle Delete Module**:
    -   **Route**: `DELETE /details/:id/modules/delete/:moduleId`
    -   **Handler**: `handleDeleteModules(req, res, next)`
    -   **Functionality**: Handles the deletion of a specific module.

### 5. Show Edit Course Form

-   **Route**: `GET /edit/:id`
-   **Handler**: `edit(req, res, next)`
-   **Functionality**:
    -   Fetches the course by `id` and available teachers.
    -   Renders the edit course form (`RENDER_PATH.ADMIN.EDIT_COURSE`).

### 6. Handle Edit Course Submission

-   **Route**: `PATCH /edit/:id`
-   **Handler**: `handleEditCourse(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(COURSE_RULES.EDIT)`
-   **Functionality**:
    -   Processes the form data for editing an existing course.
    -   Calls `courseService.update` to save changes.

### 7. Handle Delete Courses

-   **Route**: `DELETE /`
-   **Handler**: `handleDeleteCourses(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**:
    -   Processes the deletion request for selected courses.
    -   Uses `courseService.remove` for each course to be deleted.

### 8. Import Courses Page

-   **Route**: `GET /import`
-   **Handler**: `importCoursesPage(req, res)`
-   **Functionality**:
    -   Renders the page for uploading an Excel file to import courses (`RENDER_PATH.ADMIN.IMPORT_COURSES`).

### 9. Handle Import Courses

-   **Route**: `POST /import`
-   **Handler**: `handleImportCourses(req, res, next)`
-   **Middleware**: `fileMiddleware`, `validator.file("excel")`
-   **Functionality**:
    -   Processes the uploaded Excel file for importing course data.
    -   Reads data, validates, and creates courses using `courseService.create`.

### 10. Handle Export Courses

-   **Route**: `GET /export`
-   **Handler**: `handleExportCourses(req, res, next)`
-   **Functionality**:
    -   Fetches course data.
    -   Formats data and exports it to an Excel file using `fileExcel.writeFile`.

## Dependencies

-   **Services**: `CourseService`, `UserService`
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Utilities**: `stringUtil`, `fileExcel`
-   **Constants**: `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `RENDER_PATH`, `REDIRECT_PATH`, `STATUS_CODE`, `FILE_NAME_EXPORT`, `SHEET_HEADERS_EXPORT`, `COURSE_RULES`, `MODULE_RULES`
-   **Libraries**: `express`, `http-errors`, `moment`, `sequelize` (implicitly)

## Usage

This controller is invoked by the admin course routes (`/admin/courses`) to manage course and module functionalities.
