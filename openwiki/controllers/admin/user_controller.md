# Admin User Controller (`src/http/controllers/web/admin/user.controller.js`)

This controller manages all user-related operations within the administrator panel. It interfaces with `UserService` and `TypeService` to handle user data, including listing, viewing details, creating, editing, deleting, and importing/exporting users.

## Actions

### 1. List Users

-   **Route**: `GET /` (within admin user routes)
-   **Handler**: `index(req, res, next)`
-   **Functionality**:
    -   Fetches users with pagination, search, and type filtering using `userService.findAllWithTypesAndSearchAndPaginate`.
    -   Renders the user list view (`RENDER_PATH.ADMIN.HOME_USERS`).
    -   Passes data like `users`, `meta` information (pagination), flash messages, CSRF token, and utility functions to the view.

### 2. View User Details

-   **Route**: `GET /details/:id`
-   **Handler**: `details(req, res, next)`
-   **Functionality**:
    -   Fetches a single user by `id` using `userService.findById`.
    -   Renders the user detail view (`RENDER_PATH.ADMIN.DETAILS_USER`).
    -   Passes user details, breadcrumb information, and flash messages to the view.

### 3. Show Create User Form

-   **Route**: `GET /create`
-   **Handler**: `create(req, res)`
-   **Functionality**:
    -   Renders the form for creating a new user (`RENDER_PATH.ADMIN.CREATE_USER`).
    -   Fetches all available user types using `typeService.findAll()` to populate a dropdown for type selection.

### 4. Handle Create User Submission

-   **Route**: `POST /create`
-   **Handler**: `handleCreateUser(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.CREATE)`
-   **Functionality**:
    -   Processes the form data submitted for creating a new user.
    -   Calls `userService.create` to generate the user (including password hashing and sending an activation email).
    -   Handles success by redirecting to the user list or details page, or shows an error message.

### 5. Show Edit User Form

-   **Route**: `GET /edit/:id`
-   **Handler**: `edit(req, res, next)`
-   **Functionality**:
    -   Fetches the user to be edited by `id`.
    -   Fetches all user types for the type selection dropdown.
    -   Renders the edit user form (`RENDER_PATH.ADMIN.EDIT_USER`).

### 6. Handle Edit User Submission

-   **Route**: `PATCH /edit/:id`
-   **Handler**: `handleEditUser(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.EDIT)`
-   **Functionality**:
    -   Processes the form data submitted for editing an existing user.
    -   Calls `userService.update` to save the changes.
    -   Handles success or error feedback.

### 7. Handle Delete Users

-   **Route**: `DELETE /`
-   **Handler**: `handleDeleteUsers(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**:
    -   Processes the deletion request for one or more users (IDs typically sent in the request body).
    -   Iterates through the provided IDs and calls `userService.remove` for each.
    -   Redirects with a success or error message.

### 8. Import Users Page

-   **Route**: `GET /import`
-   **Handler**: `importUsersPage(req, res)`
-   **Functionality**:
    -   Renders the page containing the form for uploading an Excel file to import users (`RENDER_PATH.ADMIN.IMPORT_USERS`).

### 9. Handle Import Users

-   **Route**: `POST /import`
-   **Handler**: `handleImportUsers(req, res, next)`
-   **Middleware**: `fileMiddleware`, `validator.file("excel")`
-   **Functionality**:
    -   Processes the uploaded Excel file.
    -   Reads data using `fileExcel.readFile`.
    -   Iterates through rows, validates each user's data, and creates users using `userService.create`.
    -   Handles errors during file processing or user creation.
    -   Redirects with feedback.

### 10. Handle Export Users

-   **Route**: `GET /export`
-   **Handler**: `handleExportUsers(req, res, next)`
-   **Functionality**:
    -   Fetches all users from the database.
    -   Formats the user data according to `SHEET_HEADERS_EXPORT`.
    -   Uses `fileExcel.writeFile` to create an Excel file for download with `FILE_NAME_EXPORT` filename.

## Dependencies

-   **Services**: `UserService`, `TypeService`
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Utilities**: `stringUtil`, `fileExcel`, `csrf`
-   **Constants**: `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `MESSAGE_INFO`, `RENDER_PATH`, `REDIRECT_PATH`, `STATUS_CODE`, `FIELDS_IMPORT`, `FILE_NAME_EXPORT`, `SHEET_HEADERS_EXPORT`, `RULES_REQUEST.USER_RULES`, `RULES_REQUEST.OTP_RULES`
-   **Libraries**: `express`, `http-errors`, `moment`, `sequelize` (implicitly via services)

## Usage

This controller is invoked by the admin user routes (`/admin/users`) to handle incoming requests related to user management.
