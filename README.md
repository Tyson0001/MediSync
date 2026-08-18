# MediSync 🏥

> A full-stack doctor appointment booking system connecting patients with trusted medical professionals — featuring online bookings, secure payments, and an AI-powered health assistant.

**Live Demo:** [doctor-appointment-booking-frontend-dr8k.onrender.com](https://doctor-appointment-booking-frontend-dr8k.onrender.com/)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started (Local Setup)](#getting-started-local-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [AI Chatbot Setup](#ai-chatbot-setup)
- [Deployment (Render)](#deployment-render)
- [What to Do After Code Changes](#what-to-do-after-code-changes)

---

## Project Overview

MediSync is a three-part web application:

| Part | Description | Directory |
|---|---|---|
| **Frontend** | Patient-facing React app | `/frontend` |
| **Admin Panel** | Doctor & admin management React app | `/admin` |
| **Backend** | Express.js REST API | `/backend` |

Patients can register, browse doctors by speciality, book appointment slots, pay online, and chat with an AI health assistant. Admins and doctors manage appointments, availability, and profiles via the dedicated admin panel.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │  Patient Frontend   │    │    Admin / Doctor Panel  │    │
│  │  React + Vite +     │    │    React + Vite +        │    │
│  │  TailwindCSS        │    │    TailwindCSS           │    │
│  │  (Render)           │    │    (Render / Vercel)     │    │
│  └──────────┬──────────┘    └──────────┬───────────────┘   │
│             │                          │                     │
└─────────────┼──────────────────────────┼─────────────────────┘
              │  REST API calls (Axios)   │
              ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                         │
│                                                             │
│         Express.js REST API — Node.js (Render)             │
│         JWT Auth · Bcrypt · Multer · CORS                  │
│                                                             │
│   Routes: /api/user   /api/doctor   /api/admin              │
│                                                             │
└────┬─────────────────────┬──────────────────┬──────────────┘
     │                     │                  │
     ▼                     ▼                  ▼
┌──────────┐      ┌──────────────┐    ┌──────────────────┐
│ MongoDB  │      │  Cloudinary  │    │   Google Gemini  │
│ Atlas    │      │  (Images)    │    │   API (Chatbot)  │
└──────────┘      └──────────────┘    └──────────────────┘
     │
┌──────────────────────────────┐
│       Payment Gateways       │
│  Razorpay      Stripe        │
└──────────────────────────────┘
```

**Data Flow:**

1. Patient opens Frontend → loads doctors from Backend → stored in MongoDB
2. Patient registers/logs in → Backend issues JWT → Frontend stores in localStorage
3. Patient books a slot → Backend validates & saves to MongoDB
4. Patient pays → Razorpay/Stripe processes → Backend verifies → appointment marked paid
5. Patient sends chat message → Backend calls Gemini API → response returned
6. Doctor/Admin logs into Admin Panel → manages appointments, marks complete, updates profile

---

## Tech Stack

### Frontend (`/frontend`)

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| TailwindCSS 3 | Styling |
| React Router DOM 6 | Client-side routing |
| Axios | HTTP requests |
| React Toastify | Notifications |

### Admin Panel (`/admin`)

Same stack as Frontend — separate Vite project with admin-specific pages.

### Backend (`/backend`)

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| Bcrypt | Password hashing |
| Cloudinary | Doctor/patient image storage |
| Multer | File upload middleware |
| Razorpay | Indian payment gateway |
| Stripe | International payment gateway |
| @google/generative-ai | Gemini AI chatbot |
| Validator | Input validation |

---

## Features

### 👤 Patient Features

- **Registration & Login** — secure JWT-based auth with bcrypt password hashing
- **Browse Doctors** — filter by 6 medical specialities
- **Appointment Booking** — select any available date/time slot (7-day rolling calendar)
- **Online Payments** — Razorpay (India) and Stripe (International)
- **My Appointments** — view, cancel appointments; track paid/completed status
- **Profile Management** — update personal info and profile picture (via Cloudinary)
- **AI Health Chatbot** — floating chat widget powered by Gemini AI for health Q&A and appointment guidance

### 🏥 Doctor Features (Admin Panel)

- **Doctor Login** — separate JWT-based auth
- **Dashboard** — earnings, patient count, appointment stats
- **Appointments** — view, accept, complete, or cancel patient bookings
- **Profile** — update bio, fees, availability toggle

### ⚙️ Admin Features (Admin Panel)

- **Admin Login** — email/password credentials
- **Dashboard** — system-wide stats (doctors, patients, appointments)
- **Add Doctors** — register new doctors with image, speciality, degree, experience, fees
- **Doctors List** — view all registered doctors
- **All Appointments** — manage every appointment across all doctors

### Available Medical Specialities

| Speciality |
|---|
| General Physician |
| Gynecologist |
| Dermatologist |
| Pediatricians |
| Neurologist |
| Gastroenterologist |

---

## Project Structure

```
MediSync/
├── README.md
│
├── backend/                        # Express.js REST API
│   ├── server.js                   # App entry point, CORS, routes
│   ├── .env                        # Environment variables (never commit)
│   ├── config/
│   │   ├── mongodb.js              # MongoDB connection
│   │   └── cloudinary.js           # Cloudinary configuration
│   ├── middleware/
│   │   ├── authUser.js             # JWT middleware for patients
│   │   ├── authDoctor.js           # JWT middleware for doctors
│   │   ├── authAdmin.js            # JWT middleware for admin
│   │   └── multer.js               # File upload handler
│   ├── models/
│   │   ├── userModel.js            # Patient schema
│   │   ├── doctorModel.js          # Doctor schema
│   │   └── appointmentModel.js     # Appointment schema
│   ├── controllers/
│   │   ├── userController.js       # Patient logic + Gemini chatbot
│   │   ├── doctorController.js     # Doctor logic
│   │   └── adminController.js      # Admin logic
│   └── routes/
│       ├── userRoute.js            # /api/user routes
│       ├── doctorRoute.js          # /api/doctor routes
│       └── adminRoute.js           # /api/admin routes
│
├── frontend/                       # Patient React app
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                        # VITE_BACKEND_URL, VITE_RAZORPAY_KEY_ID
│   └── src/
│       ├── App.jsx                 # Root component, routes, ChatBot widget
│       ├── main.jsx
│       ├── assets/assets.js        # Images, icons, sample doctor data
│       ├── context/AppContext.jsx  # Global state (doctors, token, userData)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── Banner.jsx
│       │   ├── SpecialityMenu.jsx
│       │   ├── TopDoctors.jsx
│       │   ├── RelatedDoctors.jsx
│       │   └── ChatBot.jsx         # AI chatbot floating widget (NEW)
│       └── pages/
│           ├── Home.jsx
│           ├── Doctors.jsx
│           ├── Appointment.jsx
│           ├── MyAppointments.jsx
│           ├── MyProfile.jsx
│           ├── Login.jsx
│           ├── About.jsx
│           ├── Contact.jsx
│           └── Verify.jsx          # Payment verification redirect
│
└── admin/                          # Admin/Doctor React app
    ├── index.html
    ├── .env                        # VITE_BACKEND_URL, VITE_CURRENCY
    └── src/
        ├── App.jsx
        ├── context/
        │   ├── AdminContext.jsx
        │   ├── DoctorContext.jsx
        │   └── AppContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── Sidebar.jsx
        └── pages/
            ├── Login.jsx
            ├── Admin/
            │   ├── Dashboard.jsx
            │   ├── AddDoctor.jsx
            │   ├── DoctorsList.jsx
            │   └── AllAppointments.jsx
            └── Doctor/
                ├── DoctorDashboard.jsx
                ├── DoctorAppointments.jsx
                └── DoctorProfile.jsx
```

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Google Gemini API key (free — see [AI Chatbot Setup](#ai-chatbot-setup))

### 1. Clone the Repository

```bash
git clone https://github.com/Tyson0001/MediSync.git
cd MediSync
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Fill in `backend/.env` with your credentials (see [Environment Variables](#environment-variables) below), then:

```bash
npm start
```

Backend runs on **http://localhost:4000**

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Edit `frontend/.env`:
```env
VITE_BACKEND_URL = 'http://localhost:4000'
VITE_RAZORPAY_KEY_ID = 'your_razorpay_key_id_here'
```

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

### 4. Set Up the Admin Panel

```bash
cd ../admin
npm install
```

Edit `admin/.env`:
```env
VITE_CURRENCY = '₹'
VITE_BACKEND_URL = 'http://localhost:4000'
```

```bash
npm run dev
```

Admin panel runs on **http://localhost:5174**

---

## Environment Variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `CURRENCY` | ✅ | Currency code, e.g. `INR` |
| `JWT_SECRET` | ✅ | Secret string for JWT signing (use a long random string in production) |
| `ADMIN_EMAIL` | ✅ | Admin panel login email |
| `ADMIN_PASSWORD` | ✅ | Admin panel login password |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `CLOUDINARY_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | ✅ | Cloudinary API secret |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key (for AI chatbot) |
| `RAZORPAY_KEY_ID` | ⚠️ Optional | Razorpay key ID (for payments) |
| `RAZORPAY_KEY_SECRET` | ⚠️ Optional | Razorpay key secret |
| `STRIPE_SECRET_KEY` | ⚠️ Optional | Stripe secret key |

### `frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | ⚠️ Optional | Razorpay publishable key |

### `admin/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Backend API URL |
| `VITE_CURRENCY` | ✅ | Currency symbol, e.g. `₹` |

---

## API Endpoints

### User Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register a new patient |
| POST | `/login` | None | Login and get JWT |
| POST | `/chat` | None | Send message to AI chatbot |
| GET | `/get-profile` | User JWT | Get patient profile |
| POST | `/update-profile` | User JWT | Update profile + image |
| POST | `/book-appointment` | User JWT | Book a doctor appointment |
| GET | `/appointments` | User JWT | List patient appointments |
| POST | `/cancel-appointment` | User JWT | Cancel an appointment |
| POST | `/payment-razorpay` | User JWT | Create Razorpay order |
| POST | `/verifyRazorpay` | User JWT | Verify Razorpay payment |
| POST | `/payment-stripe` | User JWT | Create Stripe session |
| POST | `/verifyStripe` | User JWT | Verify Stripe payment |

### Doctor Routes — `/api/doctor`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | None | Doctor login |
| GET | `/list` | None | Get all available doctors |
| GET | `/appointments` | Doctor JWT | Get doctor's appointments |
| POST | `/cancel-appointment` | Doctor JWT | Cancel an appointment |
| POST | `/complete-appointment` | Doctor JWT | Mark appointment complete |
| POST | `/change-availability` | Doctor JWT | Toggle availability |
| GET | `/dashboard` | Doctor JWT | Doctor dashboard stats |
| GET | `/profile` | Doctor JWT | Doctor profile data |
| POST | `/update-profile` | Doctor JWT | Update doctor profile |

### Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | None | Admin login |
| POST | `/add-doctor` | Admin JWT | Add new doctor |
| GET | `/all-doctors` | Admin JWT | List all doctors |
| POST | `/change-availability` | Admin JWT | Change doctor availability |
| GET | `/appointments` | Admin JWT | All appointments |
| POST | `/cancel-appointment` | Admin JWT | Cancel any appointment |
| GET | `/dashboard` | Admin JWT | Admin dashboard stats |

---

## AI Chatbot Setup

The chatbot uses the **Google Gemini API** (free tier, `gemini-1.5-flash` model).

### Step 1 — Get a Free API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

### Step 2 — Add the Key

In `backend/.env`, replace the placeholder:
```env
GEMINI_API_KEY = "AIzaSy...your_actual_key_here"
```

### Step 3 — Install the Package

```bash
cd backend
npm install @google/generative-ai
```

### Step 4 — Test

Start the backend and open the frontend — you'll see a blue chat bubble in the bottom-right corner of every page. Click it and ask a health question!

### Chatbot Capabilities

- Answers general health questions
- Recommends the right medical speciality for symptoms
- Guides users through the appointment booking process
- Explains payment options (Razorpay / Stripe)
- Handles medical emergencies (advises to call 112 immediately)
- Maintains conversation context (multi-turn chat history)

---

## Deployment (Render)

MediSync is deployed using [Render](https://render.com).

### Backend

1. **New Web Service** → Connect GitHub repo `Tyson0001/MediSync`
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all `backend/.env` variables in the **Environment** tab

### Frontend

1. **New Static Site** → Same repo
2. **Root Directory:** `frontend`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. Environment Variables:
   - `VITE_BACKEND_URL` = your Render backend URL
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay key

### Admin Panel

Same as Frontend with:
- **Root Directory:** `admin`
- `VITE_BACKEND_URL` and `VITE_CURRENCY` = `₹`

---

## What to Do After Code Changes

After making any changes to the codebase, follow these steps to redeploy:

### Step 1 — Install new dependencies (if any)

```bash
# If backend dependencies were added (e.g., @google/generative-ai):
cd backend && npm install

# If frontend dependencies were added:
cd frontend && npm install
```

### Step 2 — Commit and push to GitHub

```bash
git add .
git commit -m "Add Gemini AI chatbot and update README"
git push origin main
```

### Step 3 — Render auto-deploys

Render is connected to your GitHub repo — **every push to `main` automatically triggers a redeploy** of all three services. Monitor progress in the [Render Dashboard](https://dashboard.render.com).

### Step 4 — Set new Environment Variables on Render

If you added new env vars (like `GEMINI_API_KEY`):

1. Render Dashboard → Your **Backend** service → **Environment** tab
2. Add `GEMINI_API_KEY` = `your_actual_gemini_key`
3. Click **Save Changes** → Render auto-redeploys

> **⚠️ Important:** `backend/.env` is in `.gitignore` and is **NOT** committed to GitHub. You must set all environment variables manually in the Render dashboard.

### Step 5 — Verify

Once deployed (1–3 minutes):
- Visit your frontend Render URL
- Look for the blue **💬 chat bubble** in the bottom-right corner
- Click it, send a health question, and verify the chatbot responds

---

## Acknowledgements

Built with ❤️ using React, Express.js, MongoDB Atlas, Cloudinary, and Google Gemini AI.
