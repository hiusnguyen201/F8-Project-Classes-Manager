# Application Entrypoint (`src/app.js`)

The `src/app.js` file serves as the main entry point for the Node.js Express application. It is responsible for initializing the server, configuring middleware, setting up authentication, and defining the application's routing.

## Core Responsibilities

### 1. Environment and Configuration
- Loads environment variables using `dotenv.config()`.
- Sets up view engine (EJS) and layout support (`express-ejs-layouts`).

### 2. Middleware Setup
- **Security**:
    - `helmet()`: (Commented out) Headers for security.
    - `app.disable('x-powered-by')`: Hides the Express.js server signature.
- **Notifications**: `connect-flash` for displaying user feedback messages.
- **Session Management**: `express-session` for managing user sessions.
- **Request Logging**: `morgan` for logging incoming HTTP requests.
- **Request Body Parsing**:
    - `express.json()`: Parses JSON request bodies.
    - `express.urlencoded({ extended: true })`: Parses URL-encoded request bodies.
- **Static File Serving**: `express.static()` serves static assets from the `public/` directory.
- **HTTP Method Override**: `method-override` allows using HTTP methods like PUT and DELETE in contexts where they are not natively supported.

### 3. Authentication
- Integrates `passport.js` for handling user authentication.
- **Strategies**: Supports multiple authentication strategies:
    - Local (username/password)
    - Google OAuth
    - GitHub OAuth
    - Facebook OAuth
- **Session Handling**: Implements `passport.serializeUser` and `passport.deserializeUser` for managing user sessions.
- **Service Integration**: Uses `UserService` to find users during deserialization.

### 4. Routing
- **Web Routes**: Imports and registers routes for different sections of the web application:
    - Students (`./routes/web/students/index`)
    - Teachers (`./routes/web/teachers/index`)
    - Admin (`./routes/web/admin/index`)
    - Authentication (`./routes/web/auth/index`)
- **API Routes**: Placeholder comments indicate potential for API routes, though not explicitly defined in this file.

### 5. Authentication is currently disabled

- `app.use("/", (req, res, next) => { req.user = { id: 91, ..., Type: { name: "admin" } }; ... })` runs on **every** request before the web/admin/auth routers are mounted, hardcoding `req.user` to a fixed admin account (id `91`) and setting a dummy `token` cookie.
- The real authentication middleware is commented out: `// app.use(AuthMiddleware);`.
- Net effect: as the code currently stands, every request is treated as that hardcoded admin — Passport's login flow, sessions, and role checks are not actually enforced on requests. This looks like leftover local-dev scaffolding rather than intended behavior; treat any "who can access what" question with this in mind, and flag it before relying on `AuthMiddleware`/route-level auth guards being active.

## Key Files and Dependencies

-   `dotenv`
-   `express`
-   `express-ejs-layouts`
-   `express-flash`
-   `express-session`
-   `http-errors`
-   `method-override`
-   `morgan`
-   `passport`
-   `passport-*` strategies (local, google, github, facebook)
-   `cookie-parser`
-   `body-parser`
-   `./helpers/*`: Passport strategy implementations.
-   `./http/middlewares/web/auth.middleware`: Web authentication middleware.
-   `./routes/web/*`: Web route definitions.
-   `./http/services/user.service`: Service for user-related operations.

## How to Run

Refer to the [Quickstart Guide](../quickstart.md) for instructions on setting up and running the application.

## Development Considerations

-   The hardcoded `req.user` and disabled `AuthMiddleware` (see above) mean route-level authentication/authorization is currently bypassed for all requests — this needs to be reverted before relying on login/roles in any environment that matters.
-   API routes are mentioned via a `// Route Api` comment but not implemented anywhere in the file.
