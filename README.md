# AIC Chang'ombe Church Management System (CMS) – Setup

This repo includes an initial Prisma setup for Postgres covering:
- Auth & RBAC (Users, Roles)
- Members & Families
- Announcements
- Events, RSVPs, Attendance, Roster
- Offerings & Donations
- Assets
- Finance & Petty Cash
- Procurement
- Sermons (public website)

## Prerequisites
- Node.js 18+
- PostgreSQL 13+

## Getting Started
1. Copy env file and update the connection string:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Optional: open Prisma Studio:
```bash
npm run prisma:studio
```

Database name defaults to `aic_changombe` in `.env.example`. Update as needed.

## Next Steps
- Ask for: "Generate Express API scaffolding with JWT + RBAC"
- Or: "Create Next.js public site shell (purple/white/black theme, AIC Chang'ombe)"