# TaskMate – Smart Student Task Manager 🎓📱

TaskMate is a modern, student-centric mobile application designed to help engineering and college students organize academic assignments, lab submissions, exam preparation, group projects, and personal tasks in one unified workspace.

Developed as a college project for practical demonstration and viva examination, with a clean architecture, beginner-friendly codebase, and no unnecessary bloatware.

---

## 📌 Project Progress & Phase Checklist

| Phase | Description | Status |
| :--- | :--- | :---: |
| **Phase 1** | **Frontend Foundation & UI Architecture** (React Native, Expo Router, Screens, Navigation, Components, Local State) | **✅ COMPLETED** |
| **Phase 2** | **Backend, Database & Full API Integration** (Node.js, Express, MongoDB, Mongoose, JWT Auth, bcryptjs, REST APIs) | **✅ COMPLETED** |
| **Phase 3** | **Final Testing, Cloud Deployment & Android APK Build** (EAS Build, APK Generation, Submission Guide, Viva Q&A) | ⏳ Awaiting Approval |

---

## 🚀 Phase 2 Overview: Backend, Database & Integration

In **Phase 2**, we built the complete backend server and connected the React Native mobile frontend to live REST APIs backed by MongoDB:

1. **Node.js & Express.js REST API**:
   - Clean MVC (Model-View-Controller) backend architecture.
   - Centralized database configuration (`config/db.js`) using Mongoose ODM.
   - CORS enabled for cross-platform access.
   - Centralized error-handling middleware (`errorMiddleware.js`) translating Mongoose validation errors, duplicate keys, and invalid ObjectIds into clean HTTP error responses.
2. **Database Models & Data Validation**:
   - **User Model (`models/User.js`)**: Name, unique college email, department/branch, and password hashed automatically with `bcryptjs` (10 salt rounds) before saving.
   - **Task Model (`models/Task.js`)**: Title, description, category enum (*Assignment, Exam, Project, Personal, Other*), priority enum (*Low, Medium, High*), due date (YYYY-MM-DD), status (*Pending, Completed*), and student reference `user` ObjectId.
3. **JWT Authentication & Security**:
   - Custom `generateToken.js` utility signing tokens with `process.env.JWT_SECRET` (30-day expiry).
   - `authMiddleware.js` (`protect`) verifying Bearer tokens and attaching `req.user` to incoming requests.
   - **Strict Data Isolation**: Students can **only** view, create, edit, or delete their own tasks. Cross-user data modification attempts return `403 Forbidden`.
4. **End-to-End Frontend Integration**:
   - Replaced preview mock state with real Axios HTTP calls in `services/taskService.js` and `services/authService.js`.
   - `services/api.js` automatically detects whether the app is running on Android Studio Emulator (`10.0.2.2`), a local web browser (`localhost`), or a physical Android phone over local Wi-Fi.
   - Global `AuthContext.jsx` manages persistent login state via `@react-native-async-storage/async-storage` and verifies session tokens against `GET /api/auth/me`.
   - Real-time Dashboard calculation of Total, Pending, Completed, and Overdue tasks directly from MongoDB documents.
   - Verified with an automated test suite (`backend/test-api.js`) and database seeder (`backend/seed.js`).

---

## 📂 Project Architecture

