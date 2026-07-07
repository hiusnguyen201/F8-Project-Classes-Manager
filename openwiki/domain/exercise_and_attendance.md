
# Exercise and Attendance Management

This section covers the management of exercises, submissions, and student attendance within the Classes Manager project.

## Exercises and Submissions

This functionality allows for the creation of exercises and the submission of work by students.

-   **Models**:
    -   `src/models/exercise.js`: Defines an exercise, owned by a teacher (`User`) within a class.
    -   `src/models/submit_exercise.js`: Records student submissions for exercises.
-   **Database Migrations**: `src/database/migrations/*create-exercise.js` and `*create-submit-exercise.js` define the relevant database tables.
-   **Controllers**: Handled within `src/http/controllers/web/admin/class.controller.js` (manage/create/edit/delete exercises, plus create/edit/delete submissions).
-   **Services**: `ClassService` in `src/http/services/class.service.js` — see [Class Service](../services/class_service.md) for the exact methods.
-   **Views**: `src/resources/views/admin/classes/` — `manageExercises.ejs`, `createExercise.ejs`, `editExercise.ejs`, `detailsExercise.ejs`, and `deleteSubmitExercise.modal.ejs`.

## Questions and Comments

Each class has a Q&A-style thread: admins/teachers can post questions and reply with comments. Both are stored in a single `Comment` model — a question is a `Comment` with `parentId: null` and a `title`; a comment/reply is a `Comment` with `parentId` set to the question's id.

-   **Model**: `src/models/comment.js` (self-referential via `parentId`).
-   **Database Migration**: `src/database/migrations/*create-comment.js`.
-   **Controllers**: `ClassController` — `manageQuestionsPage`, `createQuestionPage`/`handleCreateQuestion`, `editQuestionPage`/`handleEditQuestion`, `detailsQuestionPage`, `handleDeleteQuestions`, `handleCreateComment`/`handleEditComment`/`handleDeleteComments`.
-   **Services**: `ClassService.createQuestion`, `findAllComments`, `findQuestionById`, `findAllCommentsByQuestionId`, `updateQuestion`, `removeQuestions`, `createComment`, `editComment`, `deleteComment` — see [Class Service](../services/class_service.md).
-   **Views**: `src/resources/views/admin/classes/` — `manageQuestions.ejs`, `createQuestion.ejs`, `editQuestion.ejs`, `detailsQuestion.ejs`, `deleteQuestion.modal.ejs`, `deleteComment` modal.

## Attendance Tracking

This feature enables the recording of student attendance for classes.

-   **Models**:
    -   `src/models/teacher_calendar.js` (`Teacher_Calendar`): one calendar entry per scheduled class session, belonging to a `User` (teacher) and a `Class`, with many `Student_Attendance` records.
    -   `src/models/student_attendance.js` (`Student_Attendance`): one attendance status per student per calendar entry.
-   **Database Migrations**: `src/database/migrations/*create-teacher-calender.js` and `*create-student-attendance.js` define the schema.
-   **Controllers**: `ClassController.manageCalendarsPage`, `attendancePage`, `handleAttendanceCalendar` in `src/http/controllers/web/admin/class.controller.js`.
-   **Services**: `ClassService.findCalendarById` and `updateAttendance` — see [Class Service](../services/class_service.md).
-   **Views**: `src/resources/views/admin/classes/calendarsAttendance.ejs`, rendered both for `attendancePage` (`RENDER_PATH.ADMIN.CALENDAR_ATTENDANCES`) and reused for the calendar list.

This domain focuses on the academic activities conducted within a class, providing tools for assessment and record-keeping.
