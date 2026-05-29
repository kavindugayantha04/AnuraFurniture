# 🛋️ Anura Furniture – Dekatana
### *Furniture කලාවේ මහ ගෙදර*

A full-stack AI-powered MERN e-commerce platform for Sri Lanka's premium furniture brand.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth 2.0 |
| AI | Google Gemini (2.5 Flash) |
| Payments | Stripe |
| Storage | Cloudinary |
| Real-time | Socket.io |
| State | Redux Toolkit |

---

## 📁 Project Structure

```
anura-furniture/
├── backend/               # Express.js API server
│   ├── config/            # DB & Cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, error middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper utilities
│   ├── .env.example       # Environment template (copy to .env locally)
│   └── server.js          # Entry point
│
└── frontend/              # React + Vite app
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Route pages
    │   ├── store/         # Redux store & slices
    │   └── services/      # API & Socket services
    └── vite.config.js
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your environment variables

# Frontend
cd frontend
npm install
```

### 2. Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_CLIENT_ID=...
```

Add admin credentials **only** in `backend/.env` (not in `.env.example`):

```env
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_NAME=...
```

Then run once: `cd backend && npm run seed:admin`

Optional sample catalog: `npm run seed`

### 3. Run Development

```bash
# Backend (Port 5000)
cd backend && npm run dev

# Frontend (Port 5173)
cd frontend && npm run dev
```

### 4. Build for Production

```bash
cd frontend && npm run build
cd backend && npm start
```

---

## 🌟 Features

### 🛒 E-Commerce
- Product catalog with smart filtering & AI search
- Shopping cart with coupon system
- Stripe payment + COD + Koko Pay
- Order tracking with real-time updates
- Invoice generation (PDF)
- Wishlist & product comparison

### 🤖 AI Features
- **AI Chatbot** – Furniture assistant powered by Google Gemini
- **AI Recommendations** – Personalized product suggestions
- **AI Room Designer** – Upload room, get design suggestions
- **Natural Language Search** – "modern sofa under Rs.80,000"
- **AI Sales Analytics** – Business insights for admin

### 🔐 Authentication
- JWT with HTTP-only cookies
- Google OAuth 2.0
- Role-based access (Customer / Admin)
- Password reset via email OTP

### 📊 Admin Dashboard
- Revenue & sales analytics (Recharts)
- Product, order, user management
- Category, coupon, banner management
- Custom furniture order handling
- AI-generated business insights
- Low stock alerts

### 📱 Advanced
- Progressive Web App (PWA)
- Dark / Light mode
- Sinhala + English bilingual support
- Fully responsive (mobile-first)
- SEO optimized with meta tags
- Socket.io real-time notifications

---

## 🔑 Admin account

Admin access is **not hardcoded**. Set these only in `backend/.env` (never commit this file, never add values to `.env.example`):

```env
ADMIN_EMAIL=your_admin@gmail.com
ADMIN_PASSWORD=YourStrongPassword12+
ADMIN_NAME=Site Administrator
```

Only the email in `ADMIN_EMAIL` can use the admin panel (enforced on the server). Then run:

```bash
cd backend
npm run seed:admin
```

Log in at `/login` with that email and password.

---

## 🌐 Deployment

### Backend (Railway / Render)
```bash
cd backend
npm start
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the `dist` folder
```

### Environment Variables (Production)
Set `NODE_ENV=production` and all required env vars on your hosting platform.

---

## 📞 Support

- 📧 hello@anurafurniture.lk
- 📱 +94 77 123 4567
- 🌐 [anurafurniture.lk](https://anurafurniture.lk)

---

*Built with ❤️ for Anura Furniture – Dekatana*
