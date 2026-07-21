# UPLB CASA

UPLB CASA is a centralized accommodation management system for the [University of the Philippines Los Baños][uplb]. Designed to replace manual forms, fragmented email exchanges, and spreadsheets, UPLB CASA provides a unified digital platform that manages the entire lifecycle of student housing, assignments, occupancy, and billing.

<p align="center">
 <a href="https://uplb.casa">
 <img src="https://img.shields.io/badge/Live-uplb.casa-maroon?style=for-the-badge&logo=vercel&logoColor=white" alt="CASA Live" />
 </a>
 <a href="https://github.com/smmariquit/comsci-128/blob/main/LICENSE">
 <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
 </a>
 <img src="https://img.shields.io/github/stars/smmariquit/comsci-128?style=for-the-badge&color=gold" alt="Stars" />
 <img src="https://img.shields.io/github/last-commit/smmariquit/comsci-128?style=for-the-badge" alt="Last Commit" />
</p>
<p align="center">
 <img src="https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=progressive-web-apps&logoColor=white" alt="PWA Ready" />
 <img src="https://img.shields.io/badge/Offline%20DB-PGlite-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="Offline DB" />
 <img src="https://img.shields.io/badge/3D%20Maps-MapLibre-red?style=for-the-badge&logo=maplibre&logoColor=white" alt="3D Maps" />
</p>

#### Tech Stack
![Next.js][next-badge] ![Supabase][supabase-badge] ![Tailwind][tailwind-badge] ![TypeScript][ts-badge] ![Biome][biome-badge] ![Lucide][lucide-badge] ![Swagger][swagger-badge]

---

## 3D Interactive Spatial Mapping

UPLB CASA features a fully interactive 3D spatial viewer built using **MapLibre GL**. The viewer constructs real-time 3D building models on-the-fly directly from OpenStreetMap building footprints via fill-extrusion layers.

---

## Core System Architecture

### Offline-First Housing Engine (PWA)
UPLB CASA is designed to work reliably in low-connectivity areas around UPLB.
1. **Service Worker (Serwist)**: Implements offline assets caching and fallback page routes (`/offline`).
2. **In-Browser PostgreSQL (PGlite)**: Mounts an IndexedDB-backed (`idb://housing-offline-db`) PostgreSQL instance directly inside the student's browser.
3. **Canvas Compression API**: When online, the system automatically fetches all housing databases, converts heavy cover images into low-res JPEG base64 strings client-side, and stores them in the local PGlite instance to avoid offline network overhead.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student/User
    participant App as Next.js PWA Client
    participant SW as Serwist Service Worker
    participant PGlite as In-Browser PGlite (IndexedDB)
    participant API as Supabase API (Backend)

    alt Device is Online
        App->>API: Fetch latest housing & room data
        API-->>App: Return JSON payload
        App->>App: Generate low-res base64 thumbnails (canvas API)
        App->>PGlite: Sync data (INSERT ON CONFLICT / DELETE obsolete)
        Note over PGlite: Data serialized to IndexedDB idb://housing-offline-db
    else Device is Offline
        User->>App: Open Housing Browser
        App->>SW: Intercept fetch requests
        SW-->>App: Serve static assets & cached scripts
        App->>PGlite: Query local PostgreSQL tables (housing & room)
        PGlite-->>App: Return local offline data (with base64 images)
        App-->>User: Display offline UI with full features
    end
```

### Multi-Role Application & Approval Flow
Accommodations are managed through a two-tiered screening process to ensure full accountability and compliance with university policies.

```mermaid
graph TD
    %% Define Styles
    classDef init fill:#f5f3ef,stroke:#c9642a,stroke-width:2px,color:#2c1b0c;
    classDef state fill:#ffffff,stroke:#666666,stroke-width:1px,stroke-dasharray: 5 5,color:#111111;
    classDef success fill:#e6f4ea,stroke:#137333,stroke-width:2px,color:#137333;
    classDef danger fill:#fce8e6,stroke:#c5221f,stroke-width:2px,color:#c5221f;
    classDef process fill:#f1f3f4,stroke:#5f6368,stroke-width:1px,color:#202124;

    Start([Student submits application]) --> P1[Pending Manager Approval]
    
    P1 -->|Manager Rejects| R1[Rejected]
    P1 -->|Manager Reviews Docs Form 5, Payment, etc.| P2[Pending Admin Approval]
    
    P2 -->|Admin Rejects| R2[Rejected]
    P2 -->|Admin Grants Final Approval| Appr[Approved]
    
    Appr --> Assign[Manager / Admin assigns room unit]
    Assign --> Occupy[Occupancy tracking begins]
    
    class Start init;
    class P1,P2 state;
    class Appr,Occupy success;
    class R1,R2 danger;
    class Assign process;
