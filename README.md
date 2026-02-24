# 🌟 Dynamic Flare — AI/ML Portfolio

A full-stack personal portfolio website built for an AI/ML student, featuring a dynamic admin dashboard, project showcase, blog, and experience timeline with certificate viewer.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blueviolet)](https://github.com/Monasri29-hub/Portfolio)
[![Node](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-lightgrey)](https://www.prisma.io)

---

## ✨ Features

- 🏠 **Home** — Animated hero with particle background
- 👤 **About** — Bio, social links, resume, and Education timeline
- 💼 **Experience** — Clickable timeline cards with certificate viewer modal
- 📁 **Projects** — Filterable project cards with live/GitHub links
- 📝 **Blog** — Markdown blog with public/draft support
- 📬 **Contact** — Contact form with message storage
- 🔐 **Admin Dashboard** — Full CRUD for projects, blogs, experience (with certificates), education, messages, and profile

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, Framer Motion, Lucide Icons |
| Backend | Node.js + Express.js |
| Database | SQLite via Prisma ORM |
| Auth | JWT + bcryptjs |
| Styling | Vanilla CSS with CSS variables (dark/light theme) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Monasri29-hub/Portfolio.git
cd Portfolio

# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Environment Setup

Create `server/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### Database Setup

```bash
cd server
npx prisma db push
npx prisma generate
node prisma/seed.js        # Creates admin users & sample project
node prisma/seed_experience.js  # Seeds experience data
```

### Run Development Servers

From the **root** directory:

```bash
npm run dev
```

This starts both the client (port 5173) and server (port 5000) simultaneously.

---

## 🔐 Admin Access

| Field | Value |
|-------|-------|
| URL | http://localhost:5173/admin |
| Email | `monasri9c.vhs@gmail.com` |
| Password | `admin123` *(change after setup)* |

---

## 📁 Project Structure

```
dynamic-flare/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Home, About, Experience, Projects, Blog, Contact, Admin
│       ├── components/      # Navbar, Footer, PageWrapper, ParticleBackground
│       └── context/         # AuthContext
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   └── middleware/      # Auth middleware
│   └── prisma/
│       ├── schema.prisma    # DB schema
│       └── seed.js          # DB seeder
└── package.json             # Root scripts (concurrently)
```

---

## 🎓 About the Developer

**Monasri Kundeti** — AI/ML Student | Open Source Contributor  
📍 Hyderabad, Telangana  
🔗 [LinkedIn](https://linkedin.com/in/monasri-kundeti) | [GitHub](https://github.com/Monasri29-hub)

---

## 📄 License

MIT License — feel free to fork and adapt!
