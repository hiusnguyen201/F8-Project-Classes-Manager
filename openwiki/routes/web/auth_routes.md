# Authentication Routes (/src/routes/web/auth/index.js)

This file defines the web routes related to user authentication, including local login, social logins, logout, OTP handling, and password resets. It heavily utilizes `passport.js` for authentication strategies and custom middleware for authorization and validation.

## Route Definitions

### 1. Logout

-   **`GET /logout`**
    -   **Middleware**: `AuthMiddleware`
    -   **Handler**: `AuthController.logout`
    -   **Description**: Logs the authenticated user out of the system.

### 2. Social Logins

These routes integrate with external OAuth providers for authentication.

-   **Google**
    -   `GET /google/redirect`: Initiates the Google OAuth flow.
    -   `GET /google/callback`: Handles the callback from Google. Authenticates the user via Passport.js. If a token exists (linking accounts), calls `AuthController.handleLinkAccountSocial`; otherwise, calls `AuthController.handleSocialLogin`. Redirects to login on failure.
-   **GitHub**
    -   `GET /github/redirect`: Initiates the GitHub OAuth flow.
    -   `GET /github/callback`: Handles the callback from GitHub. Similar logic to Google callback regarding `token` cookie and handlers.
-   **Facebook**
    -   `GET /facebook/redirect`: Initiates the Facebook OAuth flow.
    -   `GET /facebook/callback`: Handles the callback from Facebook. Similar logic to Google callback regarding `token` cookie and handlers.

**Common Logic for Social Callbacks**:
-   Uses `passport.authenticate("provider", { failureRedirect: REDIRECT_PATH.AUTH.LOGIN, failureMessage: true })`.
-   Conditionally calls `handleLinkAccountSocial` or `handleSocialLogin` based on the presence of a `token` cookie.

### 3. Guest Middleware Enforcement

-   `router.use(GuestMiddleware)`: Applied after social login callbacks and before OTP/Password Reset/Local Login routes. This ensures that only users who are *not* logged in can access the following routes (e.g., preventing logged-in users from seeing the login page).

### 4. One-Time Password (OTP) Verification

-   **`GET /otp`**
    -   **Middleware**: `GuestMiddleware`, `OtpMiddleware`
    -   **Handler**: `AuthController.otp`
    -   **Description**: Displays the OTP input form.
-   **`POST /otp`**
    -   **Middleware**: `GuestMiddleware`, `OtpMiddleware`, `csrf.verify`, `validator.make(OTP_RULES)`
    -   **Handler**: `AuthController.handleOtp`
    -   **Description**: Verifies the submitted OTP.

### 5. Password Reset

-   **`GET /passwordreset`**
    -   **Handler**: `AuthController.emailResetPass`
    -   **Description**: Displays the form to request a password reset email.
-   **`POST /passwordreset`**
    -   **Middleware**: `csrf.verify`
    -   **Handler**: `AuthController.handleEmailResetPass`
    -   **Description**: Handles the submission of the password reset email request.
-   **`GET /passwordreset/:token`**
    -   **Middleware**: `GuestMiddleware`, `JwtTokenMiddleware`
    -   **Handler**: `AuthController.resetPassword`
    -   **Description**: Displays the form to enter a new password, using a valid reset token.
-   **`PATCH /passwordreset/:token`**
    -   **Middleware**: `GuestMiddleware`, `csrf.verify`
    -   **Handler**: `AuthController.handleResetPassword`
    -   **Description**: Handles the submission of the new password.

### 6. Local Login

-   **`GET /login`**
    -   **Handler**: `AuthController.login`
    -   **Description**: Displays the local login form.
-   **`POST /login`**
    -   **Middleware**: `GuestMiddleware`, `csrf.verify`, `validator.make(RULES_REQUEST.LOGIN_RULES)`
    -   **Handler**: `AuthController.login` (Likely handles the actual login submission)
    -   **Description**: Processes the local login credentials.

## Dependencies

-   **Controllers**: `AuthController`
-   **Middleware**: `AuthMiddleware`, `GuestMiddleware`, `OtpMiddleware`, `JwtTokenMiddleware`, `csrf.verify`
-   **Libraries**: `express`, `passport`, `express-router`
-   **Utilities**: `validator`, `path.constant`, `rules.constant`
