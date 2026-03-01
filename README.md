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

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 (custom dark theme) |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Icons | Material Symbols Outlined (Google Fonts) |
| Font | Inter (Google Fonts) |
| Auth | React Context + localStorage (mock) |

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
npm run dev
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
| `/billing` | Billing & Payments | Admin |
| `/notifications` | Notification Center | Admin |
| `/settings` | System Settings | Admin |
| `/portal` | Patient Portal | Patient |

---

## Project Structure

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
