import React from 'react'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard',   icon: '◈', label: 'Dashboard'   },
  { id: 'assignments', icon: '✦', label: 'Assignments'  },
  { id: 'timetable',  icon: '◷', label: 'Time Table'   },
]

export default function Sidebar({ activeTab, setActiveTab, studentName, stats, theme, toggleTheme }) {
  const completion = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">✦</span>
        <span className="brand-name">StudyPlanner</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{studentName[0]}</div>
        <div className="user-details">
          <div className="user-name">{studentName}</div>
          <div className="user-role">Student</div>
        </div>
        <button
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="toggle-track">
            <span className="t-sun">☀</span>
            <span className="t-moon">◑</span>
            <div className="toggle-thumb" />
          </div>
        </button>
      </div>

      <div className="sidebar-progress">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span className="pct">{completion}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
        <div className="progress-sub">{stats.completed}/{stats.total} done</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'assignments' && stats.overdue > 0 && (
              <span className="badge">{stats.overdue}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="quick-stat"><span>📚</span> {stats.subjects} Subjects</div>
        <div className="quick-stat"><span>🕐</span> {stats.upcomingClasses} Classes/week</div>
        <div className="palette-strip">
          {['#0B0C10','#1F2833','#C5C6C7','#66FCF1','#45A29E'].map(c => (
            <div key={c} className="p-dot" style={{ background: c }} title={c} />
          ))}
        </div>
      </div>
    </aside>
  )
}
