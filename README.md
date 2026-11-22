# TaskMate – Smart Student Task Manager 🎓📱

TaskMate is a modern, student-centric mobile application designed to help engineering and college students organize academic assignments, lab submissions, exam preparation, group projects, and personal tasks in one unified workspace.

Developed as a college project for practical demonstration and viva examination, with a clean architecture, beginner-friendly codebase, and no unnecessary bloatware.

---

## 📌 Project Progress & Phase Checklist

| Phase | Description | Status |
| :--- | :--- | :---: |
| **Phase 1** | **Frontend Foundation & UI Architecture** (React Native, Expo Router, Screens, Navigation, Components, Local State) | **✅ COMPLETED** |
| **Phase 2** | **Backend, Database & Full API Integration** (Node.js, Express, MongoDB, Mongoose, JWT Auth, bcryptjs, REST APIs) | ⏳ Awaiting Approval |
| **Phase 3** | **Final Testing, Cloud Deployment & Android APK Build** (EAS Build, APK Generation, Submission Guide, Viva Q&A) | ⏳ Upcoming |

---

## 🚀 Phase 1 Overview: Frontend Foundation & UI

In **Phase 1**, we built the complete client-side architecture and interactive mobile user interface using **React Native**, **Expo**, and **Expo Router** using **pure JavaScript (JSX)**:

- 🎨 **Student-Friendly UI Design**: Clean light theme with rounded cards, subtle shadows, clear typography, and color-coded status/priority badges.
- 🧭 **File-Based Routing with Expo Router**: Declarative navigation with Stack and Bottom Tabs (`(tabs)`).
- 🔐 **Authentication Flows**:
  - `login.jsx`: Email & password validation, toggle visibility, and an **instant one-tap demo autofill** button designed for college viva examiners.
  - `register.jsx`: Full registration form (Name, College Email, Branch/Department, Password, Confirm Password) with real-time validation.
- 📊 **Student Dashboard (`(tabs)/index.jsx`)**:
  - Greeting banner personalized with the student's name and current date.
  - Semester Productivity progress bar showing completion rate percentage.
  - 4 interactive statistic cards: **Total Tasks**, **In Progress / Pending**, **Completed**, and **Overdue**.
  - Upcoming deadlines list with instant completion checkbox toggling.
  - Quick "+ New Task" shortcut button.
- 📋 **Task Management Screen (`(tabs)/tasks.jsx`)**:
  - Search bar filtering tasks by title and description in real-time.
  - Segmented status tabs (**All**, **Pending**, **Completed**).
  - Horizontal chip filter by **Category** (*Assignment, Exam, Project, Personal, Other*).
  - Horizontal chip filter by **Priority** (*High, Medium, Low*).
  - Due Date sorting toggle (Earliest deadline first vs Latest first).
  - Floating Action Button (+ New Task).
  - Deletion confirmation dialog ("Are you sure you want to delete...?").
- ➕ **Add Task Modal (`tasks/create.jsx`)**:
  - Full task creation with validation.
  - Category selector chips with matching brand colors.
  - Priority selector chips.
  - Due date picker with 1-tap presets (*Today*, *Tomorrow*, *In 3 Days*, *Next Week*).
- 🔍 **Task Details Screen (`tasks/[id].jsx`)**:
  - Complete details view with status banners, overdue warning indicators, description, and created dates.
  - Action buttons: "Mark as Completed / Pending", "Edit Task", and "Delete".
- ✏️ **Edit Task Screen (`tasks/edit.jsx`)**:
  - Pre-populated inputs to update title, description, category, priority, status, and deadline.
- 👤 **Student Profile Screen (`(tabs)/profile.jsx`)**:
  - Student avatar, department badge, academic task stats summary, college viva technical stack reference card, demo data reset button, and logout.

---

## 📂 Project Structure

