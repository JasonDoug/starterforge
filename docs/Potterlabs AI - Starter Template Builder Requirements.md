**core features and requirements**
"Starter Template Builder"

This will be an interactive wizard-driven tool
**overall goal** 
**functional requirements**



### Project Name (Working Title)

**StarterForge** (we can rename later)

* * *

### Product Goal

Create a web-based tool that guides users through building a customized starter project template via a step-by-step wizard interface. At the end, the user receives a downloadable (or GitHub-pushable) starter project scaffold based on their selections.

* * *

### Wizard Steps (Initial Flow)

We’ll write detailed requirements for each step, but first let’s outline the typical user flow:

1. **Project Type Selection**  
    _E.g., Web App, API, CLI Tool, Static Site, etc._
    
2. **Frontend Tech Selection** (if applicable)  
    _E.g., React, Vue, Svelte, Tailwind, shadcn/ui_
    
3. **Backend Tech Selection** (if applicable)  
    _E.g., Node.js, Python, FastAPI, Django, Express, Go, etc._
    
4. **Database & Storage Options**  
    _E.g., SQLite, PostgreSQL, Firebase, Redis, Supabase, etc._
    
5. **Auth & User System**  
    _E.g., Email/password, OAuth, Clerk/Auth0, or none_
    
6. **Deployment & DevOps**  
    _E.g., Dockerize, GitHub Actions CI, Vercel/Netlify config, Railway starter_
    
7. **Optional Features**  
    _E.g., API Docs, Admin Panel, Dark Mode Toggle, i18n, Stripe integration_
    
8. **Output Preferences**  
    _E.g., Zip download, GitHub repo push, show README instructions_
    

* * *
Step 1 (“Project Type Selection”) 
* * *

***Step 1: Project Type Selection**.

* * *

### Step 1 – Project Type Selection

#### User Story

_As a user, I want to select the type of project I’m building so the system can pre-load relevant tech stack and configuration options in later steps._

* * *

#### Functional Requirements

1. **Display a list of starter project types**
    
    * Project types must include at minimum:
        
        * Web App (Full Stack)
            
        * Frontend Only (Static Site or SPA)
            
        * Backend/API Only
            
        * CLI Tool
            
        * Browser Extension
            
        * Microservice / Worker
            
        * Custom / Blank Template
            
2. **Allow selection of one project type only**
    
    * The selection must persist to the next steps.
        
    * Changing the type should trigger a confirmation if already-selected options from later steps would be reset.
        
3. **Each option must show a short description and example use cases**  
    Example:
    
    * **CLI Tool**  
        _A command-line tool written in Node.js, Python, etc. Example: Linting script, deployment tool._
        
4. **Advanced Mode toggle (optional)**
    
    * Enables users to build from an empty slate with total customization.
        
    * Skips preset assumptions tied to project type.
        
5. **UX Consideration**
    
    * Highlight recommended options based on user input or past use (if user is logged in).
        
    * Use icons or illustrations to make selection intuitive.
        
6. **Data Contract**  
    When selected, the project type is stored in config like:
    
    ```json
    {
      "project_type": "web_app"
    }
    ```
    

* * *

**Step 2: Frontend Tech Selection**

* * *

### Step 2 – Frontend Tech Selection

#### User Story

_As a user, I want to choose a frontend framework and UI stack so the starter template includes the tools and structure I need for building the UI._

* * *

#### Functional Requirements

1. **Display a list of frontend technologies (if applicable)**
    
    * Only shown if selected project type supports frontend.
        
    * Framework options must include:
        
        * React
            
        * Vue
            
        * Svelte
            
        * Next.js / Nuxt (optional advanced)
            
        * SolidJS (optional advanced)
            
        * Plain HTML/CSS/JS
            
2. **User may select one or none**
    
    * “None” is valid for backend-only, CLI, or microservice types.
        
    * System must skip UI-layer config if none is chosen.
        
