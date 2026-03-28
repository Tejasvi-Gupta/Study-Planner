import React, { useState } from 'react'
import './Assignments.css'

const SUBJECTS   = ['Mathematics', 'History', 'Chemistry', 'Literature', 'CS', 'Physics', 'Biology', 'Other']
const PRIORITIES = ['high', 'medium', 'low']
const STATUSES   = ['pending', 'in-progress', 'completed']

// ── AssignmentCard (child, drills onUpdate / onDelete) ────────────────────────
function AssignmentCard({ assignment, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [prog,    setProg]    = useState(assignment.progress)

  const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / 86400000)
  const overdue  = daysLeft < 0 && assignment.status !== 'completed'

  function saveProgress() {
    onUpdate(assignment.id, { progress: prog, status: prog === 100 ? 'completed' : prog > 0 ? 'in-progress' : 'pending' })
    setEditing(false)
  }

  return (
    <div className={`a-card priority-${assignment.priority} ${overdue ? 'overdue' : ''}`}>
      <div className="a-card-top">
        <div>
          <span className={`a-priority ${assignment.priority}`}>{assignment.priority}</span>
          <span className="a-subject">{assignment.subject}</span>
        </div>
        <div className="a-card-actions">
          <button className="icon-btn" onClick={() => setEditing(e => !e)} title="Edit progress">✏️</button>
          <button className="icon-btn danger" onClick={() => onDelete(assignment.id)} title="Delete">🗑</button>
        </div>
      </div>

      <h3 className="a-title">{assignment.title}</h3>

      <div className="a-meta">
        <span className={`a-due ${overdue ? 'overdue-text' : ''}`}>
          {overdue ? `⚠ Overdue by ${Math.abs(daysLeft)}d` : daysLeft === 0 ? '🔴 Due today' : `📅 ${daysLeft}d left`}
        </span>
        <span className={`a-status ${assignment.status}`}>{assignment.status.replace('-', ' ')}</span>
      </div>

      <div className="a-progress-row">
        <div className="a-progress-bar">
          <div className="a-progress-fill" style={{ width: `${assignment.progress}%` }} />
        </div>
        <span className="a-pct">{assignment.progress}%</span>
      </div>

      {editing && (
        <div className="a-edit-panel">
          <label>Update Progress: {prog}%</label>
          <input type="range" min="0" max="100" value={prog}
            onChange={e => setProg(Number(e.target.value))} />
          <div className="a-edit-btns">
            <button className="btn-save" onClick={saveProgress}>Save</button>
            <select
              value={assignment.status}
              onChange={e => onUpdate(assignment.id, { status: e.target.value })}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

// ── AddAssignmentForm (child, drills onAdd) ────────────────────────────────
function AddAssignmentForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    title: '', subject: 'Mathematics', dueDate: '', priority: 'medium'
  })

  function submit() {
    if (!form.title || !form.dueDate) return
    onAdd(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>New Assignment</h2>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Assignment title" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Add Assignment</button>
        </div>
      </div>
    </div>
  )
}

// ── Assignments (receives assignments + handlers drilled from App) ─────────
export default function Assignments({ assignments, onAdd, onUpdate, onDelete }) {
  const [showForm,  setShowForm]  = useState(false)
  const [filter,    setFilter]    = useState('all')
  const [sortBy,    setSortBy]    = useState('dueDate')
  const [search,    setSearch]    = useState('')

  const filtered = assignments
    .filter(a => filter === 'all' || a.status === filter || a.priority === filter)
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate')  return new Date(a.dueDate) - new Date(b.dueDate)
      if (sortBy === 'priority') return ['high','medium','low'].indexOf(a.priority) - ['high','medium','low'].indexOf(b.priority)
      if (sortBy === 'progress') return b.progress - a.progress
      return 0
    })

  return (
    <div className="assignments-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-sub">{assignments.length} total · {assignments.filter(a=>a.status==='completed').length} completed</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Assignment</button>
      </div>

      <div className="a-controls">
        <input className="a-search" placeholder="🔍  Search assignments..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="filter-chips">
          {['all','pending','in-progress','completed','high','medium','low'].map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <select className="a-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="progress">Sort: Progress</option>
        </select>
      </div>

      {filtered.length === 0
        ? <div className="empty-full">No assignments match your filters.</div>
        : <div className="a-grid">
            {filtered.map(a => (
              <AssignmentCard key={a.id} assignment={a} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
      }

      {showForm && <AddAssignmentForm onAdd={onAdd} onClose={() => setShowForm(false)} />}
    </div>
  )
}
