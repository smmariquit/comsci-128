# UPLB CASA

UPLB CASA is a centralized accommodation management system for the [University of the Philippines Los Baños][uplb]. It is a system built with the goal to replace manual forms, email exchanges, and spreadsheets with a unified digital platform for managing the full lifecycle of student housing and accommodations.

[uplb]: https://uplb.edu.ph/

[![badge](https://img.shields.io/badge/Live:-uplb.casa-maroon)](https://uplb.casa)

<br>

![badge](https://img.shields.io/badge/CMSC_128-University_of_The_Philippines_Los_Baños-maroon)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://img.shields.io/github/license/smmariquit/comsci-128)

![GitHub stars](https://img.shields.io/github/stars/smmariquit/comsci-128)
![Last commit](https://img.shields.io/github/last-commit/smmariquit/comsci-128)


<br>

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

---
## Features

### Authentication and Access Control

Users authenticate via Google or UP Mail through [Supabase Auth][supabase-auth] with OAuth 2.0. New accounts are provisioned as Students by default. Role upgrades are managed by the System Administrator. All sessions are JWT-backed and activity is logged automatically.

[supabase-auth]: https://supabase.com/docs/guides/auth

### User Management

Students self-register on first login and complete their profile. Managers view only the profiles of students assigned to their dormitories. Admins manage all user accounts, assign roles, and deactivate accounts while preserving their records.

### Housing and Room Management

Admins and Landlords perform full CRUD operations on housing facilities and rooms. Each dormitory supports one assigned manager, though a manager may oversee multiple dormitories. Room types include Women Only, Men Only, or Co-Ed.

### Application Processing

Students view the available facilities along with their room types, they can then submit applications with required documents during admin-defined application periods. Applications then go through two levels of review: initial screening by the Manager and final approval by the Admin. Single active application per student is enforced. !TODO: stimmie wats the update

### Room Assignment and Occupancy Tracking

Managers assign approved students to available rooms within their facilities. The system enforces room capacity limits and prevents overbooking. Move-in and move-out dates are recorded in the accommodation history for each student.

### Billing and Payment Management

Admins set accommodation rates and billing periods. Students request Statements of Account, declare payable assets, and upload proof of payment. Managers verify payment documents before forwarding to the Admin for final approval.

### Reporting and Document Generation

Admins generate real-time reports such as occupancy summaries, financial reports, and applicant status reports with options to export to PDF, CSV, and Excel. Managers generate occupancy and move-in/move-out reports limited to their assigned dormitories. Students generate personal documents such as proof of accommodation and billing statements.

### Activity Logs

Every system transaction is recorded with user ID, timestamp, partial IP address (first two octets only), transaction type, and affected entity. Logs are immutable so no user, including administrators, can modify or delete them.

---
## User Roles


| Role | Route | Primary Responsibilities |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| **Student** | `/student` | Browse housing, submit applications, upload documents, track status, view billing |
| **Manager** | `/manage` | Initial application screening, room assignment, occupancy tracking, billing verification |
| **Admin / Landlord** | `/admin` | Final application approval, housing and room CRUD, billing management, reports |
| **System Admin** | `/sys` | User management, role assignment, audit logs, system configuration |

---
## Development stack

| | |
| ---------- | --------------------------------- |
| Framework | [Next.js 15][nextjs] |
| Language | [TypeScript][typescript] |
| Database | [Supabase][supabase] (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Styling | [Tailwind CSS][tailwind] |
| Deployment | [Vercel][vercel] |

[nextjs]: https://nextjs.org/

[typescript]: https://www.typescriptlang.org/

[supabase]: https://supabase.com/

[tailwind]: https://tailwindcss.com/

[vercel]: https://vercel.com/

---
# Getting Started

## Project Structure

```
src/app
├── layout.tsx          # root layout
├── page.tsx            # landing page (/)
├── globals.css
├── components/         # shared UI components
├── lib/                # utils, db, auth, etc.
│
├── (main)/             # logged-in app routes
│   ├── layout.tsx      # nav for authenticated pages
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── _components/
│   │   ├── _actions.ts
│   │   └── api/
│   │       └── route.ts
│   └── profile/
│       ├── page.tsx
│       ├── _components/
│       └── _actions.ts
│
└── (auth)/             # auth routes
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx
```

### Prerequisites

- [Node.js] 18+
- A [Supabase][supabase] project

[Node.js]: https://nodejs.org/en/download/

### Installation

  
```bash

git clone https://github.com/smmariquit/comsci-128

cd comsci-128

npm i

```

### Environment Variables

Create a `.env.local` file in the root of the project:

| Variable                        | Description                   | Required |
| ------------------------------- | ----------------------------- | :------: |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     |    ✔     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |    ✔     |

  
```env

# Example

NEXT_PUBLIC_SUPABASE_URL= [url]

NEXT_PUBLIC_SUPABASE_ANON_KEY= [key]

```

> [!WARNING]
> NEVER commit `.env.local` to the repository. It is already listed in `.gitignore`.


### Running Locally

```bash

npm run dev

```
  
Open [http://localhost:3000](http://localhost:3000).

### Database Seed

A mock seed script is available for populating the database with test data. Run it via the Supabase SQL editor.

```

scripts/mock-seed.sql

```

---
## Acknowledgements

This project was developed in partial fulfillment of the requirements for CMSC 128 (Introduction to Software Engineering) at the [University of the Philippines Los Baños][uplb], Second Semester AY 2025–2026.

