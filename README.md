# UPLB CASA

UPLB CASA is a centralized accommodation management system for the [University of the Philippines Los Baños][uplb]. It is a system built with the goal to replace manual forms, email exchanges, and spreadsheets with a unified digital platform for managing the full lifecycle of student housing and accommodations.

[![CASA Live][live-badge]][live-link]
[![License][license-badge]][license-link]
![Stars][stars-badge]
![Last Commit][last-commit-badge]
#### Tech Stack
![Next.js][next-badge] ![Supabase][supabase-badge] ![Tailwind][tailwind-badge] ![TypeScript][ts-badge] ![Biome][biome-badge] ![Lucide][lucide-badge] ![Swagger][swagger-badge]

## Features
### Core System
- **Auth**: Google/UP Mail (OAuth 2.0) via Supabase. Roles: Student, Manager, Admin, SysAdmin.
- **Audit Logs**: Immutable transaction logs (User, Timestamp, IP, Action). Logs cannot be edited or deleted.
- **Reporting**: Exportable summaries (Occupancy, Billing, Applicants) in PDF/CSV/Excel.
### For Students
- **Housing Browser**: Filter and view available dorms/rooms.
- **Applications**: Digital submission with document uploads during open periods.
- **Billing**: View SOA, declare payments, and track approval status.
### For Management
- **Room Management**: Track capacity, assign students, and record move-in/out dates.
- **Screening**: Two-tier application review (Manager screening -> Admin final approval).
- **Payments**: Verify student payment uploads before sending to Admin for final sign-off.

## User Roles


| Role | Route | Primary Responsibilities |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| **Student** | `/student` | Browse housing, submit applications, upload documents, track status, view billing |
| **Manager** | `/manage` | Initial application screening, room assignment, occupancy tracking, billing verification |
| **Admin / Landlord** | `/admin` | Final application approval, housing and room CRUD, billing management, reports |
| **System Admin** | `/sys` | User management, role assignment, audit logs, system configuration |

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

```text
src/app
├── (auth)/             # Auth-related routes (login, register)
├── (main)/             # Main application modules
│   ├── admin/          # Admin & Landlord dashboards
│   ├── manage/         # Manager (Dorm screening) tools
│   ├── student/        # Student portal & housing browser
│   └── sys/            # System Admin (Audit logs, roles)
├── api/                # Backend API route handlers
├── components/         # Shared UI components
├── lib/                # Core business logic
│   ├── data/           # Database fetchers & queries
│   ├── models/         # TypeScript types & schemas
│   └── services/       # Logic for applications, billing, etc.
├── globals.css         # Global Tailwind styles
├── layout.tsx          # Root application layout
└── page.tsx            # Landing page entry
public/             # Static assets (images, fonts, logos)
scripts/            # Database seed and mock data scripts
docs/               # Technical documentation & diagrams
srs.md              # Software Requirements Specification
biome.json          # Linter & formatter configuration
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

For example:
```env
NEXT_PUBLIC_SUPABASE_URL=[url]
NEXT_PUBLIC_SUPABASE_ANON_KEY= [key]
```

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
## Acknowledgements

This project was developed in partial fulfillment of the requirements for CMSC 128 (Introduction to Software Engineering) at the [University of the Philippines Los Baños][uplb], Second Semester AY 2025–2026.

[live-badge]: https://img.shields.io/badge/Live-uplb.casa-maroon
[live-link]: https://uplb.casa
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-link]: https://img.shields.io/github/license/smmariquit/comsci-128
[stars-badge]: https://img.shields.io/github/stars/smmariquit/comsci-128
[last-commit-badge]: https://img.shields.io/github/last-commit/smmariquit/comsci-128
[next-badge]: https://img.shields.io/badge/Next.js-black?logo=next.js
[supabase-badge]: https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white
[tailwind-badge]: https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white
[ts-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white
[biome-badge]: https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white
[lucide-badge]: https://img.shields.io/badge/Lucide-F43F5E?logo=lucide&logoColor=white
[swagger-badge]: https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black
[uplb]: https://uplb.edu.ph/