3. **Display list of optional UI libraries/components per framework**
    
    * Based on selected framework, show supported UI kits:
        
        * React:
            
            * Tailwind CSS
                
            * shadcn/ui
                
            * Chakra UI
                
            * Material UI
                
        * Vue:
            
            * Vuetify
                
            * Tailwind CSS
                
        * Svelte:
            
            * SvelteKit UI, Skeleton, Tailwind CSS
                
    * Allow multiple selections (e.g., Tailwind + shadcn)
        
4. **Preview of template structure based on choices**
    
    * Optional: show sample folder layout or README excerpt preview.
        
5. **Data Contract Example**
    
    ```json
    {
      "frontend": {
        "framework": "react",
        "ui_libraries": ["tailwindcss", "shadcn"]
      }
    }
    ```
    
6. **Dynamic Validation**
    
    * If the user selects a backend that doesn’t pair well with the frontend (e.g., Deno + Vue), show a warning or suggest alternatives.
        
7. **Skip Logic**
    
    * If project type is “CLI tool” or “Backend/API Only”, skip this step entirely.
        

* * *

**Step 3 – Backend Tech Selection**

* * *

### Step 3 – Backend Tech Selection

#### User Story

_As a user, I want to choose a backend framework or runtime so my starter template is scaffolded with the correct project structure, routing, and tooling._

* * *

#### Functional Requirements

1. **Display list of backend runtimes and frameworks**
    
    * Only shown if project type supports backend (e.g., Web App, Backend/API, Microservice).
        
    * User must select one of:
        
        * **Node.js**
            
            * Express
                
            * Fastify
                
            * NestJS
                
        * **Python**
            
            * FastAPI
                
            * Django (optional)
                
            * Flask (optional)
                
        * **Go**
            
            * Go Fiber
                
            * Echo
                
        * **Rust** (optional advanced)
            
            * Actix Web
                
        * **Deno**
            
            * Oak
                
        * **Blank** (no framework, just runtime)
            
2. **Display optional backend features**
    
    * Allow user to toggle:
        
        * REST API scaffold
            
        * GraphQL API (if supported by stack)
            
        * Job queue support (e.g., BullMQ, Celery, etc.)
            
        * Admin UI/API docs (e.g., Swagger, ReDoc)
            
3. **Dependency Injection / Service Layer toggle**
    
    * For more complex stacks (NestJS, FastAPI, etc.), offer to include DI patterns and service structure.
        
4. **Data Contract Example**
    
    ```json
    {
      "backend": {
        "language": "python",
        "framework": "fastapi",
        "features": ["rest_api", "admin_ui"]
      }
    }
    ```
    
5. **Mutual exclusions / conflict resolution**
    
    * Prevent invalid combos (e.g., GraphQL + Oak unless user enables an add-on lib).
        
6. **Informational Descriptions**
    
    * Each framework must include:
        
        * Description
            
        * Pros/cons
            
        * Example project link (optional)
            

* * *

Next: **Step 4 – Database & Storage Options**  
Shall I continue?

* * *




### 🗄️ Step 4 – Database & Storage Options

#### User Story

_As a user, I want to choose what database or storage systems my project will use so my starter template includes the appropriate connection setup, models, and sample config._

* * *

#### Functional Requirements

1. **Display database engine choices**
    
    * Allow user to select one or more (depending on stack support):
        
        * SQLite (default for local dev)
            
        * PostgreSQL
            
        * MySQL
            
        * MongoDB
            
        * Redis (cache/session/job queue)
            
        * Firebase (NoSQL + auth)
            
        * Supabase
            
        * PlanetScale
            
        * "None" (no DB setup)
            
2. **Auto-select sensible default for project type**
    
    * E.g., SQLite for CLI or local tools, PostgreSQL for full-stack web apps.
        
3. **Allow cloud-hosted database preset toggle**
    
    * Show checkbox for "Use hosted DB config template" (e.g., Supabase, Neon, Planetscale)
        
    * Pre-fills `.env` example and setup scripts.
        
4. **Optional: ORM/Query Layer selection**
    
    * If applicable for backend:
        
        * Prisma (Node)
            
        * SQLAlchemy (Python)
            
        * Mongoose (MongoDB)
            
        * GORM (Go)
            
    * Optional toggle to skip ORM setup.
        
