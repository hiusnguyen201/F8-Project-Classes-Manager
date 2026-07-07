# Admin User Management Routes (`src/routes/web/admin/users.js`)

This file defines the routes for managing users within the administrator panel. It provides functionalities for listing, creating, viewing details, editing, deleting, and importing/exporting user data.

## Route Definitions

### 1. List Users

-   **`GET /`**
    -   **Handler**: `UserController.index`
    -   **Description**: Displays a paginated list of all users, potentially with search and filtering capabilities.

### 2. Create User

-   **`GET /create`**
    -   **Handler**: `UserController.create`
    -   **Description**: Renders the form for creating a new user.
-   **`POST /create`**
    -   **Handler**: `UserController.handleCreateUser`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.CREATE)`
    -   **Description**: Processes the submission of the new user form, validates the input, and creates the user in the system.

### 3. User Details

-   **`GET /details/:id`**
    -   **Handler**: `UserController.details`
    -   **Description**: Displays detailed information about a specific user identified by `:id`.

### 4. Edit User

-   **`GET /edit/:id`**
    -   **Handler**: `UserController.edit`
    -   **Description**: Renders the form for editing an existing user identified by `:id`.
-   **`PATCH /edit/:id`**
    -   **Handler**: `UserController.handleEditUser`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.EDIT)`
    -   **Description**: Processes the update request for an existing user, validating the input before saving changes.

### 5. Delete User

-   **`DELETE /`**
    -   **Handler**: `UserController.handleDeleteUsers`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Handles the deletion of one or more users. (Assumes user IDs are passed in the request body).

### 6. Import/Export Users

-   **`GET /import`**
    -   **Handler**: `UserController.importUsersPage`
    -   **Description**: Displays the interface for importing users from a file.
-   **`POST /import`**
    -   **Handler**: `UserController.handleImportUsers`
    -   **Middleware**: `fileMiddleware`, `validator.file("excel")`
    -   **Description**: Processes the uploaded Excel file to import multiple users into the system.
-   **`GET /export`**
    -   **Handler**: `UserController.handleExportUsers`
    -   **Description**: Exports user data to a downloadable Excel file (`writeFile` + `SHEET_HEADERS_EXPORT`).

## Dependencies

-   **Controllers**: `UserController` (from `src/http/controllers/web/admin/user.controller`)
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Constants**: `RULES_REQUEST.USER_RULES`
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/users` in the main application file (`src/app.js`).
