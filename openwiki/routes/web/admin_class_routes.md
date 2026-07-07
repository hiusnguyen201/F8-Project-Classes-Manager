# Admin Class Management Routes (`src/routes/web/admin/classes.js`)

This file defines the routes for managing classes within the administrator panel. It offers comprehensive functionalities for class-level operations, including managing students, calendars, exercises, questions, and comments associated with each class.

## Route Definitions

### 1. Core Class Management

-   **`GET /`**
    -   **Handler**: `ClassController.index`
    -   **Description**: Displays a list of all classes, supporting pagination, search, and filtering.
-   **`GET /create`**
    -   **Handler**: `ClassController.create`
    -   **Description**: Renders the form for creating a new class.
-   **`POST /create`**
    -   **Handler**: `ClassController.handleCreateClass`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE)`
    -   **Description**: Processes the new class form submission, validates input, and creates the class.
-   **`GET /details/:id`**
    -   **Handler**: `ClassController.details`
    -   **Description**: Displays detailed information about a specific class (`:id`).
-   **`GET /edit/:id`**
    -   **Handler**: `ClassController.edit`
    -   **Description**: Renders the form for editing an existing class (`:id`).
-   **`PATCH /edit/:id`**
    -   **Handler**: `ClassController.handleEditClass`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT)`
    -   **Description**: Processes the update of an existing class's details.
-   **`DELETE /`**
    -   **Handler**: `ClassController.handleDeleteClasses`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Handles the deletion of one or more classes.

### 2. Import/Export Classes

-   **`GET /import`**
    -   **Handler**: `ClassController.importClassesPage`
    -   **Description**: Shows the interface for importing class data from a file.
-   **`POST /import`**
    -   **Handler**: `ClassController.handleImportClasses`
    -   **Middleware**: `fileMiddleware`, `validator.file("excel")`
    -   **Description**: Processes an uploaded Excel file for importing class data.
-   **`GET /export`**
    -   **Handler**: `ClassController.handleExportClasses`
    -   **Description**: Triggers the export of class data.

### 3. Student Management within a Class

-   **`GET /details/:id/students`**
    -   **Handler**: `ClassController.manageStudentsPage`
    -   **Description**: Displays the student management interface for a specific class (`:id`).
-   **`GET /details/:id/students/add`**
    -   **Handler**: `ClassController.addStudentPage`
    -   **Description**: Renders the form to add students to a specific class.
-   **`POST /details/:id/students/add`**
    -   **Handler**: `ClassController.handleAddStudents`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.ADD_STUDENT)`
    -   **Description**: Processes the addition of students to a class.
-   **`GET /details/:id/students/edit/:studentClass`**
    -   **Handler**: `ClassController.editStudentPage`
    -   **Description**: Renders the form to edit a student's enrollment details within a specific class.
-   **`PATCH /details/:id/students/edit/:studentClass`**
    -   **Handler**: `ClassController.handleEditStudent`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_STUDENT)`
    -   **Description**: Processes the update of a student's enrollment details in a class.
-   **`DELETE /details/:id/students`**
    -   **Handler**: `ClassController.handleDeleteStudentsClass`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Handles the removal of students from a class.

### 4. Calendar Management within a Class

-   **`GET /details/:id/calendars`**
    -   **Handler**: `ClassController.manageCalendarsPage`
    -   **Description**: Displays the calendar management view for a specific class.
-   **`GET /details/:id/calendars/:calendarId`**
    -   **Handler**: `ClassController.attendancePage`
    -   **Description**: Shows attendance details for a specific calendar entry (`:calendarId`) within a class.
-   **`PATCH /details/:id/calendars/:calendarId`**
    -   **Handler**: `ClassController.handleAttendanceCalendar`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Updates attendance records for a specific class calendar entry.

### 5. Exercise Management within a Class

-   **`GET /details/:id/exercises`**
    -   **Handler**: `ClassController.manageExercisesPage`
    -   **Description**: Displays the exercise management interface for a specific class.
-   **`GET /details/:id/exercises/details/:exerciseId`**
    -   **Handler**: `ClassController.detailsExercisePage`
    -   **Description**: Shows detailed information about a specific exercise (`:exerciseId`) within a class.
