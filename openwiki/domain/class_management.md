
# Class Management

This document outlines the Class Management domain, responsible for handling all aspects of academic classes within the project.

## Core Concepts

-   **Class**: Represents a specific course offering, potentially with a defined schedule, teacher, and enrolled students.
-   **Class Schedule**: Defines the timing and arrangement of class sessions.
-   **Student Enrollment**: Manages which students are part of a particular class.
-   **Teacher Assignment**: Assigns teachers to specific classes.

## Models and Database

The following models and database components are central to class management:

-   `src/models/class.js`: Defines the `Class` entity.
-   `src/models/class_schedule.js`: Defines `ClassSchedule` entities.
-   `src/models/student_class.js`: Manages the many-to-many relationship between students and classes.
-   `src/models/class_teachers.js`: Manages the many-to-many relationship between classes and teachers.
-   **Database Migrations**: Scripts in `src/database/migrations/` such as `*create-class.js`, `*create-class-schedule.js`, `*create-student-class.js`, and `*create-class-teachers.js` define the database structure. The migration `*add-deleteAt-field-table-course-and-class.js` indicates soft delete capabilities for class entities.

## Controllers and Services

-   **Controllers**: `src/http/controllers/web/admin/class.controller.js` handles the main business logic and request processing for class-related operations (creating, editing, deleting, managing students, etc.).
-   **Services**: `src/http/services/class.service.js` contains the underlying business logic that controllers delegate to.

## Views

The user interface for class management is primarily built using EJS templates located in `src/resources/views/admin/classes/`. This includes views for:

-   Listing classes (`index.ejs`)
-   Creating new classes (`create.ejs`)
-   Editing existing classes (`edit.ejs`)
-   Adding/managing students (`addStudent.ejs`, `editStudent.ejs`)
-   Viewing class details (`details.ejs`)
-   Importing/exporting class data (`import.ejs`)

## Key Operations

The Class Management domain supports the following operations:

-   Creating, reading, updating, and deleting (CRUD) classes.
-   Assigning teachers to classes.
-   Enrolling students into classes.
-   Managing class schedules.
-   Importing and exporting class data via Excel (`src/utils/fileExcel.js`, `classService.importClasses`/`handleExportClasses`).
-   Managing exercises, questions/comments, and attendance related to specific classes (see the [Exercise and Attendance](exercise_and_attendance.md) domain).

## Related Domains

-   **User Management**: Teachers and students are users managed by the User Management domain.
-   **Course Management**: Classes are often associated with specific courses.
-   **Exercise and Attendance**: These are often components managed within the context of a class.
