# Token Service (`src/http/services/token.service.js`)

The `TokenService` is responsible for managing authentication tokens, primarily used for session management and potentially API authentication. It interacts with the `Login_Token` and `User` database models to create, find, and remove tokens.

## Core Functionalities

### 1. Token Retrieval

-   **`findByToken(token)`**: Searches for a login token by its unique `token` value. If found, it returns the token record along with the associated `User` data.
-   **`findByUserId(userId)`**: Finds an existing login token associated with a specific `userId`.

### 2. Token Creation

-   **`create(userId)`**:
    -   First, it checks if a token already exists for the provided `userId`. If it does, the existing token is destroyed to ensure only one active token per user.
    -   A new token is generated using the `tokenUtil.createTokenByMd5()` utility.
    -   A new record is created in the `Login_Token` table, linking the generated `token` with the `userId`.
    -   The newly created token record is returned.

### 3. Token Removal

-   **`remove(token)`**:
    -   Searches for a login token using its `token` value.
    -   If the token is found, it is removed (destroyed) from the database.
    -   If the token is not found, an error (`MESSAGE_ERROR.TOKEN.LOGIN_TOKEN_NOT_FOUND`) is thrown.

## Dependencies

-   **Models**: `models.Login_Token`, `models.User`
-   **Utilities**: `tokenUtil` (for token generation), `MESSAGE_ERROR` (for error messages)

## Usage Example (Conceptual)

```javascript
// In an authentication controller after successful login
const TokenService = require('../services/token.service');
const tokenService = new TokenService();
const UserService = require('../services/user.service'); // Assuming UserService is used elsewhere for getting user ID
const userService = new UserService();

async function handleLoginSuccess(req, res) {
  const userId = req.user.id; // Assuming req.user is populated after authentication
  try {
    const newToken = await tokenService.create(userId);
    // Set the token in a cookie
    res.cookie('token', newToken.token, { httpOnly: true });
    // Redirect user or send success response
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Failed to create token:", error);
    res.status(500).send("Login failed. Please try again.");
  }
}
```