-   **`GET /details/:id/exercises/create`**
    -   **Handler**: `ClassController.createExercisePage`
    -   **Description**: Renders the form to create a new exercise for a specific class.
-   **`POST /details/:id/exercises/create`**
    -   **Handler**: `ClassController.handleCreateExercise`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_EXERCISE)`
    -   **Description**: Processes the creation of a new exercise for a class.
-   **`GET /details/:id/exercises/edit/:exerciseId`**
    -   **Handler**: `ClassController.editExercisePage`
    -   **Description**: Renders the form to edit an existing exercise (`:exerciseId`) within a class.
-   **`PATCH /details/:id/exercises/edit/:exerciseId`**
    -   **Handler**: `ClassController.handleEditExercise`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_EXERCISE)`
    -   **Description**: Processes the edits to an existing exercise.
-   **`DELETE /details/:id/exercises`**
    -   **Handler**: `ClassController.handleDeleteExercises`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Deletes one or more exercises from a class.

### 6. Student Exercise Submissions within a Class

-   **`POST /details/:id/exercises/details/:exerciseId`**
    -   **Handler**: `ClassController.handleCreateSubmitExercise`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_SUBMIT_EXERCISE)`
    -   **Description**: Records a student's submission for an exercise.
-   **`PATCH /details/:id/exercises/details/:exerciseId`**
    -   **Handler**: `ClassController.handleEditSubmitExercise`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_SUBMIT_EXERCISE)`
    -   **Description**: Updates an existing exercise submission.
-   **`DELETE /details/:id/exercises/details/:exerciseId`**
    -   **Handler**: `ClassController.handleDeleteSubmitExercise`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Deletes an exercise submission.

### 7. Question Management within a Class

-   **`GET /details/:id/questions`**
    -   **Handler**: `ClassController.manageQuestionsPage`
    -   **Description**: Displays the question management interface for a specific class.
-   **`DELETE /details/:id/questions`**
    -   **Handler**: `ClassController.handleDeleteQuestions`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Deletes one or more questions from a class.
-   **`GET /details/:id/questions/create`**
    -   **Handler**: `ClassController.createQuestionPage`
    -   **Description**: Renders the form to create a new question for a class.
-   **`POST /details/:id/questions/create`**
    -   **Handler**: `ClassController.handleCreateQuestion`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_QUESTION)`
    -   **Description**: Processes the creation of a new question for a class.
-   **`GET /details/:id/questions/edit/:questionId`**
    -   **Handler**: `ClassController.editQuestionPage`
    -   **Description**: Renders the form to edit an existing question (`:questionId`).
-   **`PATCH /details/:id/questions/edit/:questionId`**
    -   **Handler**: `ClassController.handleEditQuestion`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_QUESTION)`
    -   **Description**: Processes edits to an existing question.
-   **`GET /details/:id/questions/details/:questionId`**
    -   **Handler**: `ClassController.detailsQuestionPage`
    -   **Description**: Shows a question's details along with its comments.

### 8. Comments on Question Details

-   **`POST /details/:id/questions/details/:commentId`**
    -   **Handler**: `ClassController.handleCreateComment`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_COMMENT)`
    -   **Description**: Adds a comment to the question identified by `:commentId` (the route param name reflects the URL segment, not the entity — it is the question id).
-   **`PATCH /details/:id/questions/details/:commentId`**
    -   **Handler**: `ClassController.handleEditComment`
    -   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_COMMENT)`
    -   **Description**: Updates an existing comment.
-   **`DELETE /details/:id/questions/details/:commentId`**
    -   **Handler**: `ClassController.handleDeleteComments`
    -   **Middleware**: `csrf.verify`
    -   **Description**: Deletes one or more comments.

## Dependencies

-   **Controllers**: `ClassController` (from `src/http/controllers/web/admin/class.controller`)
-   **Middleware**: `csrf`, `fileMiddleware`, `validator`
-   **Constants**: `RULES_REQUEST.CLASS_RULES`
-   **Libraries**: `express`

## Usage

This router is typically mounted under `/admin/classes` in the main application file (`src/app.js`).
