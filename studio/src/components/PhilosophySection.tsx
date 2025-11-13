import { useStore } from '@livestore/react'
import type React from 'react'
import { useState } from 'react'

import { allPhilosophy$ } from '../livestore/queries.js'
import { events } from '../livestore/schema.js'

export const PhilosophySection: React.FC = () => {
  const { store } = useStore()
  const philosophy = store.useQuery(allPhilosophy$)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    paragraphs: [''],
  })

  const handleCreate = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: 'New Principle',
      paragraphs: [''],
      order: philosophy.length,
      createdAt: new Date(),
    }
    store.commit(events.philosophyCreated(newItem))
    setIsEditing(newItem.id)
    setEditForm({
      title: newItem.title,
      paragraphs: newItem.paragraphs,
    })
  }

  const handleEdit = (item: typeof philosophy[number]) => {
    setIsEditing(item.id)
    setEditForm({
      title: item.title,
      paragraphs: JSON.parse(item.paragraphs),
    })
  }

  const handleSave = (id: string) => {
    store.commit(events.philosophyUpdated({
      id,
      title: editForm.title,
      paragraphs: editForm.paragraphs.filter(p => p.trim() !== ''),
      updatedAt: new Date(),
    }))
    setIsEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this principle?')) {
      store.commit(events.philosophyDeleted({ id, deletedAt: new Date() }))
    }
  }

  const addParagraph = () => {
    setEditForm({ ...editForm, paragraphs: [...editForm.paragraphs, ''] })
  }

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...editForm.paragraphs]
    newParagraphs[index] = value
    setEditForm({ ...editForm, paragraphs: newParagraphs })
  }

  const removeParagraph = (index: number) => {
    const newParagraphs = editForm.paragraphs.filter((_, i) => i !== index)
    setEditForm({ ...editForm, paragraphs: newParagraphs })
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>💭 Philosophy</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Principle
        </button>
      </div>

      <div className="items-list">
        {philosophy.map((item) => (
          <div key={item.id} className="item-card">
            {isEditing === item.id ? (
              <div className="edit-form">
                <label>
                  Title:
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="form-input"
                  />
                </label>

                <div className="paragraphs-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>Paragraphs:</label>
                    <button type="button" className="btn btn-small" onClick={addParagraph}>
                      + Add Paragraph
                    </button>
                  </div>
                  {editForm.paragraphs.map((para, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <textarea
                        value={para}
                        onChange={(e) => updateParagraph(index, e.target.value)}
                        className="form-textarea"
                        rows={3}
                        placeholder={`Paragraph ${index + 1}`}
                        style={{ flex: 1 }}
                      />
                      {editForm.paragraphs.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() => removeParagraph(index)}
                          style={{ alignSelf: 'flex-start' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

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
                <h3>{item.title}</h3>
                {JSON.parse(item.paragraphs).map((para: string, index: number) => (
                  <p key={index}>{para}</p>
                ))}
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
