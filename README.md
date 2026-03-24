#  Multi-View Project Tracker

A high-performance frontend project management tool built with **React + TypeScript**, featuring Kanban, List (virtualized), and Timeline views with custom drag-and-drop and simulated real-time collaboration.

---

##  Features

###  Multi-View UI
- Kanban board (drag-and-drop between columns)
- List view with **virtual scrolling** (handles 500+ tasks smoothly)
- Timeline (Gantt-style) view with horizontal scrolling

---

###  Advanced Functionality
- Custom drag-and-drop (no libraries)
- Virtual scrolling (no libraries)
- URL-synced filters (shareable & persistent)
- Simulated real-time collaboration indicators

---

###  Task Details
- Title, assignee (initials avatar)
- Priority badge (color-coded)
- Due date with:
  - "Due Today"
  - Overdue indicators

---

###  Filters
- Status, Priority, Assignee (multi-select)
- Due date range
- Synced with URL query params

---

###  Collaboration
- Simulated active users
- Live task presence indicators
- Avatar stacking with overflow (+1)

---

##  Tech Stack

- React + TypeScript
- Zustand (state management)
- Tailwind CSS
- Vite

---

##  Setup Instructions

```bash
npm install
npm run dev
