<div align="center">

# TALENTA

**Personal-finance stewardship app with an administrative system — _Administrando para la Gloria de Dios_.**

[**talentaapp.com**](https://talentaapp.com)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Overview

TALENTA helps people take control of their money as an act of stewardship. Users budget, track income
and expenses, pay down debt and generate the financial records their course asks for — while administrators
manage access, users and feedback from a dedicated panel.

It is a production app with real users, paid plans and free access for enrolled course students. I designed,
built and run it end to end.

## Features

**For users**

- **Budget & categories** — monthly budget per category, compared against recommended spending
- **Income & expenses** — variable and fixed expenses (weekly → yearly recurrence), receipts, cards and payments
- **Debts & assets** — debt list (LD), asset register and the income/expense record (RIE), each exportable to **PDF**
- **Multi-country** — country-based local currency plus a secondary currency
- **Bible module** — chapter reader, word search, highlights, saved verses and a verse of the day
- **Accessibility** — adjustable text and UI scale
- **Installable PWA** — works from the browser or the home screen on any device

**For administrators**

- **Authorized emails** — grant free access to the students enrolled in a course
- **User roster** — users grouped by role (student, facilitator, administrator)
- **Feedback inbox** — messages from users with read/unread state

**Monetization**

- Monthly and quarterly **subscription plans** with card checkout through **Tilopay**
- Course access codes that unlock the app for the duration of a course

## Architecture

```
src/
├── modules/            feature modules, each with its own components / hooks / repositories / types
│   ├── auth/           registration, sign-in, profile, terms, feedback
│   ├── finances/       budget, expenses, cards, debts, assets, RIE, PDF exports
│   ├── bible/          Bible API client, reader, search, saved verses
│   ├── payments/       plans, subscription state, Tilopay checkout
│   ├── admin/          authorized emails, roster, feedback inbox
│   └── asistente/      financial assistant (in progress)
├── router/             route table, app shell and the home hub
└── shared/             UI primitives, generic Firestore repository, countries & currencies
modulo-finanzas/        standalone finance module the in-app finances evolved from
firestore.rules         per-user data isolation and admin-only collections
```

- **Feature-module architecture** with a generic, user-scoped `FirestoreRepository`.
- **Zustand** for auth and preferences; **Firestore** real-time listeners for data.
- **Firestore security rules** isolate each user's data and lock admin collections to administrators.
- CI builds and deploys on every push to `main` (GitHub Actions).

## Getting started

```bash
npm install
cp .env.example .env     # Firebase, EmailJS, Bible API and (optional) Tilopay endpoint
npm run dev
npm run build            # type-check + production build
```

## Author

**Jean Carlo Villamonte Murillo** — Software Developer · Costa Rica
[Portfolio](https://je4nca.github.io/personal-portfolio/) · [LinkedIn](https://www.linkedin.com/in/jcvillamonte) · [montevostudio.com](https://montevostudio.com)
