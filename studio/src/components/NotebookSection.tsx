import { useStore } from '@livestore/react'
import type React from 'react'
import { useState } from 'react'

import { allNotebookEntries$ } from '../livestore/queries.js'
import { events } from '../livestore/schema.js'

const ENTRY_TYPES = ['prototype', 'sketch', 'failed', 'concept', 'note', 'thought', 'reflection'] as const

export const NotebookSection: React.FC = () => {
  const { store } = useStore()
  const entries = store.useQuery(allNotebookEntries$)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    date: '',
    title: '',
    type: 'note' as typeof ENTRY_TYPES[number],
    content: '',
  })

  const formatDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  const handleCreate = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      date: formatDate(),
      title: 'New Entry',
      type: 'note' as const,
      content: '',
      createdAt: new Date(),
    }
    store.commit(events.notebookEntryCreated(newEntry))
    setIsEditing(newEntry.id)
    setEditForm({
      date: newEntry.date,
      title: newEntry.title,
      type: newEntry.type,
      content: newEntry.content,
    })
  }

  const handleEdit = (entry: typeof entries[number]) => {
    setIsEditing(entry.id)
    setEditForm({
      date: entry.date,
      title: entry.title,
      type: entry.type as typeof ENTRY_TYPES[number],
      content: entry.content,
    })
  }

  const handleSave = (id: string) => {
    store.commit(events.notebookEntryUpdated({
      id,
      date: editForm.date,
      title: editForm.title,
      type: editForm.type,
      content: editForm.content,
      updatedAt: new Date(),
    }))
    setIsEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      store.commit(events.notebookEntryDeleted({ id, deletedAt: new Date() }))
    }
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>📔 Lab Notebook</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Entry
        </button>
      </div>

      <div className="items-list">
        {entries.map((entry) => (
          <div key={entry.id} className="item-card">
            {isEditing === entry.id ? (
              <div className="edit-form">
                <div className="form-row">
                  <label>
                    Date (YYYY.MM.DD):
                    <input
                      type="text"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="form-input"
                      placeholder="2024.11.13"
                    />
                  </label>
                  <label>
                    Type:
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value as typeof ENTRY_TYPES[number] })}
                      className="form-select"
                    >
                      {ENTRY_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Title:
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="form-input"
                  />
                </label>

                <label>
                  Content:
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="form-textarea"
                    rows={5}
                  />
                </label>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={() => handleSave(entry.id)}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="item-content">
                <div className="notebook-entry-header">
                  <span className="notebook-date">{entry.date}</span>
                  <span className={`entry-type-badge type-${entry.type}`}>{entry.type}</span>
                </div>
                <h3>{entry.title}</h3>
                <p className="notebook-content">{entry.content}</p>
                <div className="item-actions">
                  <button className="btn btn-small" onClick={() => handleEdit(entry)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(entry.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
