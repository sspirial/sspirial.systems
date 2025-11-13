import { useStore } from '@livestore/react'
import type React from 'react'
import { useState } from 'react'

import { 
  allProjects$, 
  allNotebookEntries$, 
  allCollaborators$
} from '../livestore/queries.js'

export const ExportSection: React.FC = () => {
  const { store } = useStore()
  const projects = store.useQuery(allProjects$)
  const notebookEntries = store.useQuery(allNotebookEntries$)
  // philosophy removed
  const collaborators = store.useQuery(allCollaborators$)
  // metadata removed
  const [exportStatus, setExportStatus] = useState<string>('')

  const formatProjectForExport = (project: typeof projects[number]) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    origin: project.origin,
    description: project.description,
    learned: project.learned,
    link: project.link,
    linkText: project.linkText,
  })

  const formatNotebookEntryForExport = (entry: typeof notebookEntries[number]) => ({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    type: entry.type,
    content: entry.content,
  })

  // formatPhilosophyForExport removed

  const formatCollaboratorForExport = (collab: typeof collaborators[number]) => {
    // Preserve existing profile data structure
    const profileKey = collab.id
    return {
      id: collab.id,
      icon: collab.icon,
      title: collab.title,
      description: collab.description,
      [profileKey]: {}, // Empty profile object - will be preserved during merge
    }
  }

  // formatMetadataForExport removed

  const downloadJSON = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportAll = () => {
    try {
      const exportData = {
        projects: projects.map(formatProjectForExport),
        notebook: notebookEntries.map(formatNotebookEntryForExport),
        collaborators: collaborators.map(formatCollaboratorForExport),
      }

      downloadJSON('projects.json', exportData.projects)
      downloadJSON('notebook.json', exportData.notebook)
      downloadJSON('collaborators.json', exportData.collaborators)

  setExportStatus('✅ Successfully exported all files! Place them in portal/data/ directory.')
      setTimeout(() => setExportStatus(''), 5000)
    } catch (error) {
      setExportStatus('❌ Export failed: ' + (error as Error).message)
    }
  }

  const handleExportSingle = (type: string) => {
    try {
      switch (type) {
        case 'projects':
          downloadJSON('projects.json', projects.map(formatProjectForExport))
          break
        case 'notebook':
          downloadJSON('notebook.json', notebookEntries.map(formatNotebookEntryForExport))
          break
        case 'collaborators':
          downloadJSON('collaborators.json', collaborators.map(formatCollaboratorForExport))
          break
      }
      setExportStatus(`✅ Exported ${type}.json successfully!`)
      setTimeout(() => setExportStatus(''), 3000)
    } catch (error) {
      setExportStatus('❌ Export failed: ' + (error as Error).message)
    }
  }

  const stats = {
    projects: projects.length,
    notebook: notebookEntries.length,
    collaborators: collaborators.length,
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>💾 Export Data</h2>
        <button className="btn btn-primary" onClick={handleExportAll}>
          Export All Files
        </button>
      </div>

      {exportStatus && (
        <div className={`export-status ${exportStatus.startsWith('✅') ? 'success' : 'error'}`}>
          {exportStatus}
        </div>
      )}

      <div className="export-info">
        <h3>Export to Portal</h3>
        <p>
          Export your studio content to JSON files that can be used by the portal site.
          After exporting, place the files in the <code>portal/data/</code> directory.
        </p>
      </div>

      <div className="export-grid">
        <div className="export-card">
          <div className="export-card-header">
            <h4>📁 Projects</h4>
            <span className="export-count">{stats.projects} items</span>
          </div>
          <p>Export project catalog with status, origin stories, and learnings.</p>
          <button className="btn btn-small" onClick={() => handleExportSingle('projects')}>
            Export projects.json
          </button>
        </div>

        <div className="export-card">
          <div className="export-card-header">
            <h4>📔 Lab Notebook</h4>
            <span className="export-count">{stats.notebook} entries</span>
          </div>
          <p>Export notebook entries with dates, types, and content.</p>
          <button className="btn btn-small" onClick={() => handleExportSingle('notebook')}>
            Export notebook.json
          </button>
        </div>

        {/* Philosophy export removed */}

        <div className="export-card">
          <div className="export-card-header">
            <h4>🤝 Collaborators</h4>
            <span className="export-count">{stats.collaborators} types</span>
          </div>
          <p>Export collaborator types with icons and descriptions.</p>
          <button className="btn btn-small" onClick={() => handleExportSingle('collaborators')}>
            Export collaborators.json
          </button>
        </div>

        {/* Site metadata export removed */}
      </div>

      <div className="export-instructions">
        <h3>📋 Instructions</h3>
        <ol>
          <li>Click "Export All Files" or export individual files above</li>
          <li>Files will download to your Downloads folder</li>
          <li>Move the files to <code>portal/data/</code> directory</li>
          <li>Refresh the portal site to see your changes</li>
          <li>Commit and push to deploy to production</li>
        </ol>
      </div>
    </div>
  )
}
