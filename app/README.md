# Leap

Leap is a modern study and learning app designed to help users prepare for IELTS and similar language exams. It provides personalized study plans, progress tracking, task management, and community features — all in a clean, responsive interface.

## Features

- **Task Management** — Daily micro-learning tasks across Listening, Reading, Writing, and Speaking
- **Study Plans** — Personalized 4-week roadmaps with calendar and schedule views
- **Progress Tracking** — Band score history, weekly activity, milestones, and stat cards
- **Study Groups** — Join and participate in community study groups
- **Notifications** — In-app notifications for reminders and achievements
- **Demo Mode** — Try the app without signing up via the demo account

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — fast build tool and dev server
- [Tailwind CSS v3](https://tailwindcss.com/) — utility-first styling
- [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/) — accessible UI components
- [Recharts](https://recharts.org/) — charting library
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — client-side data persistence (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/Snehpatelop/leap.git
cd leap/app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
├── src/
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/
│   │   ├── views/           # Page-level views (Dashboard, StudyPlan, Progress, Community)
│   │   ├── dashboard/       # Dashboard widgets (StreakCard, PointsCard, etc.)
│   │   ├── tasks/           # TaskPlayer component
│   │   ├── calendar/        # StudyCalendar component
│   │   └── ui/              # Reusable shadcn/ui primitives
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication (localStorage-based)
│   │   └── DataContext.tsx  # User data and persistence
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and data generators
│   └── types/               # TypeScript type definitions
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## License

MIT
