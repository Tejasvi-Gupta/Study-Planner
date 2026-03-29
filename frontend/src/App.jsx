import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Assignments from './components/Assignments'
import TimeTable from './components/TimeTable'
import Auth from './components/Auth'
import api from './api'
import './App.css'

const INITIAL_TIMETABLE = []

export default function App() {
  const [activeTab, setActiveTab]     = useState('dashboard')
  const [assignments, setAssignments] = useState([])
  const [timetable, setTimetable]     = useState(INITIAL_TIMETABLE)
  const [theme, setTheme]             = useState('dark')
  const [loading, setLoading]         = useState(false)

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  )

  // ── Assignments API se fetch karo ───────────────────────────────────────
  useEffect(() => {
    if (user) fetchAssignments()
  }, [user])

  async function fetchAssignments() {
    try {
      setLoading(true)
      const res = await api.get("/tasks")
      setAssignments(res.data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }

  // ── Assignment helpers — API se ─────────────────────────────────────────
  async function addAssignment(newA) {
    try {
      const res = await api.post("/tasks", newA)
      setAssignments(prev => [...prev, res.data])
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

  async function updateAssignment(id, updates) {
    try {
      const res = await api.put(`/tasks/${id}`, updates)
      setAssignments(prev => prev.map(a => a._id === id ? res.data : a))
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  async function deleteAssignment(id) {
    try {
      await api.delete(`/tasks/${id}`)
      setAssignments(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  // ── Timetable helpers (abhi bhi local) ─────────────────────────────────
  function addSlot(newSlot) {
    setTimetable(prev => [...prev, { ...newSlot, id: Date.now() }])
  }
  function deleteSlot(id) {
    setTimetable(prev => prev.filter(s => s.id !== id))
  }

  const stats = {
    total:           assignments.length,
    completed:       assignments.filter(a => a.status === 'completed').length,
    inProgress:      assignments.filter(a => a.status === 'in-progress').length,
    pending:         assignments.filter(a => a.status === 'pending').length,
    overdue:         assignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'completed').length,
    upcomingClasses: timetable.length,
    subjects:        [...new Set(timetable.map(s => s.subject))].length,
  }

  if (!user) return <Auth onLogin={handleLogin} />

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentName={user.name}
        stats={stats}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            assignments={assignments}
            timetable={timetable}
            stats={stats}
            studentName={user.name}
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