5. **Configure sample schema or models**
    
    * Let user optionally define a few example models (e.g., `User`, `Post`)
        
    * Auto-generate migration or schema files where supported
        
6. **Data Contract Example**
    
    ```json
    {
      "database": {
        "engines": ["postgresql"],
        "orm": "prisma",
        "cloud_hosted": true,
        "models": ["user", "post"]
      }
    }
    ```
    
7. **Validation**
    
    * Ensure ORM choice is compatible with selected backend framework.
        
8. **Skip logic**
    
    * Skip this step entirely if project type is "Frontend Only" and no auth or API is selected.
        

* * *

Next up: **Step 5 – Auth & User System**


* * *

* * *

### 🔐 Step 5 – Auth & User System

#### User Story

_As a user, I want to choose how authentication works in my project so that the starter template includes user management scaffolding and necessary integrations._

* * *

#### Functional Requirements

1. **Show auth system options**
    
    * Present options based on selected project type and stack:
        
        * None (skip auth)
            
        * Email & Password (local DB)
            
        * OAuth (Google, GitHub, etc.)
            
        * Magic Link / Passwordless
            
        * Third-Party Auth Providers:
            
            * Clerk.dev
                
            * Auth0
                
            * Supabase Auth
                
            * Firebase Auth
                
2. **Backend-dependent filtering**
    
    * Disable incompatible options if backend lacks required SDKs or integration support.
        
3. **Frontend UI auth component toggle**
    
    * If frontend is selected, ask:
        
        * “Include login/signup UI components?”
            
        * If yes, scaffold views/forms/components.
            
4. **Add-on features**
    
    * Allow toggling:
        
        * Email verification flow
            
        * Forgot password / reset flow
            
        * Role-based access control (RBAC)
            
        * Session vs JWT token auth
            
5. **Environment variable config**
    
    * Include pre-filled `.env.example` for selected auth method(s).
        
6. **Data Contract Example**
    
    ```json
    {
      "auth": {
        "provider": "clerk",
        "features": ["email_verification", "rbac"],
        "include_ui": true
      }
    }
    ```
    
7. **Skip logic**
    
    * If project type is CLI or microservice with no user handling, skip this step.
        

* * *

Next is **Step 6 – Deployment & DevOps**


* * *


* * *

### 🚀 Step 6 – Deployment & DevOps

#### User Story

_As a user, I want to configure how the project will be deployed and tested so the starter template includes deployment scripts, CI/CD configs, and containerization as needed._

* * *

#### Functional Requirements

1. **Select deployment target(s)**
    
    * Allow one or more of:
        
        * Vercel
            
        * Netlify
            
        * Railway
            
        * Render
            
        * AWS (Lambda, EC2)
            
        * Docker Only
            
        * GitHub Pages (for static)
            
        * Local only (dev only)
            
2. **Optional CI/CD setup**
    
    * Ask:
        
        * “Include GitHub Actions for testing & deploy?”
            
        * Include basic pipeline:
            
            * Lint → Test → Build → Deploy
                
3. **Docker support toggle**
    
    * Offer:
        
        * “Include Dockerfile?”
            
        * “Include Docker Compose?” (if DB selected)
            
4. **Environment configuration**
    
    * Generate `.env.example` + README instructions
        
    * If hosted DB or Auth provider selected, prefill placeholder values
        
5. **Deployment script options (optional advanced)**
    
    * Offer bash/npm deploy scripts for:
        
        * First-time deploy
            
        * Reset DB/migrations
            
        * Cloud deploy
            
6. **Data Contract Example**
    
    ```json
    {
      "devops": {
        "deployment_targets": ["vercel"],
        "ci_cd": true,
        "docker": {
          "enabled": true,
          "compose": true
        }
      }
    }
    ```
    
7. **Validation**
    
    * Filter deployment targets based on project type:
        
        * E.g., Netlify not offered for backend-only.
            
        * CLI tools → suggest GitHub Release or PyPI/NPM publish.
            

* * *

Next: **Step 7 – Optional Features**



* * *


* * *

### 🧩 Step 7 – Optional Features

#### User Story

_As a user, I want to add optional features or integrations to enhance the functionality of my starter template._