```

---

## Features

### Core Infrastructure
- **Authentication**: Role-based access control, secure signups, email OTP verification, and PKCE-based Google/UP Mail OAuth 2.0 flow via Supabase.
- **Immutable Audit Logs**: full ledger tracking user activities (logins, application actions, approvals). Logs cannot be edited or deleted by any level of administration.
- **Reporting**: Analytical tools to generate system-wide occupancy, financial, and applicant metrics exported directly to custom brand-styled PDF and CSV formats.
- **Notifications**: Transactional emails powered by Resend via custom SMTP integration.

### Role Capabilities & Portals

| Role | Route | Primary Responsibilities |
| :--- | :--- | :--- |
| **Student** | `/student` | Browse housing listings (online/offline), submit applications, upload required docs (Form 5, Waiver, Contract, Receipt), and review Statement of Accounts (SOA). |
| **Manager** | `/manage` | Screen initial housing applications, review student documents, manage room occupancy/tenant assignments, and verify payment slips. |
| **Admin / Landlord** | `/admin` | Perform final application approval, manage dorm/room CRUD databases, define pricing rates, sign-off on verified payments, and export analytics reports. |
| **System Admin** | `/sys` | User administration, role overrides, system configuration modifications, and audit log analysis. |

---

## Screenshots & Portal Walkthrough

### Landing & Login
- **Landing Page**: Entry point displaying marketing overview and primary CTA.
- **Login Page**: Secured credentials validation portal.

| Landing Page | Login Page |
| :---: | :---: |
| ![Landing Page](public/screenshots/landing.png) | ![Login Page](public/mrh_3d_map_popup.png) |

### Student Portal (`/student`)
Student portal features dynamic offline DB synchronization status, housing catalogs, and local form complaints submission.

| Student Dashboard | Housing Browser | Complaints Panel |
| :---: | :---: | :---: |
| ![Student Dashboard](public/screenshots/student_dashboard.png) | ![Housing Browser](public/screenshots/student_accommodations.png) | ![Complaints Panel](public/screenshots/student_complaints.png) |

### Manager Portal (`/manage`)
Managers review active listings, screen initial tenant applications, handle local complaint requests, and track staff/manager actions.

| Manager Dashboard | Accommodations Overview | Application Reviews |
| :---: | :---: | :---: |
| ![Manager Dashboard](public/screenshots/manager_dashboard.png) | ![Accommodations](public/screenshots/manager_accommodations.png) | ![Application Reviews](public/screenshots/manager_applications.png) |

| Complaints Logs | Manager Activity Logs |
| :---: | :---: |
| ![Complaints Logs](public/screenshots/manager_complaints.png) | ![Activity Logs](public/screenshots/manager_logs.png) |

### Admin / Landlord Portal (`/admin`)
Housing Administrators handle final tenant sign-off, room assignments, payments billing collections, database entries, and generate analytical reports.

| Admin Dashboard | Accommodations CRUD | Billings Management |
| :---: | :---: | :---: |
| ![Admin Dashboard](public/screenshots/admin_dashboard.png) | ![Accommodations CRUD](public/screenshots/admin_accommodations.png) | ![Billings](public/screenshots/admin_billing.png) |

| Admin Audit Logs | PDF/CSV Analytics Reports | Room Layouts | Users Directory |
| :---: | :---: | :---: | :---: |
| ![Audit Logs](public/screenshots/admin_logs.png) | ![Reports](public/screenshots/admin_reports.png) | ![Rooms](public/screenshots/admin_rooms.png) | ![Users](public/screenshots/admin_users.png) |

### System Admin Portal (`/sys`)
Sysadmins manage user roles, overwrite system-wide variables, create property records, and evaluate immutable audit logs.

| SysAdmin Dashboard | System Config | Properties & Dorms |
| :---: | :---: | :---: |
| ![SysAdmin Dashboard](public/screenshots/sysadmin_dashboard.png) | ![System Config](public/screenshots/sysadmin_config.png) | ![Dorms Management](public/screenshots/sysadmin_dorms.png) |

| Immutable Audit Logs | User Management |
| :---: | :---: |
| ![System Audit Logs](public/screenshots/sysadmin_logs.png) | ![User Directory](public/screenshots/sysadmin_users.png) |

---

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) + Client-side PGlite (IndexedDB) |
| **PWA** | Serwist (Service Worker) |
| **Styling** | Tailwind CSS v4 |
| **Code Quality** | Biome (Linter & Formatter) |
| **Deployment** | Vercel |

---

## Getting Started

### Project Structure

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
public/             # Static assets (images, fonts, logos, map style)
scripts/            # Database seed and mock data scripts
docs/               # Technical documentation & OpenAPI specifications
srs.md              # Software Requirements Specification
biome.json          # Linter & formatter configuration
```

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/smmariquit/comsci-128
cd comsci-128
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Seeding

1. Run the sql script in the Supabase SQL editor:
 ```text
   scripts/mock-seed.sql
   ```
2. Build the matching mock authentication credentials:
 ```bash
   npx tsx scripts/seed-auth-users.ts
   ```

### Running Locally

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Acknowledgements

This project was developed in partial fulfillment of the requirements for CMSC 128 (Introduction to Software Engineering) at the [University of the Philippines Los Baños][uplb], Second Semester AY 2025–2026.

[next-badge]: https://img.shields.io/badge/Next.js-black?logo=next.js
[supabase-badge]: https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white
[tailwind-badge]: https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white
[ts-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white
[biome-badge]: https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white
[lucide-badge]: https://img.shields.io/badge/Lucide-F43F5E?logo=lucide&logoColor=white
[swagger-badge]: https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black
[uplb]: https://uplb.edu.ph/
