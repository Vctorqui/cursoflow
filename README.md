# 🌊 CursoFlow

![CursoFlow Banner](public/images/banner.png)

> **Empowering your learning journey with focus, structure, and style.**

CursoFlow is a premium study management application designed to help students and lifelong learners organize their courses, track their progress, and maintain deep focus using a state-of-the-art interactive UI.

---

## ✨ Key Features

### ⏳ Smart Focus Mode

Stay in the zone with our integrated **Pomodoro Timer**. Customize your study sessions, track breaks, and receive subtle motivational cues to keep you going.

### 📚 Course Management

Effortlessly organize your academic or personal learning. Create, edit, and categorize courses with a streamlined interface that keeps your syllabus at your fingertips.

### 📈 Progress Analytics

Visualize your growth. Our interactive dashboards show your study consistency, completed milestones, and time distribution across different subjects.

### 🏆 Gamified Achievements

Stay motivated with our rewards system. Unlock achievements as you reach study goals and maintain streaks, turning productivity into a rewarding experience.

### 🎨 Premium Glassmorphism UI

Experience a "Midnight Cyber" aesthetic. A sleek, OLED-black dark theme combined with vibrant orange accents and frosted-glass effects for a truly modern feel.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Vctorqui/cursoflow.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

CursoFlow follows a modular and decoupled architecture, separating business logic from UI and technical implementation.

```text
cursoflow/
├── app/                  # Next.js App Router (Pages & Layouts)
├── public/               # Static assets (Images, Icons)
└── src/
    ├── domain/           # Core business entities and rules
    ├── application/      # Use cases and application orchestration
    ├── infrastructure/   # Data persistence and external service implementations
    ├── ui/               # Reusable React components and UI logic
    ├── hooks/            # Custom React hooks for shared logic
    └── lib/              # Shared utility functions and helpers
```

### 🗝️ Key Architectural Highlights

- **Domain-Driven**: The core logic resides in `src/domain`, making it independent of any framework.
- **Application Layer**: Orchestrates how the domain logic is used within the app.
- **UI & Hooks**: Separation of visual components (`ui`) and stateful logic (`hooks`) for better testability.

---

## 📐 Design Philosophy

CursoFlow is built on the principles of **visual clarity** and **uninterrupted flow**.

- **Glassmorphism**: Layered transparency to create depth without clutter.
- **Cyber Aesthetic**: High-contrast dark mode with neon accents to reduce eye strain and focus attention.
- **Micro-interactions**: Subtle animations that provide immediate feedback and enhance the premium feel.

---

Created with ❤️ by [Victor Quiñones](https://github.com/Vctorqui)