```text
taskmate-student-manager/
├── app/                           # Expo Router file-based screens
│   ├── _layout.jsx                # Root layout (SafeAreaProvider, AuthProvider, Stack)
│   ├── index.jsx                  # Auth gate (redirects to tabs or login)
│   ├── login.jsx                  # Student Login screen with viva autofill
│   ├── register.jsx               # Student Registration screen
│   ├── (tabs)/                    # Bottom Tab Navigator
│   │   ├── _layout.jsx            # Tab bar configuration & icons
│   │   ├── index.jsx              # Dashboard screen
│   │   ├── tasks.jsx              # All tasks list, search, filters & sort
│   │   └── profile.jsx            # Student profile, stats, viva card & logout
│   └── tasks/                     # Task sub-routes
│       ├── create.jsx             # Add task form with deadline shortcuts
│       ├── [id].jsx               # Task details screen
│       └── edit.jsx               # Edit task form
├── components/                    # Reusable UI components
│   ├── CategoryBadge.jsx          # Academic category chips (Assignment, Exam, etc.)
│   ├── CustomButton.jsx           # Reusable button with variants, loaders & icons
│   ├── CustomInput.jsx            # Form input with icons, toggle eye & error labels
│   ├── EmptyState.jsx             # Friendly empty list illustration and CTA
│   ├── LoadingScreen.jsx          # Branded loading spinner
│   ├── PriorityBadge.jsx          # Color-coded priority pill (High, Medium, Low)
│   ├── StatCard.jsx               # Dashboard summary metrics card
│   └── TaskCard.jsx               # Interactive task item card with checkbox
├── constants/
│   └── colors.js                  # Central color palette (light theme)
├── context/
│   └── AuthContext.jsx            # Global auth state & AsyncStorage token persistence
├── services/
│   ├── api.js                     # Axios HTTP client with JWT interceptors
│   ├── authService.js             # Authentication API service (mock in Phase 1, Express in Phase 2)
│   └── taskService.js             # Task CRUD service with sample preview dataset
├── assets/                        # App icons, splash screens, and adaptive icons
├── app.json                       # Expo configuration file
├── babel.config.js                # Babel preset configuration
├── package.json                   # Project dependencies and npm scripts
└── README.md                      # Project documentation & viva guide
```

---

## 🛠️ Tech Stack (Phase 1)

- **Mobile Framework**: React Native
- **Tooling & Platform**: Expo SDK 58
- **Navigation**: Expo Router (file-based navigation with stack & bottom tabs)
- **Language**: JavaScript (JSX only, clean and beginner-friendly)
- **Styling**: React Native `StyleSheet` (no bloated styling libraries)
- **State Management**: React Context API (`AuthContext`) + React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- **HTTP Client**: Axios (configured in `services/api.js` for seamless Phase 2 backend connection)
- **Storage**: `@react-native-async-storage/async-storage` for local token caching

---

## 🏃 How to Run the App Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Expo Go** app installed on your physical Android phone (from Google Play Store), OR an Android Studio Emulator.

### 2. Start the Development Server
```bash
npm start
```
or:
```bash
npx expo start
```

### 3. Open the App on Your Device
- **Physical Android Phone**: Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.
- **Android Emulator**: Press `a` in your terminal to launch the Android emulator.
- **Web Preview**: Press `w` in your terminal to open in your web browser.

---

## 🧪 Manual Testing Instructions for Phase 1

1. **Auth Gate & Splash**:
   - Launching the app automatically verifies authentication and opens the **Dashboard** (using the preview student account).
2. **Dashboard Testing**:
   - Check the **Task Overview** numbers (Total, In Progress, Completed, Overdue).
   - Check the **Semester Productivity** progress bar.
   - Tap the checkbox on any upcoming task: notice the task immediately strikes through, and the completed count increases!
3. **Tasks List & Filtering**:
   - Switch to the **My Tasks** tab.
   - Type in the search box (e.g., "Lab" or "Revision") to verify instant search.
   - Tap the **Pending** or **Completed** tabs to filter tasks.
   - Tap category chips (*Assignment*, *Exam*, *Project*) or priority chips (*High*, *Medium*, *Low*).
   - Tap the sort icon to toggle between earliest and latest deadlines.
4. **Create a New Task**:
   - Tap the **+** Floating Action Button.
   - Enter a title (e.g., "Compiler Design Lab Viva").
   - Select a category and priority.
   - Tap one of the preset deadline pills (e.g. **Tomorrow** or **In 3 Days**).
   - Tap **Create Task**; observe the success alert and verify the new task appears in your task list.
5. **Task Details & Edit**:
   - Tap any task in the list to open its details view.
   - Tap **Mark as Completed / Mark as Pending**.
   - Tap **Edit Task**, modify the title or priority, and tap **Save Changes**.
   - Tap **Delete**, verify the confirmation prompt, and confirm deletion.
6. **Profile & Logout**:
   - Navigate to the **Profile** tab.
   - View your student details and project technical summary.
   - Tap **Log Out**; confirm the alert to return to the **Login** screen.
   - On the Login screen, tap **"Viva Test: Tap to Auto-Fill Student Credentials"** to test quick auto-fill, then tap **Log In**.
