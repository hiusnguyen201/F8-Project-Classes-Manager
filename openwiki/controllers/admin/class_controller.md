# Admin Class Controller (`src/http/controllers/web/admin/class.controller.js`)

This controller manages class-related operations within the administrator panel, covering class details, student management, calendar/attendance, exercises, questions, and comments. It utilizes `ClassService`, `UserService`, `CourseService`, and `LearningStatusService`.

## Actions

### 1. List Classes

-   **Route**: `GET /` (within admin class routes)
-   **Handler**: `index(req, res, next)`
-   **Functionality**:
    -   Fetches classes with pagination and search using `classService.findAllWithSearchAndPaginate`.
    -   Renders the class list view (`RENDER_PATH.ADMIN.HOME_CLASSES`).
    -   Passes `classes`, `meta` information, flash messages, CSRF token, and utility functions to the view.

### 2. Class Details

-   **Route**: `GET /details/:id`
-   **Handler**: `details(req, res, next)`
-   **Functionality**:
    -   Fetches class details using `classService.findById`.
    -   Renders the class details view (`RENDER_PATH.ADMIN.DETAILS_CLASS`).

### 3. Create Class

-   **Route**: `GET /create`
-   **Handler**: `create(req, res)`
-   **Functionality**: Renders the form for creating a new class (`RENDER_PATH.ADMIN.CREATE_CLASS`). Fetches `courses` and `teachers` for dropdowns.
-   **Route**: `POST /create`
-   **Handler**: `handleCreateClass(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE)`
-   **Functionality**: Processes the class creation form submission using `classService.create`.

### 4. Edit Class

-   **Route**: `GET /edit/:id`
-   **Handler**: `edit(req, res, next)`
-   **Functionality**: Fetches class data, courses, and teachers; renders the edit class form (`RENDER_PATH.ADMIN.EDIT_CLASS`).
-   **Route**: `PATCH /edit/:id`
-   **Handler**: `handleEditClass(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT)`
-   **Functionality**: Processes the class update form submission using `classService.update`.

### 5. Delete Classes

-   **Route**: `DELETE /`
-   **Handler**: `handleDeleteClasses(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Processes deletion of selected classes using `classService.removeClasses`.

### 6. Import/Export Classes

-   **Route**: `GET /import`
-   **Handler**: `importClassesPage(req, res)`
-   **Functionality**: Renders the import page (`RENDER_PATH.ADMIN.IMPORT_CLASSES`).
-   **Route**: `POST /import`
-   **Handler**: `handleImportClasses(req, res, next)`
-   **Middleware**: `fileMiddleware`, `validator.file("excel")`
-   **Functionality**: Processes Excel file uploads for class import using `classService.importClasses`.
-   **Route**: `GET /export`
-   **Handler**: `handleExportClasses(req, res, next)`
-   **Functionality**: Exports class data to an Excel file.

### 7. Manage Students within a Class

-   **Route**: `GET /details/:id/students`
-   **Handler**: `manageStudentsPage(req, res, next)`
-   **Functionality**: Renders the page to manage students enrolled in a class. Fetches class details, students, and learning statuses.

-   **Route**: `GET /details/:id/students/add`
-   **Handler**: `addStudentPage(req, res)`
-   **Functionality**: Renders the form to add students to a class.

-   **Route**: `POST /details/:id/students/add`
-   **Handler**: `handleAddStudents(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.ADD_STUDENT)`
-   **Functionality**: Processes adding students to a class using `classService.addStudent`.

-   **Route**: `GET /details/:id/students/edit/:studentClass`
-   **Handler**: `editStudentPage(req, res)`
-   **Functionality**: Renders the form to edit a student's enrollment details in a class.

-   **Route**: `PATCH /details/:id/students/edit/:studentClass`
-   **Handler**: `handleEditStudent(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_STUDENT)`
-   **Functionality**: Processes editing a student's enrollment using `classService.editStudent`.

-   **Route**: `DELETE /details/:id/students`
-   **Handler**: `handleDeleteStudentsClass(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Handles removing students from a class using `classService.removeStudentsClass`.

### 8. Manage Calendars / Attendance

-   **Route**: `GET /details/:id/calendars`
-   **Handler**: `manageCalendarsPage(req, res, next)`
-   **Functionality**: Renders the page to manage class calendars, fetching class details and schedules.

-   **Route**: `GET /details/:id/calendars/:calendarId`
-   **Handler**: `attendancePage(req, res, next)`
-   **Functionality**: Displays attendance information for a specific calendar entry, fetching attendance data and student details.

-   **Route**: `PATCH /details/:id/calendars/:calendarId`
-   **Handler**: `handleAttendanceCalendar(req, res, next)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Handles updating attendance records using `classService.updateAttendance`.

### 9. Manage Exercises

-   **Route**: `GET /details/:id/exercises`
-   **Handler**: `manageExercisesPage(req, res, next)`
-   **Functionality**: Renders the page to manage exercises for a class, fetching exercises and class details.

-   **Route**: `GET /details/:id/exercises/details/:exerciseId`
-   **Handler**: `detailsExercisePage(req, res, next)`
-   **Functionality**: Displays details of a specific exercise, including submissions, using `classService.findExerciseById`.

-   **Route**: `GET /details/:id/exercises/create`
-   **Handler**: `createExercisePage(req, res)`
-   **Functionality**: Renders the form to create a new exercise for a class.

-   **Route**: `POST /details/:id/exercises/create`
-   **Handler**: `handleCreateExercise(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_EXERCISE)`
-   **Functionality**: Processes exercise creation using `classService.createExercise`.

-   **Route**: `GET /details/:id/exercises/edit/:exerciseId`
-   **Handler**: `editExercisePage(req, res)`
-   **Functionality**: Renders the form to edit an existing exercise.

-   **Route**: `PATCH /details/:id/exercises/edit/:exerciseId`
-   **Handler**: `handleEditExercise(req, res, next)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_EXERCISE)`
-   **Functionality**: Processes exercise edits using `classService.updateExercise`.

-   **Route**: `DELETE /details/:id/exercises`
-   **Handler**: `handleDeleteExercises(req, res)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Deletes one or more exercises (`req.body.id`, single id or array) via `classService.deleteExercise`.

