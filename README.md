# DevMarket

A developer marketplace platform to buy/sell plugins, manage users, categories, and orders with real-time updates.

---

## 📂 Features

- Admin panel for managing:
  - Plugins
  - Users
  - Categories
  - Orders
- Real-time updates using Socket.IO
- JWT authentication & role-based access (admin/user)
- File uploads (images for plugins)
- REST API built with Express & Sequelize
- MySQL database
- Stripe integration for payments
- CORS enabled for frontend deployment

---

## 🛠 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express, Sequelize ORM, MySQL
- **Realtime:** Socket.IO
- **Authentication:** JWT
- **Payment:** Stripe
- **Deployment:** Vercel (frontend), Render (backend & MySQL)

---

## ⚡️ Requirements

- Node.js >= 18
- MySQL (or Clever Cloud / Render MySQL)
- npm or yarn
- Stripe account (for payment)

---

## 🛠 Installation

### 1. Clone repo

```bash
git clone https://github.com/yourusername/DevMarket.git
cd DevMarket
```

### 2. Backend setup

```bash
cd back-end
npm install
```

#### 2.1 Environment variables (`.env`)

```env
PORT=4000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=devmarket
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
NODE_ENV=development
```

> Replace values with your MySQL and Stripe credentials.

#### 2.2 Run backend

```bash
npm run dev
```

> Default backend runs on `http://localhost:4000`

---

### 3. Frontend setup

```bash
cd front-end
npm install
```

#### 3.1 Environment variables (`.env`)

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

#### 3.2 Run frontend

```bash
npm run dev
```

> Default frontend runs on `http://localhost:5173`

---

## 🛠 Database

### 1. MySQL tables

- Users
- Plugins
- Categories
- Orders

### 2. Seed data

- Run `seed.js` to populate initial users, categories, and plugins (ensure DB is connected).

---

## 🔑 Authentication

- Admin credentials example:

```json
{
  "username": "admin",
  "email": "admin@gmail.com",
  "password": "your_hashed_password",
  "role": "admin"
}
```

- Regular user can register via frontend form.

---

## 💻 Admin Panel

- Accessible at `/admin` (only admin users)
- Tabs for:
  - Plugins
  - Users
  - Categories
  - Orders
- CRUD operations for each resource
- Real-time updates using Socket.IO

---

## 💳 Stripe Payment

- Stripe webhook endpoint: `/api/payment/webhook`
- Ensure raw body is passed to Stripe middleware.
- Test with Stripe test keys first.

---

## 🚀 Deployment

### 1. Backend (Render)

- Use Node.js + MySQL service
- Set environment variables in Render dashboard
- Use Sequelize pool: `max < max_user_connections`

### 2. Frontend (Vercel)

- Set `VITE_API_URL` to deployed backend URL
- Build and deploy via Vercel

---

## ⚠️ Notes

- **CORS:** Ensure backend `Access-Control-Allow-Origin` matches frontend URL
- **Max connections:** Render MySQL free tier allows max 5 connections. Use Sequelize pool properly.

---

## 🧹 Socket.IO Events

| Event         | Description                           |
| ------------- | ------------------------------------- |
| `newUser`     | Triggered when a new user is created  |
| `newOrder`    | Triggered when a new order is created |
| `updateOrder` | Triggered when an order is updated    |

---

## 📦 Scripts

```bash
# Backend
npm run dev       # Development
npm start     # Production

# Frontend
npm run dev       # Development
npm run build     # Production build
```

---

## 📜 License

MIT License

