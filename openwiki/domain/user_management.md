
# User Management

This document details the user management aspects of the Classes Manager project. It covers authentication, authorization, roles, and user-related data.

## Authentication

The system supports authentication primarily through:

-   **Local Authentication**: Username/email and password-based login. (`src/http/controllers/web/auth/auth.controller.js`)
-   **Social Authentication**: Integration with social providers like Facebook, Google, and GitHub. (Inferred from `src/helpers/passports/` and `src/http/services/social.service.js`)
-   **OTP (One-Time Password)**: Used in the auth flow in `src/http/controllers/web/auth/auth.controller.js` (`src/http/services/otp.service.js`, `src/http/middlewares/web/otp.middleware.js`).

## Authorization and Roles

The application implements role-based access control: a `User` belongs to a `Type` (`typeId`) and has a many-to-many `roles` association through the `users_roles` table.

-   `src/models/role.js`: Defines roles.
-   `src/models/permission.js`: Defines permissions.
-   `src/database/migrations/*users_roles.js` and `*users_permissions.js`: Database schema for roles and permissions.
-   `src/http/middlewares/web/auth.middleware.js`: Handles authentication/authorization checks for protected routes.

## User Data

User information is stored in the `users` table. Additional related data includes:

-   **User Social Accounts**: Linked social media accounts. (`src/models/user_social.js`, `src/http/services/social.service.js`)
-   **Login Tokens**: For session management. (`src/models/login_token.js`)
-   **User OTP**: For Two-Factor Authentication. (`src/models/user_otp.js`)
-   **User Columns**: Potentially custom fields for users. (`src/models/user_columns.js`)

See also: `src/database/migrations/*user*.js` for detailed schema information.
