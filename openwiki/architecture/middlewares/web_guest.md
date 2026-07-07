# Web Guest Middleware (`src/http/middlewares/web/guest.middleware.js`)

The `guest.middleware.js` file implements middleware designed to protect public routes (like login and registration pages) from already authenticated users. It ensures that only users who are not logged in can access these pages.

## Functionality

1.  **Initial Check**:
    -   It first checks for the presence of a `token` cookie or if `req.session.firstLogin` is set to `true`.
    -   If either condition is true, it assumes the user is authenticated or is undergoing a first-time login process and calls `next()`, allowing access to the guest-only routes.

2.  **Token Validation**:
    -   If the initial check does not grant access (i.e., no token or `firstLogin` is false), it attempts to validate the `tokenCookie` using `tokenService.findByToken()`.

3.  **Redirection Logic**:
    -   **Invalid Token**: If the token is invalid or not found, the `token` cookie is cleared, and the user is redirected to the login page (`REDIRECT_PATH.AUTH.LOGIN`).
    -   **Valid Token (Already Authenticated)**: If the token is valid, the middleware uses `classifyRedirect` to determine the appropriate landing page based on the user's type (`req.user.Type.name`). This redirects authenticated users away from guest pages to their respective dashboards (e.g., admin, teacher, student home pages).

## Dependencies

-   `../../../constants/path.constant`: Defines redirect paths.
-   `../../services/token.service`: Service for token validation.
-   `../../../utils/classifyRedirect`: Utility function to determine the correct redirect path based on user role.

## Usage

This middleware should be applied to routes that should only be accessible by unauthenticated users. For instance, login, registration, and password reset pages.

```javascript
// In a route file (e.g., auth.routes.js)
const guestMiddleware = require('../../http/middlewares/web/guest.middleware');

// Apply middleware to public routes
router.get('/login', guestMiddleware, (req, res) => {
  // Render login page
});

router.get('/register', guestMiddleware, (req, res) => {
  // Render registration page
});
```
