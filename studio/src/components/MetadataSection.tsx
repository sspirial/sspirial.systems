import { useStore } from '@livestore/react'
import type React from 'react'
import { useState, useEffect } from 'react'

import { siteMetadata$ } from '../livestore/queries.js'
import { events } from '../livestore/schema.js'

export const MetadataSection: React.FC = () => {
  const { store } = useStore()
  const metadata = store.useQuery(siteMetadata$)
  const [editForm, setEditForm] = useState({
    name: '',
    tagline: '',
    description: '',
    logo: '',
    year: 2025,
    location: '',
    repository: '',
    socialTwitter: '',
    socialGithub: '',
    contactEmail: '',
    contactDiscussions: '',
  })

  useEffect(() => {
    if (metadata.length > 0) {
      const meta = metadata[0]!
      setEditForm({
        name: meta.name,
        tagline: meta.tagline,
        description: meta.description,
        logo: meta.logo,
        year: meta.year,
        location: meta.location,
        repository: meta.repository || '',
        socialTwitter: meta.socialTwitter || '',
        socialGithub: meta.socialGithub || '',
        contactEmail: meta.contactEmail || '',
        contactDiscussions: meta.contactDiscussions || '',
      })
    }
  }, [metadata])

  const handleSave = () => {
    store.commit(events.siteMetadataUpdated({
      name: editForm.name,
      tagline: editForm.tagline,
      description: editForm.description,
      logo: editForm.logo,
      year: editForm.year,
      location: editForm.location,
      repository: editForm.repository || null,
      socialTwitter: editForm.socialTwitter || null,
      socialGithub: editForm.socialGithub || null,
      contactEmail: editForm.contactEmail || null,
      contactDiscussions: editForm.contactDiscussions || null,
      updatedAt: new Date(),
    }))
    alert('Site metadata updated successfully!')
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>⚙️ Site Metadata</h2>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="metadata-form">
        <div className="metadata-section">
          <h3>Basic Information</h3>
          <div className="edit-form">
            <label>
              Site Name:
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="form-input"
              />
            </label>

            <label>
              Tagline:
              <input
                type="text"
                value={editForm.tagline}
                onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                className="form-input"
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

            <div className="form-row">
              <label>
                Logo Path:
                <input
                  type="text"
                  value={editForm.logo}
                  onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                  className="form-input"
                  placeholder="assets/sspirial_logo.png"
                />
              </label>

              <label>
                Year:
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                  className="form-input"
                />
              </label>
            </div>

            <label>
              Location:
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="form-input"
                placeholder="Africa 🌍"
              />
            </label>
          </div>
        </div>

        <div className="metadata-section">
          <h3>Links & Repository</h3>
          <div className="edit-form">
            <label>
              GitHub Repository:
              <input
                type="url"
                value={editForm.repository}
                onChange={(e) => setEditForm({ ...editForm, repository: e.target.value })}
                className="form-input"
                placeholder="https://github.com/sspirial/sspirial.systems"
              />
            </label>

            <label>
              Twitter URL:
              <input
                type="url"
                value={editForm.socialTwitter}
                onChange={(e) => setEditForm({ ...editForm, socialTwitter: e.target.value })}
                className="form-input"
                placeholder="https://twitter.com/sspirial"
              />
            </label>

            <label>
              GitHub Profile:
              <input
                type="url"
                value={editForm.socialGithub}
                onChange={(e) => setEditForm({ ...editForm, socialGithub: e.target.value })}
                className="form-input"
                placeholder="https://github.com/sspirial"
              />
            </label>
          </div>
        </div>

        <div className="metadata-section">
          <h3>Contact Information</h3>
          <div className="edit-form">
            <label>
              Email:
              <input
                type="email"
                value={editForm.contactEmail}
                onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                className="form-input"
                placeholder="hello@sspirial.systems"
              />
            </label>

            <label>
              GitHub Discussions URL:
              <input
                type="url"
                value={editForm.contactDiscussions}
                onChange={(e) => setEditForm({ ...editForm, contactDiscussions: e.target.value })}
                className="form-input"
                placeholder="https://github.com/sspirial/sspirial.systems/discussions"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