```text
taskmate-student-manager/
├── backend/                       # Node.js + Express + MongoDB Backend
│   ├── config/
│   │   └── db.js                  # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js      # Student registration, login & profile
│   │   └── taskController.js      # Task CRUD operations & ownership checks
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT Bearer token verification
│   │   └── errorMiddleware.js     # Standardized JSON error handler
│   ├── models/
│   │   ├── User.js                # Student schema with bcrypt hashing
│   │   └── Task.js                # Task schema with user reference
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   └── taskRoutes.js          # /api/tasks endpoints
│   ├── utils/
│   │   └── generateToken.js       # JWT signing utility
│   ├── .env.example               # Template environment variables
│   ├── package.json               # Backend dependencies
│   ├── seed.js                    # Database seeder (creates default demo student & tasks)
│   ├── server.js                  # Main Express server entry point
│   └── test-api.js                # Automated backend test suite (9 passing tests)
├── app/                           # Expo Router file-based screens
│   ├── _layout.jsx                # Root layout (SafeAreaProvider, AuthProvider, Stack)
│   ├── index.jsx                  # Auth gate (redirects to tabs or login)
│   ├── login.jsx                  # Student Login screen with viva autofill
│   ├── register.jsx               # Student Registration screen
│   ├── (tabs)/                    # Bottom Tab Navigator
│   │   ├── _layout.jsx            # Tab bar configuration & icons
│   │   ├── index.jsx              # Dashboard with real MongoDB statistics
│   │   ├── tasks.jsx              # All tasks list, search, filters & sort
│   │   └── profile.jsx            # Student profile, stats & logout
│   └── tasks/                     # Task sub-routes
│       ├── create.jsx             # Add task form with deadline shortcuts
│       ├── [id].jsx               # Dynamic task details view
│       └── edit.jsx               # Edit task form
├── components/                    # Reusable UI components
├── constants/
│   └── colors.js                  # Light-theme design system
├── context/
│   └── AuthContext.jsx            # Global auth state & AsyncStorage token persistence
├── services/
│   ├── api.js                     # Axios HTTP client with dynamic IP resolution
│   ├── authService.js             # Live authentication API calls
│   └── taskService.js             # Live task CRUD API calls
├── assets/                        # Icons and splash images
├── app.json                       # Expo configuration
├── package.json                   # Mobile app dependencies
└── README.md                      # Complete project documentation
```

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:
`Authorization: Bearer <your_jwt_token>`

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new student (`name`, `email`, `department`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate student and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch currently logged-in student profile |

### Task Endpoints (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/tasks` | Protected | Fetch tasks for authenticated student (supports `?status=`, `?category=`, `?priority=`, `?search=`, `?sort=`) |
| `POST` | `/api/tasks` | Protected | Create new task (`title`, `description`, `category`, `priority`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Protected | Fetch single task by ID (validates ownership) |
| `PUT` | `/api/tasks/:id` | Protected | Update task fields / toggle status (validates ownership) |
| `DELETE` | `/api/tasks/:id` | Protected | Delete task (validates ownership) |

### Health Endpoint
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Returns server health status and timestamp |

---

## 🔄 How Frontend and Backend Communicate

1. **Authentication Flow**:
   - The user enters credentials on `app/login.jsx` or `app/register.jsx`.
   - `authService.js` makes an Axios POST request to `/api/auth/login`.
   - The backend validates the password using `bcrypt.compare` against the salted hash in MongoDB.
   - On success, the backend generates a JWT token and sends it back with the user object.
   - `AuthContext.jsx` saves this token to `AsyncStorage` and updates the React state.
2. **Protected API Requests**:
   - The Axios request interceptor in `services/api.js` automatically reads the token from `AsyncStorage` and attaches `Authorization: Bearer <token>` to every outgoing request.
   - The Express middleware `authMiddleware.js` decodes and verifies the token, finds the student in MongoDB, and attaches `req.user`.
3. **Data Isolation (Crucial for Viva)**:
   - When fetching or modifying tasks, the controller queries `{ user: req.user._id }`.
   - If a student tries to access or delete a task belonging to another user ID, the backend rejects it with `403 Forbidden`.
4. **Real-Time Dashboard Calculation**:
   - The Dashboard (`(tabs)/index.jsx`) calls `taskService.getTasks()`.
   - Total, completed, pending, and overdue counts are calculated directly from the student's live MongoDB documents and displayed across the StatCards and progress bar.

---

## 🧪 Testing the Backend & Database

### 1. Run Automated Backend API Tests
In your terminal, run:
```bash
node backend/test-api.js
```
This script automatically executes 9 tests covering:
- Health check
- Student registration
- Student login
- Profile retrieval (`/api/auth/me`)
- Task creation
- Task listing
- Task updating
- **Data privacy & security verification** (verifies that User 2 receives 403 Forbidden when trying to access User 1's task)
- Task deletion

### 2. Seed Default Demo Student Data
```bash
node backend/seed.js
```
Seeds MongoDB with:
- **Email**: `alex.student@college.edu`
- **Password**: `student123`
- Pre-populated tasks for viva demonstration.

### 3. Run the Mobile App
```bash
npx expo start
```
- Tap **"Viva Test: Tap to Auto-Fill Student Credentials"** on the login screen.
- Tap **Log In** to connect live to MongoDB!
