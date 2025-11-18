
#  EdTech Learning Task Manager – Full-Stack Assignment (React + Node + MongoDB)

A complete role-based Learning Task Manager built for the EdTech Take-Home Assignment.
This application supports **Students** and **Teachers** with different access levels such as viewing, creating, updating, and deleting tasks.


# **Project Overview**

This project implements a secure and scalable **role-based task management system** for an EdTech environment:

###  **Students**

* Can **view, create, update, delete only their own tasks**
* Must enter **teacherId** while signing up (mandatory)
* Cannot see tasks created by teachers or other students

###  **Teachers**

* Can **view all tasks created by students assigned to them**
* Can **view, create, update, delete their own tasks**
* Cannot modify student tasks

###  Includes:

* JWT Authentication
* Role-based Authorization
* Password hashing with bcrypt
* Express validation
* Centralized error handling
* Professional UI (React + Tailwind)

---

#  **Tech Stack**

### **Frontend**

* React (Vite)
* Tailwind CSS
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* bcrypt (password hashing)
* JWT (secure authentication)
* express-validator (input validation)
* CORS, Helmet, Morgan

---

# **Project Folder Structure**

```
root/
│
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── index.css
│
├── server/                 # Backend (Node.js)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/db.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

#  **Setup Instructions**

## 1️ Clone the Repository

```
git clone <your-repo-link>
cd task-manager
```

---

## 2️ Backend Setup

Go to the backend folder:

```
cd server
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=yourSecretKey
JWT_EXPIRES_IN=7d
PORT=5000
```

Start backend:

```
npm run dev
```

Backend runs on → **[http://localhost:5000](http://localhost:5000)**

---

## Frontend Setup

Go to the frontend folder:

```
cd client
npm install
npm run dev
```

Frontend runs on → **[http://localhost:5173](http://localhost:5173)**

---

# **Authentication & Authorization Flow**

### User signs up

Password is hashed using bcrypt.

###  User logs in

Backend generates a JWT token containing:

```
{
  id: "userId",
  role: "student or teacher",
  teacherId: "only if student"
}
```

###  Frontend stores token

All API requests include:

```
Authorization: Bearer <token>
```

###  Middleware verifies token

`authMiddleware` checks:

* token exists
* token is valid
* token is not expired

It then attaches:

```
req.user = { id, role, teacherId }
```

to the request so controllers know **who** is calling.

---

#  **Role-Based Functionality**

##  Student Rules

* Can see **only their own tasks**
* Can create, update, delete **only their own tasks**
* Cannot view teacher tasks
* Must enter **teacherId** during signup

---

##  Teacher Rules

Teacher can view:

1. **Their own tasks**
2. **All tasks of students assigned to them**

Teacher cannot:
-> Edit student tasks
->Delete student tasks

---

#  **Teacher Task-View Logic**

This is a mandatory requirement.

### Step 1 — Find all students assigned to this teacher:

```js
const students = await User.find({ teacherId: teacherId });
```

### Step 2 — Teacher can view:

```js
Task.find({
  $or: [
    { userId: teacherId },          // own tasks
    { userId: { $in: studentIds } } // assigned students' tasks
  ]
});
```

This ensures **only allowed tasks** are shown.

---

#  **Frontend Features**

* Clean responsive UI
* Tailwind CSS with professional styling
* Modal popup for creating tasks
* Background blur while modal is open
* Student dashboard:

  * Shows only student tasks
* Teacher dashboard:

  * Shows teacher tasks first
  * Shows student tasks grouped under student email
* "+" floating button to create tasks
* Date picker prevents past dates
* Logout & role display

---

#  **Known Issues**

* Pagination (optional extension) not implemented
* Deployment not included (can be added with Render/Vercel)
* Basic validation on frontend (can be enhanced)

---

#  **Future Improvements**

* Assign tasks directly to students
* Add calendar-based task view
* Add notifications (email/SMS)
* Add drag & drop task board (Kanban)
* Add Forgot Password / Reset Password feature

---

#  **AI Assistance Disclosure (Required)**

AI assistance (ChatGPT) was used only for:

AI tools were used only for minor guidance such as suggesting UI design improvements, enhancing readability, and providing general debugging ideas. All core logic and implementation — including authentication, authorization, JWT handling, password hashing, middleware, Student–Teacher relationship mapping, role-based access control, task CRUD operations, backend architecture, and frontend integration — were fully implemented and understood by me. The overall workflow, design decisions, and coding were done manually to ensure complete understanding and alignment with the assignment requirements.
---



# **Thank You**

Feel free to contact me for clarifications or a live walkthrough!

