<div align="center">

  <h1>✨ Flowline CRM</h1>

  <p>
    A minimalist, glassmorphic CRM for capturing leads, managing pipelines, tracking tasks, and visualizing performance.
    <br />
    <b>Clarity. Speed. Visual calm.</b>
  </p>

  <p>
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-database-schema">Schema</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <br />

  ![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
  ![Stack](https://img.shields.io/badge/Stack-React%20|%20Supabase%20|%20Tailwind-teal?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

</div>

---

## 📸 Screenshots

| Landing Page | Sign In |
|:---:|:---:|
| ![Landing](screenshots/landing.png) | ![Sign In](screenshots/signin.png) |

| Dashboard | Pipeline (Kanban) |
|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Pipeline](screenshots/pipeline.png) |

| Leads Table | Tasks Board |
|:---:|:---:|
| ![Leads](screenshots/leads.png) | ![Tasks](screenshots/tasks.png) |

| Settings | Global Search (Cmd+K) |
|:---:|:---:|
| ![Settings](screenshots/settings.png) | ![Search](screenshots/search.png) |

> **Note:** Add your own screenshots to the `/screenshots` folder and they will appear above.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                        │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐   │
│  │ Landing │  │   Auth   │  │ Workspace (Authenticated) │   │
│  │  Page   │  │ Login /  │  │   Dashboard │ Pipeline   │   │
│  │   /     │  │ Signup   │  │   Leads     │ Tasks       │   │
│  └─────────┘  └──────────┘  │   Settings  │ Cmd+K       │   │
│                              └──────────────────────────┘   │
│                                       │                      │
│                              React Router (auth guard)       │
│                              Framer Motion (transitions)     │
│                              Zustand-like Context (views)    │
└─────────────────────────────────┬────────────────────────────┘
                                  │  Supabase JS Client
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                         Supabase                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Auth   │  │  PostgreSQL  │  │      Storage         │   │
│  │ (email/  │  │  + RLS +    │  │  (avatars bucket)    │   │
│  │ password)│  │  Realtime   │  │                      │   │
│  └──────────┘  └──────────────┘  └──────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                         Vercel                               │
│            SPA rewrite → index.html                          │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Auth** — Supabase Auth handles email/password authentication. `App.tsx` listens for session changes and guards workspace routes.
2. **Data Access** — All CRUD operations go through the Supabase JS client directly from React components. No custom API server.
3. **Security** — Row-Level Security (RLS) policies on every table enforce that users can only access their own data.
4. **Realtime** — The `leads` table has realtime enabled, so pipeline changes sync across sessions instantly.
5. **Optimistic UI** — Status changes update local state immediately, then sync to Supabase. Failed writes trigger a re-fetch to revert.
6. **Storage** — Avatar uploads go to a Supabase Storage bucket with public read + authenticated write policies.

---

## 🚀 Features

### Landing Page
- Hero section with animated glassy orb video
- Feature cards highlighting CRM capabilities
- Social proof badge and logo bar
- CTA driving to signup

### Authentication
- Email/password sign-in and sign-up via Supabase Auth
- Session persistence with `onAuthStateChange` listener
- Shake animation on validation errors

### Dashboard
- **KPI Cards:** Pipeline Value, Active Leads, Conversion Rate, Deals Won
- **Area Chart:** 7-day lead acquisition trend
- **Bar Chart:** Lead value distribution by pipeline stage
- **Metrics:** Average deal size, win rate percentage
- **CSV Export:** One-click download of dashboard data

### Pipeline (Kanban)
- Drag-and-drop leads across 6 stages: **New → Contacted → Qualified → Proposal → Won** (+ Lost)
- Color-coded stage dots and value summaries per column
- Card context menu (edit/delete)
- Animated card transitions with Framer Motion
- Drop-zone highlighting during drag operations

### Leads
- Full table with search and filter
- Inline status change via dropdown
- Bulk select and delete
- CSV import with PapaParse (map columns to fields)
- CSV export of filtered/sorted data
- Row hover effects with lead avatars

### Tasks
- Dual view: **Kanban Board** + **Table List**
- Four status columns: To Do, In Progress, Waiting, Done
- Priority badges: Low (green), Medium (yellow), High (red)
- Link tasks to leads via `related_lead_id`
- Create/edit/delete with modal forms
- Due date display and search filter

### Settings
- Edit profile name and email
- Avatar upload via Supabase Storage or emoji picker
- Notification preference toggles
- Save confirmation with toast feedback

### Global
- **Cmd+K / Ctrl+K** global search overlay (leads + tasks via ILIKE)
- Collapsible glassmorphic sidebar with spring-animated width toggle
- Animated page/workspace transitions with `AnimatePresence`
- Responsive design across desktop and mobile
- Custom scrollbar styling

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | React 19 + TypeScript |
| **Bundler** | Vite 6 |
| **Styling** | Tailwind CSS 3.4 (custom glassmorphism utilities) |
| **Backend / DB** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **Routing** | React Router DOM v7 |
| **Animations** | Framer Motion 12 |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **CSV** | PapaParse 5 |
| **Deployment** | Vercel (SPA rewrite) |

---

## 📁 Project Structure

```
Flowline-crm/
├── App.tsx                    # Root: Router, auth guard, workspace state, modals
├── index.tsx                  # ReactDOM entry point
├── index.html                 # HTML shell (Inter + Fustat fonts)
├── index.css                  # Tailwind directives + scrollbar styles
├── types.ts                   # Lead, Task, PipelineStage, TaskStatus, etc.
├── constants.ts               # Mock data, pipeline column config
├── vite.config.ts             # Vite config (port 3000, @ alias)
├── tailwind.config.js         # Custom colors, fonts, glass shadows
├── vercel.json                # SPA rewrite rule
├── .env                       # Supabase URL + anon key
│
├── components/
│   ├── ui/
│   │   └── GlassComponents.tsx    # GlassCard, Button, Badge — shared primitives
│   ├── Sidebar.tsx                # Collapsible nav with glassmorphism
│   ├── Dashboard.tsx              # KPI cards, charts, export
│   ├── Pipeline.tsx               # Drag-and-drop Kanban board
│   ├── Leads.tsx                  # Table: search, bulk ops, CSV import/export
│   ├── Tasks.tsx                  # Task orchestrator (Board/List toggle)
│   ├── TaskBoard.tsx              # Kanban columns for tasks
│   ├── TaskList.tsx               # Table view for tasks
│   ├── Settings.tsx               # Profile, avatar upload, notifications
│   ├── LandingPage.tsx            # Marketing hero + features
│   ├── Auth.tsx                   # Login / Signup forms
│   ├── CreateLeadModal.tsx        # Lead create/edit modal
│   ├── TaskModal.tsx              # Task create/edit modal
│   ├── SearchOverlay.tsx          # Cmd+K global search
│   └── Logo.tsx                   # SVG logo
│
├── src/
│   ├── lib/
│   │   └── supabase.ts            # Supabase client init
│   └── vite-env.d.ts
│
└── supabase/
    └── schema.sql                 # DB schema, RLS, storage, triggers, seeds
```

---

## 🗄 Database Schema

### Tables

#### `profiles`
| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | FK to `auth.users` |
| `email` | `text` | User email |
| `full_name` | `text` | Display name |
| `avatar_url` | `text` | URL to uploaded avatar |
| `updated_at` | `timestamptz` | Last modified |

#### `leads`
| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK to `auth.users` |
| `name` | `text` | Lead name |
| `company` | `text` | Company name |
| `email` | `text` | Contact email |
| `phone` | `text` | Contact phone |
| `status` | `text` | Pipeline stage |
| `value` | `numeric` | Deal value |
| `owner` | `text` | Assigned owner |
| `source` | `text` | Lead source |
| `created_at` | `timestamptz` | Created timestamp |
| `updated_at` | `timestamptz` | Last modified |
| `notes` | `text` | Freeform notes |
| `avatar` | `text` | Lead avatar URL |

#### `tasks`
| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK to `auth.users` |
| `title` | `text` | Task title |
| `description` | `text` | Detailed notes |
| `status` | `enum` | To Do, In Progress, Waiting, Done |
| `priority` | `enum` | Low, Medium, High |
| `due_date` | `date` | Target completion date |
| `owner_email` | `text` | Assigned user email |
| `related_lead_id` | `uuid` | FK to `leads` |
| `created_at` | `timestamptz` | Created timestamp |
| `updated_at` | `timestamptz` | Last modified |
| `completed_at` | `timestamptz` | Set when status = Done |

#### `pipeline_stages`
| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK to `auth.users` |
| `name` | `text` | Stage name |
| `order` | `int` | Display order |
| `pipeline_id` | `uuid` | Pipeline identifier |

### Security
- **Row-Level Security (RLS)** enabled on all tables
- Users can only read/write rows where `user_id = auth.uid()`
- Auto-profile creation trigger fires on user signup
- Storage bucket `avatars` — public read, authenticated write

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/flowline-crm.git
cd flowline-crm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database
Run the SQL from `supabase/schema.sql` in your Supabase SQL Editor to create all tables, RLS policies, storage bucket, and triggers.

### 5. Start the dev server
```bash
npm run dev
```
The app runs at `http://localhost:3000`.

### 6. Build for production
```bash
npm run build
npm run preview
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please follow the **glassmorphism design system** (backdrop blur, translucent backgrounds, Inter font, soft shadows) when submitting UI changes.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/soumya">Soumya</a></p>
</div>
