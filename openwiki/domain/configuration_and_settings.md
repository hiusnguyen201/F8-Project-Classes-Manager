
# Configuration and Settings

This document covers the configuration and settings management within the Classes Manager project.

## Application Settings

-   **Model**: `src/models/setting.js` (`Setting`) is a generic key-value table (`optKey`/`optValue`). It has a migration (`*create-setting.js`) but no controller or service in `src/http/` currently reads or writes it — it is unused by the current codebase.
-   **Admin "Settings" pages**: `src/http/controllers/web/admin/setting.controller.js` — despite the name, this controller manages the logged-in admin's own profile, password, and linked social accounts, not the `Setting` model above. See [Admin Setting Controller](../controllers/admin/setting_controller.md). There is no dedicated `setting.service.js`; it delegates to `UserService` (profile/password) and `SocialService` (linked accounts).

## Constants

Various constants are used throughout the application to maintain consistency and manage configuration values.

-   `src/constants/`: This directory contains multiple files for different types of constants:
    -   `message.constant.js`: For user-facing messages.
    -   `path.constant.js`: For file paths and routing constants.
    -   `rules.constant.js`: For validation rules.
    -   `fileExcel.constant.js`: Constants related to Excel file operations.
    -   `status.constant.js`: For status codes or types.
    -   `setting.constant.js`: `LIMIT_PAGE` (pagination page sizes), `LIST_SOCIALS` (supported social providers: facebook, github, google), `ATTENDANCE_STATUS` (Late/On time/Absence).
    -   `validate.constant.js`: constants related to validation rules.

## Utilities

Helper functions for common tasks are located in `src/utils/`. This includes utilities for:

-   **Validation**: `src/utils/validator.js` provides validation logic.
-   **File Handling**: `src/utils/fileExcel.js` for Excel operations.
-   **String Manipulation**: `src/utils/string.js`.
-   **Tokens/Hashing**: `src/utils/token.js` (bcrypt hashing, JWT helpers).
-   **Email**: `src/utils/sendMail.js`.
-   **Redirect helpers**: `src/utils/classifyRedirect.js`.
-   **Dates**: `src/utils/moment.js`.

This domain ensures that the application can be configured and customized to meet specific needs, with constants and utilities providing a robust foundation.
