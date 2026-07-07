
# Course Management

This section describes the Course Management domain within the Classes Manager project. It covers how courses and their related modules are structured and managed.

## Courses

Courses are the primary organizational units for educational content.

-   **Model**: `src/models/course.js` defines the structure of a course.
-   **Database Migrations**: `src/database/migrations/*create-course.js` and `*add-deleteAt-field-table-course-and-class.js` manage the course table schema, including soft deletes.
-   **Controllers**: `src/http/controllers/web/admin/course.controller.js` handles administrative operations for courses (CRUD).
-   **Services**: `src/http/services/course.service.js` contains the business logic for course operations.
-   **Views**: `src/resources/views/admin/courses/` contains EJS templates for managing courses (index, create, edit, import, delete).

## Course Modules

Courses can be broken down into modules, providing a hierarchical structure for learning content.

-   **Model**: `src/models/course_module.js` defines the structure of a course module.
-   **Database Migrations**: `src/database/migrations/*create-course-module.js` manages the course module table schema.
-   **Controllers**: Handled within `src/http/controllers/web/admin/course.controller.js` in conjunction with course management.
-   **Views**: `src/resources/views/admin/courses/createModule.ejs`, `editModule.ejs`, and `deleteModule.modal.ejs`.

## Module Documents

Modules can have associated documents.

-   **Model**: `src/models/module_document.js` defines the structure for documents linked to modules.
-   **Database Migrations**: `src/database/migrations/*add-name-field-table-module_documents.js` for schema changes related to module documents.

## File Handling

-   `src/http/middlewares/web/file.middleware.js`: Middleware for handling file uploads (used by import routes, e.g. course/class Excel import).
-   `src/utils/fileExcel.js`: Utility for reading/writing Excel files, used for course/class import and export.
-   `src/constants/fileExcel.constant.js`: Field/header definitions consumed by `fileExcel.js` for each importable/exportable entity.

This domain focuses on structuring educational content hierarchically, from broad courses down to individual modules and their associated learning materials.
