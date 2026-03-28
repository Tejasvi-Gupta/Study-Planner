import React, { useState } from 'react'
import './TimeTable.css'

const DAYS      = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const SUBJECTS  = ['Mathematics','History','Chemistry','Literature','CS','Physics','Biology','Other']
const COLORS    = ['#2a7c7c','#c84b31','#d4a853','#2d2d4e','#e8833a','#3a7c5a','#7c3a7c','#5a7c3a']

// ── SlotCard (child, drills onDelete) ────────────────────────────────────────
function SlotCard({ slot, onDelete }) {
  return (
    <div className="slot-card" style={{ '--slot-color': slot.color }}>
      <div className="slot-color-bar" />
      <div className="slot-body">
        <div className="slot-time">{slot.time}</div>
        <div className="slot-subject">{slot.subject}</div>
        <div className="slot-meta">{slot.room} · {slot.duration}min</div>
      </div>
      <button className="slot-del" onClick={() => onDelete(slot.id)}>✕</button>
    </div>
  )
}

// ── AddSlotForm (child, drills onAdd) ────────────────────────────────────────
function AddSlotForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    day: 'Monday', subject: 'Mathematics', time: '08:00',
    duration: 60, room: '', color: COLORS[0]
  })

  function submit() {
    if (!form.room) return
    onAdd(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add Class Slot</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Day</label>
            <select value={form.day} onChange={e => setForm({...form, day: e.target.value})}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Time</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Duration (min)</label>
            <input type="number" min="15" max="240" step="15" value={form.duration}
              onChange={e => setForm({...form, duration: Number(e.target.value)})} />
          </div>
        </div>
        <div className="form-group">
          <label>Room / Location</label>
          <input value={form.room} onChange={e => setForm({...form, room: e.target.value})} placeholder="e.g. Room 204, Lab B-3" />
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {COLORS.map(c => (
              <div key={c} className={`color-dot ${form.color === c ? 'selected' : ''}`}
                style={{ background: c }} onClick={() => setForm({...form, color: c})} />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Add Slot</button>
        </div>
      </div>
    </div>
  )
}

// ── DayColumn (child, drills slots + onDelete) ────────────────────────────────
function DayColumn({ day, slots, onDelete, isToday }) {
  const sorted = [...slots].sort((a,b) => a.time.localeCompare(b.time))
  return (
    <div className={`day-col ${isToday ? 'today' : ''}`}>
      <div className="day-header">
        <span className="day-name">{day.slice(0,3)}</span>
        {isToday && <span className="today-tag">Today</span>}
        <span className="day-count">{slots.length}</span>
      </div>
      <div className="day-slots">
        {sorted.length === 0
          ? <div className="day-empty">—</div>
          : sorted.map(s => <SlotCard key={s.id} slot={s} onDelete={onDelete} />)
        }
      </div>
    </div>
  )
}

// ── TimeTable (receives timetable + handlers drilled from App) ─────────────
export default function TimeTable({ timetable, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [view,     setView]     = useState('week') // 'week' | 'list'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const totalHours = Math.round(timetable.reduce((s, sl) => s + sl.duration, 0) / 60)
  const subjects   = [...new Set(timetable.map(s => s.subject))]

  return (
    <div className="timetable-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Time Table</h1>
          <p className="page-sub">{timetable.length} classes · {totalHours}h/week · {subjects.length} subjects</p>
        </div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div className="view-toggle">
            <button className={view==='week'?'active':''} onClick={() => setView('week')}>Week</button>
            <button className={view==='list'?'active':''} onClick={() => setView('list')}>List</button>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Class</button>
        </div>
      </div>

      {view === 'week' ? (
        <div className="week-grid">
          {DAYS.map(day => (
            <DayColumn
              key={day}
              day={day}
              slots={timetable.filter(s => s.day === day)}
              onDelete={onDelete}
              isToday={day === today}
            />
          ))}
        </div>
      ) : (
        <div className="list-view">
          {DAYS.map(day => {
            const daySlots = timetable.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time))
            if (!daySlots.length) return null
            return (
              <div key={day} className="list-day-group">
                <div className={`list-day-header ${day === today ? 'today' : ''}`}>{day}</div>
                {daySlots.map(s => (
                  <div key={s.id} className="list-row" style={{ borderLeftColor: s.color }}>
                    <div className="list-time">{s.time}</div>
                    <div className="list-subject">{s.subject}</div>
                    <div className="list-room">{s.room}</div>
                    <div className="list-dur">{s.duration}min</div>
                    <button className="slot-del small" onClick={() => onDelete(s.id)}>✕</button>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      <div className="tt-legend">
        {subjects.map(sub => {
          const color = timetable.find(s => s.subject === sub)?.color || '#888'
          const count = timetable.filter(s => s.subject === sub).length
          return (
            <div key={sub} className="legend-item">
              <div className="legend-dot" style={{ background: color }} />
              <span>{sub}</span>
              <span className="legend-count">{count}</span>
            </div>
          )
        })}
      </div>

      {showForm && <AddSlotForm onAdd={onAdd} onClose={() => setShowForm(false)} />}
    </div>
  )
}
