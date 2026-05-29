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
| Email | Gmail SMTP (Nodemailer) |
| Storage | Cloudinary |
| Real-time | Socket.io |
| State | Redux Toolkit |

---

## 📁 Project Structure

```
anura-furniture/
├── backend/               # Express.js API server
│   ├── config/            # DB, Cloudinary, Passport
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, error middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Email, seeders, helpers
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

Copy `backend/.env.example` to `backend/.env` and configure:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your@gmail.com
EMAIL_FROM_NAME=Anura Furniture
STORE_EMAIL=your@gmail.com

# Google OAuth (optional — Sign in with Google)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLIENT_URL=http://localhost:5173
```

Optional sample product catalog:

```bash
cd backend
npm run seed
```

### 3. Run Development

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for Production

```bash
cd frontend && npm run build
cd backend && npm start
```

---

## 🌟 Features

### 🛒 E-Commerce
- Product catalog with filtering & AI search
- Shopping cart with coupon system
- Cash on delivery checkout
- Order tracking with real-time updates
- Wishlist & product comparison
- Contact form (emails store inbox)

### 🤖 AI Features
- **AI Chatbot** – Furniture assistant (Google Gemini)
- **AI Recommendations** – Personalized product suggestions
- **AI Room Designer** – Upload room, get design ideas
- **Natural Language Search** – e.g. "modern sofa under Rs.80,000"
- **AI Sales Analytics** – Business insights in admin panel

### 🔐 Authentication
- Email & password registration / login
- Google OAuth 2.0 (optional)
- Password reset via email
- JWT with HTTP-only cookies

### 📊 Admin Dashboard
- Revenue & sales analytics
- Products, orders, users, categories, coupons, banners
- Custom furniture requests
- AI-generated insights

### 📱 Advanced
- Progressive Web App (PWA)
- Dark / light mode
- Sinhala + English branding
- Responsive layout
- Socket.io in-app notifications
- Terms & Privacy pages

---

## 🌐 Deployment

### Backend (Render / Railway)

Set `NODE_ENV=production` and all env vars from `.env.example` on your host. See `render.yaml` for a Render template.

```bash
cd backend
npm start
```

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
# Deploy the dist folder; set VITE_API_URL to your API URL if not same-origin
```

### Production notes

- Update `CLIENT_URL` and `GOOGLE_CALLBACK_URL` to your live domains
- Add production URLs to Google Cloud OAuth redirect URIs
- Use Gmail App Password or transactional email for `EMAIL_*` and `STORE_EMAIL`

---

## 📞 Support

- 📧 anurafurniture238@gmail.com
- 📱 +94 72 330 3946
- 📍 Dekatana, Western Province, Sri Lanka

---

*Built with ❤️ for Anura Furniture – Dekatana*
