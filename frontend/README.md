# 📚 StudyPlanner

A modern, responsive Study Planner built with **React + Vite**, featuring Dark/Light mode, component drilling, assignments tracker, dashboard, and a weekly timetable.

## 🖥️ Live Demo
<!-- Add your deployed link here after deploying -->
> Coming soon

## ✨ Features

- 📊 **Dashboard** — stats overview, upcoming deadlines, today's classes, subject progress
- ✅ **Assignments** — add, edit, delete, filter, sort assignments with progress tracking
- 🗓️ **Time Table** — weekly grid + list view, add/remove class slots
- 🌗 **Dark / Light Mode** — toggle with smooth transitions
- 🎨 **Custom Color Palette** — `#0B0C10` · `#1F2833` · `#C5C6C7` · `#66FCF1` · `#45A29E`
- ⚛️ **Component Drilling** — all state managed in `App.jsx`, drilled via props

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- npm >= 7

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/study-planner.git

# Navigate into project
cd study-planner

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🗂️ Project Structure

```
study-planner/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx / .css
│   │   ├── Dashboard.jsx / .css
│   │   ├── Assignments.jsx / .css
│   │   └── TimeTable.jsx / .css
│   ├── App.jsx         ← Root component (owns all state)
│   ├── App.css
│   ├── index.css       ← Global styles + CSS variables
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

## 🌐 Deployment

This project can be deployed to:
- **Vercel** — `npm i -g vercel && vercel`
- **Netlify** — drag & drop the `dist/` folder
- **GitHub Pages** — see deployment section below

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Add `base` to `vite.config.js`:
   ```js
   base: '/study-planner/'
   ```

4. Run:
   ```bash
   npm run deploy
   ```

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| CSS Variables | Theming / Dark Mode |
| Component Drilling | State Management |

## 📄 License
MIT