* * *

#### Functional Requirements

1. **Show a list of optional add-ons**
    
    * Allow multi-select of any of the following:
        
        * **API Docs** (Swagger, Redoc, Postman)
            
        * **Admin Dashboard** (e.g., React Admin, TUI-based, custom panel)
            
        * **Dark Mode Toggle**
            
        * **i18n (Internationalization)** support
            
        * **Stripe Integration**
            
        * **Markdown Rendering / Blog Engine**
            
        * **CMS Integration** (Headless CMS like Sanity, Contentful)
            
        * **Analytics** (Plausible, PostHog, Google Analytics)
            
        * **Test Suite Setup** (Jest, Pytest, Vitest, etc.)
            
        * **Email Service Setup** (e.g., Resend, Mailgun)
            
        * **AI/LLM Starter Code** (OpenAI SDK, LangChain, etc.)
            
2. **Show compatibility warnings**
    
    * e.g., Stripe only works if backend & frontend both exist
        
    * Analytics requires frontend
        
3. **Per-feature toggle for demo data or not**
    
    * Ask: “Include example usage or blank implementation?”
        
4. **Auto-injection into project**
    
    * Add example routes, config, and boilerplate where needed.
        
5. **Data Contract Example**
    
    ```json
    {
      "optional_features": [
        {
          "feature": "api_docs",
          "tool": "swagger",
          "include_demo": true
        },
        {
          "feature": "analytics",
          "tool": "plausible"
        }
      ]
    }
    ```
    
6. **Allow custom script hook insertion** (optional advanced)
    
    * Power users can write shell commands or npm/yarn scripts to run post-scaffold.
        

* * *

Next and final step: **Step 8 – Output Preferences**

Continue?

* * *

* * *

### 📦 Step 8 – Output Preferences

#### User Story

_As a user, I want to choose how to receive my starter template so I can immediately begin development or share it with others._

* * *

#### Functional Requirements

1. **Offer output format options**
    
    * User selects one or more:
        
        * Download as `.zip`
            
        * Push to GitHub repository (via OAuth)
            
        * Copy to clipboard (CLI scaffold only)
            
        * Open in online IDE (e.g., StackBlitz, Gitpod, Replit)
            
2. **GitHub integration**
    
    * If selected:
        
        * Prompt for GitHub OAuth
            
        * Ask for repo name, visibility (public/private)
            
        * Push initial commit with README and scaffolded files
            
3. **Include README file**
    
    * README is auto-generated from user’s selections
        
    * Includes:
        
        * Project overview
            
        * How to run locally
            
        * Deployment instructions
            
        * Tech stack list
            
        * Commands/scripts
            
4. **Show summary review before generation**
    
    * Step-by-step review of what was selected
        
    * Allow user to go back and modify steps
        
5. **Final scaffold generation**
    
    * Call project generator with full config object
        
    * Log progress in terminal-style UI or loading display
        
6. **Telemetry toggle** (optional)
    
    * "Help us improve StarterForge by allowing anonymous usage tracking"
        
7. **Data Contract Example**
    
    ```json
    {
      "output": {
        "format": ["zip", "github"],
        "repo": {
          "name": "my-starter-project",
          "visibility": "private"
        }
      }
    }
    ```
    

* * *

✅ That’s the full 8-step flow fully detailed out.


**STARTERFORGE_REQUIREMENTS.md**  


* * *

* * *
**9 sprints** 
**25 development prompts**
Each sprint groups related work for a specific module or flow (e.g., Frontend Selection UI, Auth System, Output Generation).


* * *
* * *

### ✅ Immediate Next Steps

1. **Initialize Project Repo**
    
    * `git init starterforge && cd starterforge`
        
    * Decide: monorepo (e.g., TurboRepo, Nx) or separate backend/frontend folders?
        
2. **Pick Your Stack**
    
    * Frontend: likely React + shadcn/ui + Zustand or Redux
        
    * Backend: FastAPI or Express
        
    * Auth: Start with Clerk.dev or local mock auth
        
    * DevOps: GitHub + Docker + Vercel or Railway
        
