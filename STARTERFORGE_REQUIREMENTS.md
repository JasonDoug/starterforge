# 📦 StarterForge – Requirements Specification

## 🎯 Product Goal
Create a web-based tool that guides users through building a customized starter project template via a step-by-step wizard interface. At the end, the user receives a downloadable or GitHub-pushable starter project scaffold based on their selections.

---

## 🪄 Wizard Flow Overview

1. Project Type Selection
2. Frontend Tech Selection
3. Backend Tech Selection
4. Database & Storage Options
5. Auth & User System
6. Deployment & DevOps
7. Optional Features
8. Output Preferences

---

## 🧩 Step 1 – Project Type Selection

- Let users choose one:
  - Web App (Full Stack)
  - Frontend Only
  - Backend/API Only
  - CLI Tool
  - Browser Extension
  - Microservice / Worker
  - Custom / Blank Template
- Only one project type allowed
- Descriptions and example use cases required
- Toggle: “Advanced Mode” = total customization
- Persist selection in config:
```json
{ "project_type": "web_app" }
```

---

## 🎨 Step 2 – Frontend Tech Selection

- Shown if applicable
- Choose one:
  - React, Vue, Svelte, SolidJS, Next.js, Plain HTML/CSS/JS
- UI libraries (multi-select):
  - Tailwind CSS, shadcn/ui, Chakra UI, Material UI, etc.
- Config example:
```json
{ "frontend": { "framework": "react", "ui_libraries": ["tailwindcss", "shadcn"] } }
```

---

## 🧠 Step 3 – Backend Tech Selection

- Shown if applicable
- Choose runtime + framework:
  - Node (Express, Fastify), Python (FastAPI, Django), Go (Fiber), Deno, Rust, etc.
- Optional toggles:
  - REST, GraphQL, Admin UI, Service Layer
- Config example:
```json
{ "backend": { "language": "python", "framework": "fastapi", "features": ["rest_api", "admin_ui"] } }
```

---

## 🗄️ Step 4 – Database & Storage Options

- Choose one or more:
  - SQLite, PostgreSQL, MySQL, MongoDB, Redis, Firebase, Supabase
- ORM options:
  - Prisma, SQLAlchemy, Mongoose, GORM, etc.
- Model generator (optional)
- Config example:
```json
{ "database": { "engines": ["postgresql"], "orm": "prisma", "cloud_hosted": true, "models": ["user", "post"] } }
```

---

## 🔐 Step 5 – Auth & User System

- Options:
  - None, Email/Password, OAuth, Clerk, Auth0, Firebase
- Optional:
  - UI components, RBAC, JWT, password reset
- Config example:
```json
{ "auth": { "provider": "clerk", "features": ["email_verification", "rbac"], "include_ui": true } }
```

---

## 🚀 Step 6 – Deployment & DevOps

- Choose deployment target(s):
  - Vercel, Netlify, Railway, Docker, AWS, etc.
- Toggle:
  - GitHub Actions CI/CD
  - Dockerfile / Compose
- Config example:
```json
{ "devops": { "deployment_targets": ["vercel"], "ci_cd": true, "docker": { "enabled": true, "compose": true } } }
```

---

## 🧩 Step 7 – Optional Features

- Multi-select from:
  - API Docs, Admin Panel, Dark Mode, Stripe, Analytics, CMS, i18n, Email service, AI/LLM starter, etc.
- Optional demo data
- Config example:
```json
{ "optional_features": [ { "feature": "api_docs", "tool": "swagger", "include_demo": true } ] }
```

---

## 📦 Step 8 – Output Preferences

- Choose:
  - Download zip, Push to GitHub, Open in StackBlitz, etc.
- GitHub OAuth support
- Auto-generate README
- Final summary page with edit options
- Config example:
```json
{ "output": { "format": ["zip", "github"], "repo": { "name": "my-starter-project", "visibility": "private" } } }
```