### 10. Student Exercise Submissions

-   **Route**: `POST /details/:id/exercises/details/:exerciseId`
-   **Handler**: `handleCreateSubmitExercise(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_SUBMIT_EXERCISE)`
-   **Functionality**: Records a student's submission for an exercise via `classService.createSubmitExercise`.

-   **Route**: `PATCH /details/:id/exercises/details/:exerciseId`
-   **Handler**: `handleEditSubmitExercise(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_SUBMIT_EXERCISE)`
-   **Functionality**: Updates an existing submission via `classService.updateSubmitExercise`.

-   **Route**: `DELETE /details/:id/exercises/details/:exerciseId`
-   **Handler**: `handleDeleteSubmitExercise(req, res)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Removes a submission via `classService.deleteSubmitExercise`.

### 11. Manage Questions

-   **Route**: `GET /details/:id/questions`
-   **Handler**: `manageQuestionsPage(req, res, next)`
-   **Functionality**: Renders the question list for a class (`RENDER_PATH.ADMIN.MANAGE_QUESTIONS_CLASS`), fetching questions via `classService.findAllComments(classObj.id, null)`.

-   **Route**: `DELETE /details/:id/questions`
-   **Handler**: `handleDeleteQuestions(req, res)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Deletes one or more questions (`req.body.id`) via `classService.removeQuestions`.

-   **Route**: `GET /details/:id/questions/create`
-   **Handler**: `createQuestionPage(req, res, next)`
-   **Functionality**: Renders the form to create a new question for a class.

-   **Route**: `POST /details/:id/questions/create`
-   **Handler**: `handleCreateQuestion(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_QUESTION)`
-   **Functionality**: Creates a question via `classService.createQuestion({ ...req.body, classId: req.params.id }, req.user)`.

-   **Route**: `GET /details/:id/questions/edit/:questionId`
-   **Handler**: `editQuestionPage(req, res, next)`
-   **Functionality**: Fetches the question via `classService.findQuestionById` and renders the edit form.

-   **Route**: `PATCH /details/:id/questions/edit/:questionId`
-   **Handler**: `handleEditQuestion(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_QUESTION)`
-   **Functionality**: Updates a question via `classService.updateQuestion`.

-   **Route**: `GET /details/:id/questions/details/:questionId`
-   **Handler**: `detailsQuestionPage(req, res, next)`
-   **Functionality**: Renders a question's detail page along with its comments, fetched via `classService.findQuestionById` and `classService.findAllCommentsByQuestionId`.

### 12. Comments (on Question Details)

-   **Route**: `POST /details/:id/questions/details/:commentId`
-   **Handler**: `handleCreateComment(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.CREATE_COMMENT)`
-   **Functionality**: Adds a comment via `classService.createComment(req.body, req.params.commentId, req.params.id, req.user)`. Note: despite the route segment name, this handler is mounted on the question-details page and the `:commentId` param here identifies the question being commented on.

-   **Route**: `PATCH /details/:id/questions/details/:commentId`
-   **Handler**: `handleEditComment(req, res)`
-   **Middleware**: `csrf.verify`, `validator.make(CLASS_RULES.EDIT_COMMENT)`
-   **Functionality**: Updates a comment via `classService.editComment`.

-   **Route**: `DELETE /details/:id/questions/details/:commentId`
-   **Handler**: `handleDeleteComments(req, res)`
-   **Middleware**: `csrf.verify`
-   **Functionality**: Deletes one or more comments via `classService.deleteComment(req.body)`.

## Dependencies

-   **Services**: `ClassService`, `UserService`, `CourseService`, `LearningStatusService`
-   **Middleware**: `csrf`, `validator`
-   **Utilities**: `stringUtil`, `fileExcel`, `moment`
-   **Constants**: `RENDER_PATH`, `REDIRECT_PATH`, `MESSAGE_ERROR`, `MESSAGE_SUCCESS`, `STATUS_CODE`, `ATTENDANCE_STATUS`, `FILE_NAME_EXPORT`, `SHEET_HEADERS_EXPORT`, `CLASS_RULES`
-   **Libraries**: `express`, `http-errors`

## Usage

This controller is invoked by the admin class routes (`/admin/classes`) to manage class-related functionalities and their sub-components.