3. **Scaffold Directory Layout**
    
    * E.g.,
        
        ```
        /apps/web        → frontend UI wizard
        /apps/api        → backend config processor + scaffolder
        /packages/core   → shared config logic/types
        ```
        
4. **Create the Config Schema**
    
    * This drives everything. Make this first.
        
    * Use Zod (TS) or Pydantic (Python) with full type coverage.
        
5. **Basic Wizard UI Shell**
    
    * Just a minimal flow: [Start] → [Step 1] → [Step 2] → [Summary]
        
    * Use Radix UI or shadcn/ui for layout
        
6. **CLI Scaffolder Stub (Optional)**
    
    * Build the first version to just output a folder with `README.md` and selected files
        

* * *


* * *
**the config schema is the backbone**


### 🔧 The Concept of the Config Schema

At the core of StarterForge is a **declarative configuration object** that represents all user choices made throughout the wizard. Instead of coupling logic directly to the UI, you use this centralized config to:

* Drive UI rendering (what options to show)
    
* Enforce rules (e.g. skip steps, validate combinations)
    
* Generate scaffolds (this is the source-of-truth for the generator engine)
    
* Enable reproducibility (can rehydrate from a config)
    

Think of it like `package.json`, `turbo.json`, or `vite.config.ts` — except it defines the entire project structure.

* * *

### 🧱 Structure Example

Here’s a minimal example:

```json
{
  "project_type": "web_app",
  "frontend": {
    "framework": "react",
    "ui_libraries": ["tailwindcss", "shadcn"]
  },
  "backend": {
    "language": "python",
    "framework": "fastapi",
    "features": ["rest_api", "admin_ui"]
  },
  "database": {
    "engines": ["postgresql"],
    "orm": "prisma",
    "cloud_hosted": true
  },
  "auth": {
    "provider": "clerk",
    "features": ["rbac"],
    "include_ui": true
  },
  "devops": {
    "deployment_targets": ["vercel"],
    "ci_cd": true,
    "docker": {
      "enabled": true,
      "compose": true
    }
  },
  "optional_features": [
    {
      "feature": "api_docs",
      "tool": "swagger"
    }
  ],
  "output": {
    "format": ["zip", "github"],
    "repo": {
      "name": "my-project",
      "visibility": "private"
    }
  }
}
```

* * *

### 📐 Why Schema Matters

* **Validation**: Ensure config is complete and valid before generating
    
* **Extensibility**: Add new features without breaking existing code
    
* **Decoupling**: UI wizard can emit config; CLI can consume config; generator builds from config
    

* * *

### 🛠 Tooling

| Stack | Schema Library |
| --- | --- |
| TypeScript | `zod` (best choice) |
| Python | `pydantic` |
| JSON | JSON Schema (for interoperability) |

* * *

### 🔄 Dev Flow Example

1. Wizard collects inputs → builds config
    
2. You save `.starterforge.config.json`
    
3. CLI tool runs:  
    `starterforge build --config starterforge.config.json`
    
4. Output: fully scaffolded repo
    

* * *

**starterforge.config.schema.ts**

* Validate wizard outputs
    
* Feed into the CLI generator
    
* Power future UI components
    

`starterforge build --config ...`

**starterforge-cli.mjs**

### 🧪 Usage (from terminal)

```bash
node starterforge-cli.mjs path/to/starterforge.config.json
```

* Validate the config using your Zod schema
    
* Generate an `output/<project_type>/README.md` summarizing the stack
    


* * *

### 🧱 Phase 1 – Core Output Structure


```
/output/<project_type>/
├── README.md
├── .env.example
├── package.json (optional)
├── /src
│   └── index.ts or main.py (based on backend.language)
└── /frontend (if selected)
    └── App.tsx or main.js
```
* Detect selected `backend.language`
    
* Create stub code in `/src`
    
* If frontend exists, create minimal frontend folder
    
* Add `.env.example` and `package.json` if Node is selected
    

CLI now generates a `scaffold.sh` file alongside the project files.  
📄 starterforge-cli.mjs (updated)


### Example Output

