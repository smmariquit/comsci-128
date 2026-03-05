# CMSC 128

Next.js project for CMSC 128.

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

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
