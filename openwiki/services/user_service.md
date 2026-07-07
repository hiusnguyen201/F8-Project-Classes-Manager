# User Service (`src/http/services/user.service.js`)

The `UserService` class is responsible for handling all core business logic related to user management within the application. It interacts with the database models (`User`, `Type`) to perform operations such as user retrieval, creation, updates, password management, and email notifications.

## Core Functionalities

### 1. User Retrieval

-   **`countWithType(type)`**: Counts the number of users associated with a specific `type` (e.g., 'admin', 'student').
-   **`findById(id)`**: Retrieves a single user by their `id`. It excludes sensitive password information and includes the user's `Type`.
-   **`findByEmailWithPass(email)`**: Finds a user by `email`, returning the user object including their password and `Type`. This is primarily used for authentication.
-   **`findByEmail(email)`**: Finds a user by `email`, excluding the password but including their `Type`.
-   **`findAllWithTypesAndSearchAndPaginate(queryString, types)`**: Fetches a list of users with support for:
    -   **Pagination**: `page` and `limit` query parameters.
    -   **Search**: `keyword` parameter to search across `name`, `email`, and `phone` fields.
    -   **Filtering**: `types` parameter to filter users by their associated type.

### 2. Password Management

-   **`sendForgotPass(email)`**: Initiates the password reset process:
    -   Finds the user by email.
    -   Generates a unique password reset token.
    -   Sends a password reset email using utility functions.
-   **`resetPassword(email, password)`**: Updates the user's password after a successful reset process.

### 3. Account Management

-   **`sendActiveAccount(email)`**: Sends an account activation email to the user.
-   **`create(email, password, type = "student")`**: Creates a new user.
    -   Generates a hashed password.
    -   Associates the user with a specified `type` (defaults to 'student').
    -   Sends an account activation email.
-   **`update(id, data)`**: Updates an existing user's information. It excludes sensitive fields like `password` and `type` from being updated directly via this method.
-   **`remove(id)`**: Performs a soft delete on a user by their `id`.

## Dependencies

-   **Models**: `models.User`, `models.Type`
-   **Constants**: `MESSAGE_ERROR`, `MESSAGE_INFO`, `REDIRECT_PATH`, `LIMIT_PAGE`
-   **Utilities**: `moment`, `fileExcel`, `token`, `string` (for email templates), `sendMail`
-   **Services**: `TypeService`

## Usage Example (Conceptual)

```javascript
// In a controller or another service
const UserService = require('../services/user.service');
const userService = new UserService();

async function getUserDetails(req, res) {
  const userId = req.params.id;
  const user = await userService.findById(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
}
```
