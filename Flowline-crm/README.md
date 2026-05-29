
<div align="center">

  <h1>✨    FlowlineCRM: Tasks Module</h1>
  
  <p>
    A minimalist, glassmorphic task management workspace integrated directly into the CRM flow.
    <br />
    <b>Focus. Track. Achieve.</b>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-design-philosophy">Design</a> •
    <a href="#-database-schema">Schema</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <br />
  <br />

  ![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
  ![Tech](https://img.shields.io/badge/Stack-React%20|%20Supabase%20|%20Tailwind-teal?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

</div>

---

## 📖 Overview

The **Tasks Module** extends the CRM with a dedicated, focused environment for tracking work items related to leads and user activity. 

Moving away from external to-do lists, this module provides a seamless experience where tasks are "first-class entities"—linked intimately with Leads, Pipelines, and Dashboards—wrapped in a beautiful **glassmorphic UI** that feels lightweight and fast.

## 🚀 Features

### 1. Intuitive Workspace
- **Kanban Board View:** Drag-and-drop tasks between *To do*, *In progress*, *Waiting*, and *Done* columns with smooth parallax animations.
- **Power List View:** A dense, table-style view for bulk editing, sorting, and scanning high volumes of tasks.
- **Calendar Support:** (Beta) Visualize workload by due dates.

### 2. Deep CRM Integration
- **Lead Context:** Create and view tasks directly from a Lead's detail panel.
- **Pipeline Synergy:** Pipeline cards show task indicators; never lose track of the next step in a deal.
- **Smart Dashboard:** "Today's Tasks" widgets and activity streak counters to gamify productivity.

### 3. Rich Data Model
- **Prioritization:** Low, Medium, and High priority labeling with subtle visual cues.
- **Timestamps:** Due dates, times, and reminder capabilities.
- **Ownership:** Assign tasks to specific users with email linking.

### 4. Micro-Interactions & Gamification
- **Satisfying Completion:** "Confetti" bursts and checkmark animations when marking tasks as Done.
- **Inbox Zero:** Calm, illustrative empty states when all tasks are completed.
- **Real-time Feedback:** Toast notifications and optimistic UI updates for a snappy feel.

---

## 🎨 Design Philosophy

> *"It should feel visually consistent with the existing glassy, Inter-style CRM aesthetic while staying lightweight."*

This project strictly adheres to a **Minimalist Glassmorphism** design language:
* **Typography:** Inter font family, high line-heights, thin weights.
* **Visuals:** Off-white/Dark glass backgrounds, background blurs, 1px hairline borders, and soft shadows.
* **Motion:** Gentle parallax on drag, ease-out transitions on status changes.

---

## 🛠 Tech Stack

- **Frontend:** React (TypeScript)
- **Styling:** Tailwind CSS (Custom glassmorphic utility classes)
- **State Management:** React Context / Zustand
- **Backend / Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React (Thin, line-based style)
- **Animations:** Framer Motion

---

## 🗄 Database Schema

The data layer is built on **Supabase**. Below is the core structure of the `tasks` table:

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `title` | `text` | Short description of the task (Required) |
| `description` | `text` | Detailed notes |
| `status` | `enum` | `To do`, `In progress`, `Waiting`, `Done` |
| `priority` | `enum` | `Low`, `Medium`, `High` |
| `due_date` | `date` | Target completion date |
| `due_time` | `time` | Target completion time |
| `related_lead_id`| `uuid` | FK to `leads` table |
| `owner_email` | `text` | Email of the assigned user |
| `completed_at` | `timestamp` | Set automatically when status becomes 'Done' |

---

## ⚡ Getting Started

To run this project locally, follow these steps:

### 1. Clone the repo
```bash
git clone [https://github.com/yourusername/glass-crm-tasks.git](https://github.com/yourusername/glass-crm-tasks.git)
cd glass-crm-tasks

```

### 2. Install dependencies

```bash
npm install
# or
yarn install

```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### 4. Run the development server

```bash
npm run dev

```

Visit `http://localhost:5173` to view the app.

---

## 🤝 Contributing

Contributions are welcome! Please follow the design guidelines (Glassmorphism, Inter font) when submitting PRs.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
<p>Built with ❤️ by Soumya for productivity.</p>
</div>

```

```
