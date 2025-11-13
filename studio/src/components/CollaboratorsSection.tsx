import { useStore } from '@livestore/react'
import type React from 'react'
import { useState } from 'react'

import { allCollaborators$ } from '../livestore/queries.js'
import { events } from '../livestore/schema.js'

export const CollaboratorsSection: React.FC = () => {
  const { store } = useStore()
  const collaborators = store.useQuery(allCollaborators$)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    icon: '',
    title: '',
    description: '',
  })

  const handleCreate = () => {
    const newItem = {
      id: crypto.randomUUID(),
      icon: '🤝',
      title: 'New Collaborator Type',
      description: '',
      order: collaborators.length,
      createdAt: new Date(),
    }
    store.commit(events.collaboratorCreated(newItem))
    setIsEditing(newItem.id)
    setEditForm({
      icon: newItem.icon,
      title: newItem.title,
      description: newItem.description,
    })
  }

  const handleEdit = (item: typeof collaborators[number]) => {
    setIsEditing(item.id)
    setEditForm({
      icon: item.icon,
      title: item.title,
      description: item.description,
    })
  }

  const handleSave = (id: string) => {
    store.commit(events.collaboratorUpdated({
      id,
      icon: editForm.icon,
      title: editForm.title,
      description: editForm.description,
      updatedAt: new Date(),
    }))
    setIsEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this collaborator type?')) {
      store.commit(events.collaboratorDeleted({ id, deletedAt: new Date() }))
    }
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>🤝 Collaborators</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Type
        </button>
      </div>

      <div className="items-list">
        {collaborators.map((item) => (
          <div key={item.id} className="item-card">
            {isEditing === item.id ? (
              <div className="edit-form">
                <div className="form-row">
                  <label>
                    Icon (emoji):
                    <input
                      type="text"
                      value={editForm.icon}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="form-input"
                      placeholder="🛠"
                    />
                  </label>
                  <label>
                    Title:
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="form-input"
                      placeholder="Builders"
                    />
                  </label>
                </div>

                <label>
                  Description:
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="form-textarea"
                    rows={4}
                    placeholder="Who they are and why we want to work with them..."
                  />
                </label>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={() => handleSave(item.id)}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="item-content">
                <h3>{item.icon} {item.title}</h3>
                <p>{item.description}</p>
                <div className="item-actions">
                  <button className="btn btn-small" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