```
/output/web_app/
├── README.md
├── .env.example
├── scaffold.sh  ← you can run or edit this
├── package.json
├── /src/main.py or /src/index.js
└── /frontend/App.tsx
```

* Add richer boilerplates (e.g., real Express server or FastAPI app)
    
* Plug in `.gitignore`, linting, formatting tools
    
* Or start building the web-based wizard on top of this CLI
    


`--mode` switch:
    
    * `--mode scaffold-only`
        
    * `--mode script-only`
        
    * `--mode all` (default)
        
**we should use a real CLI framework** 

* * *

### 🧰 Which CLI Tool?

| Language | CLI Tool | Notes |
| --- | --- | --- |
| **TypeScript/Node** | [`commander`](https://github.com/tj/commander.js) | Popular, battle-tested, supports flags |
|  | [`yargs`](https://github.com/yargs/yargs) | Very flexible |
|  | [`sade`](https://github.com/lukeed/sade) | Tiny and fast |
| **Python** | `typer` | Modern, type-safe (based on Click) |
|  | `click` | Older, stable |

* * *

**Zod + Node**
* Switch to **`commander`** now
* Add the `--mode` switch with a default of `all`
    

retrofit the CLI with `commander` and add support for the three modes

* * *


Your initial `starterforge init` wizard (Steps 1–3, using `@clack/prompts`) is ready:

📄 **starterforge-init.mjs**

* * *

### ✅ Current Behavior

* Prompts for:
    
    1. Project type
        
    2. Frontend framework + UI libraries (if applicable)
        
    3. Backend language + framework (if applicable)
        
* At the end, asks where to save the config file
    
* Outputs a valid `starterforge.config.json`
    

* * *

Let me know when you’re ready to continue with Steps 4–8 (DB, auth, DevOps, features, output prefs), or plug this into the main CLI as a `starterforge init` subcommand.

* * *

* * *

🧰 Project: **StarterForge**
----------------------------

You're building a **config-driven starter project generator** with:

* A **CLI tool (`starterforge`)** to scaffold code projects
    
* A future **web UI** and **TUI wizard**, all powered by the same config engine
    

* * *

### ✅ Current System Capabilities

#### 🧠 Core CLI (`starterforge-cli.mjs`)

* Built using **Commander.js**
    
* Validates input using a full **Zod schema**
    
* Accepts a JSON config and dynamically scaffolds:
    
    * README, `.env.example`
        
    * Backend stubs (`main.py` or `index.js`)
        
    * Frontend stub (`App.tsx`)
        
* Supports `--mode`:
    
    * `scaffold-only`
        
    * `script-only`
        
    * `all` (default)
        
* Outputs a matching `scaffold.sh` script
    

#### 📄 Config-Driven Behavior

* Input JSON determines the scaffold output
    
* Current dynamic fields:
    
    * `project_type`, `frontend.framework`, `backend.language`
        
* Output adapts accordingly (e.g. React + Node vs CLI + Python)
    

* * *

### 🧪 `starterforge init` (Config Wizard)

You decided to integrate a full **interactive config builder** using [`@clack/prompts`](https://github.com/natemoo-re/clack):

* ✅ All 8 steps will be implemented
    
* ✅ Currently scaffolds Steps 1–3:
    
    * Project type
        
    * Frontend tech (if applicable)
        
    * Backend tech (if applicable)
        
* ✅ Prompts user where to save the output file
    
* 📄 Output: `starterforge.config.json` or custom filename
    

* * *

### 🔧 Upcoming Work (prioritized by you)

1. Complete `init` steps 4–8 (DB, auth, DevOps, features, output)
    
2. Add optional flags like `--output-dir`, `--dry-run`, `--verbose`
    
3. Connect `init` into the main CLI (`starterforge init`)
    
4. Prepare for richer scaffolding (Express, FastAPI templates)
    

* * *

You confirmed we’re on the same page when discussing:

* **StarterForge** = the tool
    
* **Generated project** = the output it builds
    
* And that config files are the “contracts” defining what gets built
    

* * *

Let me know what you want to tackle next:

* Complete the wizard
    
* Refactor/init integration
    
* Schema upgrade
    
* Or build toward a release-ready v0.1 CLI package
