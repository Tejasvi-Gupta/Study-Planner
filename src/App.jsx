import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Assignments from './components/Assignments'
import TimeTable from './components/TimeTable'
import './App.css'

// ─── Initial Data ────────────────────────────────────────────────────────────
const INITIAL_ASSIGNMENTS = [
  { id: 1, title: 'Calculus Problem Set', subject: 'Mathematics', dueDate: '2026-04-02', priority: 'high',   status: 'pending',     progress: 30 },
  { id: 2, title: 'Essay: Industrial Revolution', subject: 'History',     dueDate: '2026-04-05', priority: 'medium', status: 'in-progress', progress: 65 },
  { id: 3, title: 'Lab Report — Titration',       subject: 'Chemistry',   dueDate: '2026-03-30', priority: 'high',   status: 'pending',     progress: 10 },
  { id: 4, title: 'Reading: Ch. 7–9',             subject: 'Literature',  dueDate: '2026-04-08', priority: 'low',    status: 'completed',   progress: 100 },
  { id: 5, title: 'Data Structures Assignment',   subject: 'CS',          dueDate: '2026-04-10', priority: 'medium', status: 'pending',     progress: 0  },
]

const INITIAL_TIMETABLE = [
  { id: 1, day: 'Monday',    subject: 'Mathematics', time: '08:00', duration: 90, room: 'Hall A-12', color: '#2a7c7c' },
  { id: 2, day: 'Monday',    subject: 'History',     time: '10:00', duration: 60, room: 'Room 204',  color: '#c84b31' },
  { id: 3, day: 'Tuesday',   subject: 'Chemistry',   time: '09:00', duration: 90, room: 'Lab B-3',   color: '#d4a853' },
  { id: 4, day: 'Tuesday',   subject: 'CS',          time: '11:30', duration: 60, room: 'Tech 101',  color: '#2d2d4e' },
  { id: 5, day: 'Wednesday', subject: 'Literature',  time: '08:30', duration: 60, room: 'Room 112',  color: '#e8833a' },
  { id: 6, day: 'Wednesday', subject: 'Mathematics', time: '10:00', duration: 90, room: 'Hall A-12', color: '#2a7c7c' },
  { id: 7, day: 'Thursday',  subject: 'History',     time: '09:00', duration: 60, room: 'Room 204',  color: '#c84b31' },
  { id: 8, day: 'Thursday',  subject: 'Chemistry',   time: '11:00', duration: 90, room: 'Lab B-3',   color: '#d4a853' },
  { id: 9, day: 'Friday',    subject: 'CS',          time: '08:00', duration: 90, room: 'Tech 101',  color: '#2d2d4e' },
  { id: 10,day: 'Friday',    subject: 'Literature',  time: '10:30', duration: 60, room: 'Room 112',  color: '#e8833a' },
]

// ─── App (Root — owns all state, drills props down) ──────────────────────────
export default function App() {
  const [activeTab, setActiveTab]         = useState('dashboard')
  const [assignments, setAssignments]     = useState(INITIAL_ASSIGNMENTS)
  const [timetable, setTimetable]         = useState(INITIAL_TIMETABLE)
  const [studentName]                     = useState('Aryan')
  const [theme, setTheme]                 = useState('dark')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }

  // ── Assignment helpers ──────────────────────────────────────────────────
  function addAssignment(newA) {
    setAssignments(prev => [...prev, { ...newA, id: Date.now(), progress: 0, status: 'pending' }])
  }
  function updateAssignment(id, updates) {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }
  function deleteAssignment(id) {
    setAssignments(prev => prev.filter(a => a.id !== id))
  }

  // ── Timetable helpers ───────────────────────────────────────────────────
  function addSlot(newSlot) {
    setTimetable(prev => [...prev, { ...newSlot, id: Date.now() }])
  }
  function deleteSlot(id) {
    setTimetable(prev => prev.filter(s => s.id !== id))
  }

  // ── Derived stats drilled to Dashboard ─────────────────────────────────
  const stats = {
    total:       assignments.length,
    completed:   assignments.filter(a => a.status === 'completed').length,
    inProgress:  assignments.filter(a => a.status === 'in-progress').length,
    pending:     assignments.filter(a => a.status === 'pending').length,
    overdue:     assignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'completed').length,
    upcomingClasses: timetable.length,
    subjects: [...new Set(timetable.map(s => s.subject))].length,
  }

  return (
    <div className="app-shell">
      {/* Sidebar receives activeTab + setter */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} studentName={studentName} stats={stats} theme={theme} toggleTheme={toggleTheme} />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            assignments={assignments}
            timetable={timetable}
            stats={stats}
            studentName={studentName}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'assignments' && (
          <Assignments
            assignments={assignments}
            onAdd={addAssignment}
            onUpdate={updateAssignment}
            onDelete={deleteAssignment}
          />
        )}
        {activeTab === 'timetable' && (
          <TimeTable
            timetable={timetable}
            onAdd={addSlot}
            onDelete={deleteSlot}
          />
        )}
      </main>
    </div>
  )
}
