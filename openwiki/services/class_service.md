# Class Service (`src/http/services/class.service.js`)

The `ClassService` is a core part of the application's backend, handling all business logic related to managing classes, courses, students, exercises, questions, comments, schedules, and attendance. It interacts with multiple Sequelize models to provide a range of data retrieval and manipulation functionalities.

## Core Functionalities

### 1. Class Management

-   **`countAll()`**: Returns the total number of classes in the system.
-   **`findAllWithSearchAndPaginate(queryString)`**: Retrieves a paginated list of classes, supports searching by class name (`keyword`), includes associated `Course` and `User` (teacher) details, and handles pagination parameters.
-   **`findById(id)`**: Fetches a specific class by its `id`. Includes details of the associated teacher (User), excluding password.
-   **`findAll()`**: Fetches all classes, including their `Class_Schedule` and `Course`.
-   **`create(data)`**: Creates a class within a transaction. Looks up the `Course` by `data.courseId`, throws if not found, and builds the class's schedule.
-   **`update(data, id, studentAttendance)`**: Updates an existing class's details.
-   **`removeClasses(listId)`**: Deletes one or more classes by id, first removing associated `Class_Schedule`, `Teacher_Calendar`, `User`, `Comment`, `Exercise`, and `Student_Class` associations.
-   **`importClasses(fileInfo, classFields)`**: Parses an uploaded Excel file (via `fileExcel.readFile`) and creates classes for rows whose class name doesn't already exist, resolving the course by name and converting schedule/time-learn columns into the shape `create()` expects.

### 2. Student Enrollment Management

-   **`addStudent(data, classId)`**: Enrolls a student into a class, checking `StudentClass` for an existing enrollment first.
-   **`findStudentInClass(id)`**: Fetches a `Student_Class` enrollment record by its own id.
-   **`editStudent(data, classId, studentClassId)`**: Updates an enrollment's status/dates, guards against double-enrollment, and re-points any existing attendance records for that student onto the new student id across the class's calendars.
-   **`removeStudentsClass(listId)`**: Removes enrollments by `Student_Class` id, deleting the student's attendance records first.

### 3. Exercise Management

-   **`findExerciseById(id)`**: Retrieves a specific exercise by its `id`, including the author (`User`) and all `Submit_Exercise` records (with the submitting user).
-   **`createExercise(data, classId, user)`**: Creates an `Exercise` owned by `user` (the teacher) within a class.
-   **`updateExercise(data, id)`**: Updates an exercise's title/attachment/content.
-   **`deleteExercise(listId)`**: Deletes exercises by id, removing their submissions first.
-   **`createSubmitExercise(data, user)`**: Creates a `Submit_Exercise` for the current (student) user against `data.exerciseId`.
-   **`updateSubmitExercise(data)`**: Updates a submission's attachment, keyed by `data.submitExerciseId`.
-   **`deleteSubmitExercise(data)`**: Deletes a submission, keyed by `data.submitExerciseId`.

### 4. Questions and Comments

Questions and comments share a single `Comment` model: a **question** is a `Comment` row with `parentId: null` and a `title`; a **comment/reply** is a `Comment` row with `parentId` set to the question's id and no title. This is why the question and comment routes/handlers both live under `/questions` and both ultimately call into `Comment`.

-   **`createQuestion(data, user)`**: Creates a top-level `Comment` (`parentId` implicitly null) for `data.classId`, authored by `user`.
-   **`findAllComments(classId, parent)`**: Fetches `Comment` rows for a class filtered by `parentId: parent` (pass `null` to list questions), including the author (`User`).
-   **`findQuestionById(id)`**: Fetches a single question — a `Comment` with `id` and `parentId: null` — including the author.
-   **`findAllCommentsByQuestionId(id)`**: Fetches all reply comments (`parentId: id`) for a given question.
-   **`updateQuestion(data, id)`**: Updates a question's title/content.
-   **`removeQuestions(listId)`**: Deletes questions by id, first deleting their reply comments (`Comment.destroy({ where: { parentId: id } })`), then the question itself.
-   **`createComment(data, parentId, classId, user)`**: Creates a reply `Comment` under `parentId` (the question id).
-   **`editComment(data)`**: Updates a comment's content, keyed by `data.commentId`.
-   **`deleteComment(data)`**: Deletes a comment, keyed by `data.commentId`.

### 5. Attendance and Calendars

-   **`findCalendarById(id)`**: Fetches a `Teacher_Calendar` entry by id, including its `Student_Attendance` records and the associated `User`.
-   **`updateAttendance(data, calendarId)`**: Bulk-updates `Student_Attendance.status` for the students/statuses passed in `data.studentId`/`data.status` (parallel arrays), scoped to `calendarId`.

## Dependencies

-   **Models**: `Class`, `Course`, `User`, `Class_Schedule`, `Student_Attendance`, `Student_Class`, `Teacher_Calendar`, `Exercise`, `Submit_Exercise`, `Comment`.
-   **Constants**: `MESSAGE_ERROR`.
-   **Utilities**: `moment`, `fileExcel`.
