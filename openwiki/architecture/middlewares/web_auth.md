# Web Authentication Middleware (`src/http/middlewares/web/auth.middleware.js`)

The `auth.middleware.js` file implements middleware for authenticating users in web routes. It ensures that only authenticated users can access protected resources.

## Functionality

1.  **User Existence Check**:
    -   Verifies if `req.user` is populated. If not, it indicates an unauthenticated session.
    -   Clears the `token` cookie and redirects to the login page (`REDIRECT_PATH.AUTH.LOGIN`).

2.  **Token Presence Check**:
    -   Retrieves the `token` from the request cookies.
    -   If the token is absent, the user is redirected to the login page.

3.  **Token Validation**:
    -   Uses the `TokenService` to check the validity of the token by querying the database (`tokenService.findByToken(tokenCookie)`).
    -   If the token is invalid or not found, the `token` cookie is cleared, and the user is redirected to the login page.

4.  **Error Handling**:
    -   Includes a `try...catch` block to handle potential errors during token verification.
    -   In case of an error, it logs the error, flashes an error message using `req.flash()`, and redirects to the login page.

5.  **Proceed to Next Handler**:
    -   If all authentication checks pass, `next()` is called, allowing the request to proceed to the intended route handler.

## Dependencies

-   `../../services/token.service`: Service for token-related database operations.
-   `../../../constants/path.constant`: Defines redirect paths.
-   `../../../constants/message.constant`: Defines error messages.

## Usage

This middleware should be applied to routes that require user authentication. For example:

```javascript
// In a route file (e.g., students.routes.js)
const authMiddleware = require('../../http/middlewares/web/auth.middleware');

// Apply middleware to a specific route or a group of routes
router.get('/students', authMiddleware, (req, res) => {
  // Protected route logic
});
```
