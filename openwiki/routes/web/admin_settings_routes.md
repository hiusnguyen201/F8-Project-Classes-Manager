# Admin Settings Routes (`src/routes/web/admin/setting.js`)

This file defines the routes for managing user settings and security configurations within the administrator panel. These routes allow administrators to update their profile, manage password, and handle security-related settings like unlinking social accounts.

## Route Definitions

### 1. Profile Settings

-   **`GET /profile`**
    -   **Handler**: `SettingController.profile`
    -   **Description**: Renders the page for the administrator to view and edit their profile information (e.g., name, email, phone).
-   **`PATCH /profile`**
    -   **Handler**: `SettingController.handleEditProfile`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.EDIT)`
    -   **Description**: Processes the update of the administrator's profile details, validating the input using `USER_RULES.EDIT`.

### 2. Security Settings

-   **`GET /security`**
    -   **Handler**: `SettingController.security`
    -   **Description**: Displays the security settings page, which may include options for managing linked social accounts or other security configurations.
-   **`DELETE /security`**
    -   **Handler**: `SettingController.handleRemoveUserSocial`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Handles the action of unlinking a connected social account (e.g., Google, Facebook) from the administrator's profile.

### 3. Password Management

-   **`GET /password`**
    -   **Handler**: `SettingController.password`
    -   **Description**: Renders the form for the administrator to change their account password.
-   **`PATCH /password`**
    -   **Handler**: `SettingController.handleChangePassword`
    -   **Middleware**: `csrf.verify`, `validator.make(USER_RULES.CHANGE_PASS)`
    -   **Description**: Processes the password change request, validating the current and new passwords according to `USER_RULES.CHANGE_PASS`.

## Dependencies

-   **Controllers**: `SettingController` (from `src/http/controllers/web/admin/setting.controller`)
-   **Middleware**: `csrf`, `validator`
-   **Constants**: `RULES_REQUEST.USER_RULES` (reused for profile and password rules)
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/settings` in the main application file (`src/app.js`).
