# 🧳 Tour Management System – Backend

Welcome to the **Tour Management System Backend** – a RESTful API built with Node.js, Express, and MongoDB that powers the functionality of a complete tour booking platform. This backend handles user management, tour listings, booking operations, reviews, and more.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**
  - Register, Login (JWT-based)
  - Role-based access (Admin, User)
- 🗺️ **Tour Management**
  - Create, update, delete, and view tours
  - Upload tour images (optional)
- 📆 **Booking System**
  - Tour bookings with date & availability management
- 💬 **Review & Ratings**
  - Users can leave reviews on completed tours
- 📊 **Admin Dashboard**
  - View users, bookings, earnings, etc.

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| Node.js    | JavaScript runtime |
| Express.js | Web framework |
| MongoDB    | NoSQL Database |
| Mongoose   | MongoDB ODM |
| Zod        | Request body validation |
| JWT        | Auth Token |
| Dotenv     | Env variable manager |
| CORS       | Cross-origin access |

---

## 📂 Folder Structure

backend/
├── controllers/
├── routes/
├── models/
├── middlewares/
├── utils/
├── config/
├── app.ts / app.js
└── server.ts / server.js

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables.  
You can use the provided `.env.example` file as a reference.

```env
# Application Port
PORT=8000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Environment
NODE_ENV=development

# JWT Access Token
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRED=3d

# JWT Refresh Token
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=30d

# Bcrypt Salt Round
BCRYPT_SALT_ROUND=10

# Super Admin Credentials
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_super_admin_password

# Google OAuth (Optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

# Express Session
EXPRESS_SESSION_SECRET=your_express_session_secret

# Frontend URL
FRONT_END_URL=http://localhost:5173




---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Subahan-1D/library-management-server-api.git
cd tour-management-backend
