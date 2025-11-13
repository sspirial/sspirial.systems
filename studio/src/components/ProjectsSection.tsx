import { useStore } from '@livestore/react'
import type React from 'react'
import { useState } from 'react'

import { allProjects$ } from '../livestore/queries.js'
import { events } from '../livestore/schema.js'

export const ProjectsSection: React.FC = () => {
  const { store } = useStore()
  const projects = store.useQuery(allProjects$)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    status: 'active' as 'active' | 'archived',
    origin: '',
    description: '',
    learned: '',
    link: '',
    linkText: '',
  })

  const handleCreate = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: 'New Project',
      status: 'active' as const,
      origin: '',
      description: '',
      learned: '',
      link: null,
      linkText: null,
      createdAt: new Date(),
    }
    store.commit(events.projectCreated(newProject))
    setIsEditing(newProject.id)
    setEditForm({
      name: newProject.name,
      status: newProject.status,
      origin: newProject.origin,
      description: newProject.description,
      learned: newProject.learned,
      link: '',
      linkText: '',
    })
  }

  const handleEdit = (project: typeof projects[number]) => {
    setIsEditing(project.id)
    setEditForm({
      name: project.name,
      status: project.status as 'active' | 'archived',
      origin: project.origin,
      description: project.description,
      learned: project.learned,
      link: project.link || '',
      linkText: project.linkText || '',
    })
  }

  const handleSave = (id: string) => {
    store.commit(events.projectUpdated({
      id,
      name: editForm.name,
      status: editForm.status,
      origin: editForm.origin,
      description: editForm.description,
      learned: editForm.learned,
      link: editForm.link || null,
      linkText: editForm.linkText || null,
      updatedAt: new Date(),
    }))
    setIsEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      store.commit(events.projectDeleted({ id, deletedAt: new Date() }))
    }
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>📁 Projects</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Project
        </button>
      </div>

      <div className="items-list">
        {projects.map((project) => (
          <div key={project.id} className="item-card">
            {isEditing === project.id ? (
              <div className="edit-form">
                <div className="form-row">
                  <label>
                    Name:
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="form-input"
                    />
                  </label>
                  <label>
                    Status:
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'archived' })}
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>
                </div>

                <label>
                  Origin Story:
                  <textarea
                    value={editForm.origin}
                    onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                    className="form-textarea"
                    rows={3}
                  />
                </label>

                <label>
                  Description:
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="form-textarea"
                    rows={3}
                  />
                </label>

                <label>
                  What We Learned:
                  <textarea
                    value={editForm.learned}
                    onChange={(e) => setEditForm({ ...editForm, learned: e.target.value })}
                    className="form-textarea"
                    rows={2}
                  />
                </label>

                <div className="form-row">
                  <label>
                    Link:
                    <input
                      type="url"
                      value={editForm.link}
                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                      className="form-input"
                      placeholder="https://..."
                    />
                  </label>
                  <label>
                    Link Text:
                    <input
                      type="text"
                      value={editForm.linkText}
                      onChange={(e) => setEditForm({ ...editForm, linkText: e.target.value })}
                      className="form-input"
                      placeholder="View source →"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={() => handleSave(project.id)}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="item-content">
                <div className="item-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge status-${project.status}`}>{project.status}</span>
                </div>
                <p className="item-meta"><strong>Origin:</strong> {project.origin}</p>
                <p>{project.description}</p>
                <p className="item-meta"><strong>Learned:</strong> {project.learned}</p>
                {project.link && (
                  <p className="item-link">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.linkText || 'View →'}
                    </a>
                  </p>
                )}
                <div className="item-actions">
                  <button className="btn btn-small" onClick={() => handleEdit(project)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
