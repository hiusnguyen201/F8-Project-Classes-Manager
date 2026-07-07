# Admin Setting Controller (`src/http/controllers/web/admin/setting.controller.js`)

Handles the administrator's own account settings: profile editing, password changes, and security/social-account management. Backed by `UserService` and `SocialService`.

## Actions

### 1. Profile

- **`profile(req, res, next)`** — renders the profile edit form (`RENDER_PATH.ADMIN.PROFILE_SETTING`) with the current user's data, flashed old values, and validation errors.
- **`handleEditProfile(req, res)`** — calls `userService.update(req.body, req.user.id)`, flashes success/error, and redirects back to the profile page.

### 2. Security

- **`security(req, res, next)`** — renders the security page (`RENDER_PATH.ADMIN.SECURITY_SETTING`), listing the admin's linked social accounts via `SocialService.findAll(user.id, LIST_SOCIALS)`.
- **`handleRemoveUserSocial(req, res)`** — unlinks a social provider via `userSocialService.delete(req.body.provider, req.user.id)`, flashes success/error, and redirects back to the security page.

### 3. Password

- **`password(req, res, next)`** — renders the password change form (`RENDER_PATH.ADMIN.PASSWORD_SETTING`).
- **`handleChangePassword(req, res)`** — hashes the new password with `createHashByBcrypt` and calls `userService.update(...)`, flashes success/error, and redirects back to the password page.

All render/redirect actions catch errors and either forward a `500` via `createHttpError(STATUS_CODE.SERVER_ERROR)` (render actions) or flash an error message and redirect (mutation actions).

## Dependencies

- **Services**: `SocialService` (linked-account listing/removal), `UserService` (profile + password updates)
- **Constants**: `RENDER_PATH`, `REDIRECT_PATH`, `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `STATUS_CODE`, `LIST_SOCIALS`
- **Utils**: `stringUtil`, `createHashByBcrypt`
- **Middleware**: `csrf` (passed into views for form tokens)

## Usage

Mounted under the admin settings routes — see [Admin Settings Routes](../../routes/web/admin_settings_routes.md) for the exact route-to-action mapping.
