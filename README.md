# CursoFlow

![CursoFlow banner](public/images/banner.png)

**CursoFlow** is a study management app for students and lifelong learners: organize courses, track progress, and stay focused with a Pomodoro timer, analytics, and achievements—wrapped in a dark, glass-style UI.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design notes](#design-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Area | What you get |
|------|----------------|
| **Focus** | Pomodoro timer for sessions and breaks, with cues to stay on track |
| **Courses** | Create, edit, and categorize courses in one place |
| **Analytics** | Dashboards for consistency, milestones, and time by subject |
| **Achievements** | Goals and streaks to keep motivation high |
| **UI** | Dark “midnight cyber” theme, glass surfaces, and motion for feedback |

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Components | [Radix UI](https://www.radix-ui.com/) |
| Motion | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Charts | [Recharts](https://recharts.org/) |

Other notable libraries include `zod`, `react-hook-form`, `next-themes`, and `sonner`.

---

## Getting started

### Prerequisites

- **Node.js** 18.18+ or 20+ (recommended for current Next.js)
- **pnpm**, **npm**, or **yarn**

### Install and run

```bash
git clone https://github.com/Vctorqui/cursoflow.git
cd cursoflow
pnpm install   # or: npm install / yarn
pnpm dev       # or: npm run dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
pnpm build
pnpm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Optimized production build |
| `pnpm start` | Run the production server (after `build`) |
| `pnpm lint` | ESLint via Next.js config |

---

## Project structure

Layout follows a layered style: domain and application logic stay separate from UI and infrastructure.

```text
cursoflow/
├── app/                  # Next.js App Router (routes, layouts)
├── public/               # Static assets (images, icons)
└── src/
    ├── domain/           # Entities and core rules
    ├── application/      # Use cases and orchestration
    ├── infrastructure/   # Persistence and external adapters
    ├── ui/               # React components
    ├── hooks/            # Shared hooks
    └── lib/              # Utilities and helpers
```

- **Domain** — Framework-agnostic business concepts.
- **Application** — How domain behavior is composed for the app.
- **UI / hooks** — Presentation and reusable stateful logic.

---

## Design notes

CursoFlow prioritizes **clarity** and **flow**: glass-style layers for depth without noise, high-contrast dark surfaces with accent color, and small animations for feedback.

---

## Contributing

Contributions are welcome. A typical flow:

1. **Fork** the repository and create a branch from the default branch (`main` or `dev`, whichever is active for releases).
2. **Make focused changes** — one logical concern per PR when possible.
3. **Match the codebase** — follow existing patterns for naming, file layout, and imports; run the linter before opening a PR.
4. **Test locally** — `pnpm dev` for manual checks; `pnpm build` to ensure the app compiles.
5. **Open a pull request** with a short description of what changed and why.

If you are unsure about a larger change, open an issue first to align on direction.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with care by [Victor Quiñones](https://github.com/Vctorqui).
