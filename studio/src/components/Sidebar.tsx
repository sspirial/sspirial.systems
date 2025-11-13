import { useStore } from '@livestore/react'
import type React from 'react'

import { events } from '../livestore/schema.js'
import { uiState$ } from '../livestore/queries.js'

export const Sidebar: React.FC = () => {
  const { store } = useStore()
  const uiState = store.useQuery(uiState$)

  const sections = [
    { id: 'projects' as const, label: '📁 Projects', icon: '📁' },
    { id: 'notebook' as const, label: '📔 Lab Notebook', icon: '📔' },
    { id: 'collaborators' as const, label: '🤝 Collaborators', icon: '🤝' },
    { id: 'export' as const, label: '💾 Export Data', icon: '💾' },
  ]

  const handleSectionChange = (section: typeof sections[number]['id']) => {
    store.commit(events.uiStateSet({
      activeSection: section,
      selectedItemId: null,
    }))
  }

  return (
    <aside className="studio-sidebar">
      <div className="studio-logo">
        <h1>🦊 sspirial studio</h1>
        <p className="studio-subtitle">content management</p>
      </div>
      
      <nav className="studio-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`studio-nav-item ${uiState.activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionChange(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.label.replace(/^.+\s/, '')}</span>
          </button>
        ))}
      </nav>
      
      <div className="studio-info">
        <p className="info-text">
          <small>Local-first studio • Offline by default</small>
        </p>
      </div>
    </aside>
  )
}
