# DentoFlow — Dental Practice Management System

A modern, full-featured dental clinic management application built with React, TypeScript, and Tailwind CSS.

![DentoFlow](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)

---

## Overview

DentoFlow is an all-in-one dental clinic management system that allows staff and patients to manage appointments, patient records, inventory, billing, and reports — all from a clean, responsive dark-mode interface.

---

## Features

- 🦷 **Patient Management** — Full patient records, clinical charts, treatment history
- 📅 **Appointment Scheduling** — Book, manage, and track appointments with an in-session view
- 📦 **Inventory Control** — Real-time stock levels with low-stock alerts and reorder tracking
- 💳 **Billing & Payments** — Invoice management, payment status, insurance claim tracking
- 📊 **Reports & Analytics** — Revenue charts, treatment distribution, detailed financial reports
- 🔔 **Notifications** — Priority alerts, reminders, and a notification center
- ⚙️ **Settings** — Clinic profile, security, and notification preferences
- 🌐 **Patient Portal** — Dedicated portal for patients to view appointments, records, and payments
- 🔐 **Role-based Auth** — Separate admin and patient access with protected routes
- 🤖 **AI Chatbot Assistant** — Hybrid local/cloud AI for natural language interactions
- 🌍 **Multi-language Support** — English, French, and Arabic with RTL support
- 📱 **Mobile Responsive** — Full touch-optimized mobile experience

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 (custom dark theme) |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Icons | Material Symbols Outlined (Google Fonts) |
| Font | Inter (Google Fonts), Cairo (Arabic) |
| Auth | React Context + localStorage (mock) |
| AI | compromise.js (local NLP) + Google Gemini Pro (cloud fallback) |
| i18n | Custom translation system (EN/FR/AR) |
| Date Utils | date-fns |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/your-username/dentistmanagmentsystem.git
cd dentistmanagmentsystem
npm install
npm run dev (or 5174 if port is busy)

### AI Chatbot Setup (Optional)

The chatbot works out of the box with local AI. For enhanced accuracy, add Gemini API key:

```bash
# Create .env file in project root
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
```

Get free API key: https://makersuite.google.com/app/apikey
```

App runs at **http://localhost:5173**

---

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin / Staff | `admin` | `admin` |
| Patient | `patient` | `patient` |

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/dashboard` | Main Dashboard | Admin |
| `/patients` | Patient Records | Admin |
| `/patients/:id` | Patient Detail / Chart | Admin |
| `/appointments` | Appointments List | Admin |
| `/appointments/:id` | Appointment Session | Admin |
| `/inventory` | Inventory Control | Admin |
| `/reports` | Reports & Analytics | Admin |
| `/reports/financial` | Detailed Financial Report | Admin |
| `/billing` | 
│   ├── Chatbot/       # 12 AI chatbot components
│   └── ...            # Shared UI (Sidebar, Topbar, Layout, Modal, Badge, StatCard)
├── context/           # AuthContext, LanguageContext
├── data/              # Mock data (patients, appointments, inventory, payments)
├── i18n/              # Multi-language translations (EN/FR/AR)
├── pages/             # All route pages (14 pages)
├── services/ai/       # Hybrid AI architecture (local NLP + Gemini)
├── types/             # TypeScript interfaces
├── App.tsx            # Router + auth guards
├── main.tsx
└── index.css          # Global styles + Tailwind directives
```

## AI Chatbot Architecture

**Hybrid Approach** — Local-first with cloud fallback:

1. **Primary: Local NLP** (compromise.js)
   - Fast, free, private
   - Works offline
   - Pattern matching for common commands
   - Multi-language keyword support

2. **Fallback: Cloud AI** (Google Gemini Pro)
   - High accuracy for complex queries
   - Context-aware conversations
   - Only triggered when local confidence < 70%

**Supported Commands:**
- "Schedule John Doe for cleaning tomorrow at 2pm"
- "Show me today's appointments"
- "Check inventory for gloves"
- "Find patient Sarah Johnson"

See [AI_IMPLEMENTATION_GUIDE.md](AI_IMPLEMENTATION_GUIDE.md) for details.

## Internationalization

Full support for 3 languages:
- 🇬🇧 **English** — Default
- 🇫🇷 **French** — Français
- 🇸🇦 **Arabic** — العربية (RTL layout, Cairo font)

Language switcher in top bar. Translations stored in [src/i18n/translations.ts](src/i18n/translations.ts).
```
src/
├── components/        # Shared UI (Sidebar, Topbar, Layout, Modal, Badge, StatCard)
├── context/           # AuthContext
├── data/              # Mock data (patients, appointments, inventory, payments)
├── pages/             # All route pages
├── types/             # TypeScript interfaces
├── App.tsx            # Router + auth guards
├── main.tsx
└── index.css          # Global styles + Tailwind directives
```

---

## Color Theme

| Token | Value |
|-------|-------|
| `primary` | `#2b7cee` |
| `background-dark` | `#101822` |
| `surface-dark` | `#192433` |
| `border-dark` | `#233348` |
| `text-secondary` | `#92a9c9` |

---

## License

MIT
