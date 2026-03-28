import React from 'react'
import './Dashboard.css'

// ── Sub-components (child of Dashboard — component drilling in action) ────────
function StatCard({ icon, label, value, color, onClick }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color }} onClick={onClick}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function UpcomingAssignment({ assignment }) {
  const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / 86400000)
  const urgency  = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'soon' : 'ok'
  return (
    <div className={`upcoming-item ${urgency}`}>
      <div className="upcoming-dot" />
      <div className="upcoming-info">
        <div className="upcoming-title">{assignment.title}</div>
        <div className="upcoming-meta">{assignment.subject}</div>
      </div>
      <div className={`upcoming-due ${urgency}`}>
        {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
      </div>
    </div>
  )
}

function TodayClass({ slot }) {
  return (
    <div className="today-class" style={{ borderLeftColor: slot.color }}>
      <div className="class-time">{slot.time}</div>
      <div className="class-info">
        <div className="class-subject">{slot.subject}</div>
        <div className="class-room">{slot.room} · {slot.duration}min</div>
      </div>
    </div>
  )
}

// ── Dashboard (receives props drilled from App) ────────────────────────────
export default function Dashboard({ assignments, timetable, stats, studentName, setActiveTab }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const pending = assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4)

  const todayClasses = timetable
    .filter(s => s.day === today)
    .sort((a, b) => a.time.localeCompare(b.time))

  const avgProgress = assignments.length
    ? Math.round(assignments.reduce((s, a) => s + a.progress, 0) / assignments.length)
    : 0

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1 className="dash-greeting">Good morning, {studentName} ✦</h1>
          <p className="dash-date">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="dash-avg">
          <div className="avg-ring">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="var(--bg-subtle)" strokeWidth="5"/>
              <circle cx="30" cy="30" r="24" fill="none" stroke="var(--c-cyan)" strokeWidth="5"
                strokeDasharray={`${avgProgress * 1.508} 150.8`}
                strokeLinecap="round" transform="rotate(-90 30 30)"/>
            </svg>
            <span>{avgProgress}%</span>
          </div>
          <div className="avg-label">Avg Progress</div>
        </div>
      </header>

      <section className="stat-grid">
        <StatCard icon="📋" label="Total"       value={stats.total}      color="var(--c-teal)"   onClick={() => setActiveTab('assignments')} />
        <StatCard icon="✅" label="Completed"   value={stats.completed}  color="var(--c-cyan)"   onClick={() => setActiveTab('assignments')} />
        <StatCard icon="⏳" label="In Progress" value={stats.inProgress} color="var(--warn)"     onClick={() => setActiveTab('assignments')} />
        <StatCard icon="🔴" label="Overdue"     value={stats.overdue}    color="var(--danger)"   onClick={() => setActiveTab('assignments')} />
      </section>

      <div className="dash-columns">
        <section className="dash-panel">
          <div className="panel-header">
            <h2>Upcoming Deadlines</h2>
            <button className="panel-link" onClick={() => setActiveTab('assignments')}>View all →</button>
          </div>
          {pending.length === 0
            ? <p className="empty-state">🎉 All caught up!</p>
            : pending.map(a => <UpcomingAssignment key={a.id} assignment={a} />)
          }
        </section>

        <section className="dash-panel">
          <div className="panel-header">
            <h2>Today's Classes <span className="day-badge">{today}</span></h2>
            <button className="panel-link" onClick={() => setActiveTab('timetable')}>Timetable →</button>
          </div>
          {todayClasses.length === 0
            ? <p className="empty-state">📅 No classes today</p>
            : todayClasses.map(s => <TodayClass key={s.id} slot={s} />)
          }
        </section>
      </div>

      <section className="dash-panel subject-progress">
        <div className="panel-header"><h2>Subject Progress</h2></div>
        <div className="subject-bars">
          {[...new Set(assignments.map(a => a.subject))].map(subject => {
            const subAssign = assignments.filter(a => a.subject === subject)
            const avg = Math.round(subAssign.reduce((s, a) => s + a.progress, 0) / subAssign.length)
            return (
              <div key={subject} className="subject-bar-row">
                <span className="subject-name">{subject}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${avg}%` }} />
                </div>
                <span className="subject-pct">{avg}%</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
