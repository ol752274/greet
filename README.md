# ✨ Greet — Custom Greetings & Wishes App

Full-stack app built with **React + Node.js + MongoDB**.

## 📁 Structure
```
wishcraft/
├── backend/    Node.js + Express + MongoDB API
└── frontend/   React + Vite + Zustand
```

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

> Vite proxies `/api` and `/uploads` to `localhost:5000` automatically.

## 🔑 Backend .env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wishcraft
JWT_SECRET=change_this_to_something_long_and_random
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | ✗ | Register with email+password |
| POST | /api/auth/login | ✗ | Login |
| POST | /api/auth/guest | ✗ | Guest session |
| GET | /api/auth/me | ✓ | Get current user |
| PUT | /api/user/profile | ✓ | Update name + avatar |
| POST | /api/user/subscribe | ✓ | Activate premium (mock) |
| GET | /api/templates | ✓ | Get templates (filtered by category) |

## 🖼 Image Overlay Logic
Templates use CSS absolute positioning with 3 layers: gradient BG → emoji → user photo + name overlay. `html2canvas` flattens all layers to a 2× HD PNG for export and sharing.

## 💳 Premium
Mock mode active by default — hitting `/api/user/subscribe` sets `isPremium: true` in MongoDB. For real payments, integrate Razorpay webhook verification in `user.controller.js`.

## 🗂 Tech Stack
- **Frontend**: React 18, Vite, Zustand, CSS Modules, html2canvas
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer, bcryptjs
- **Auth**: JWT stored in localStorage, protected routes via middleware
