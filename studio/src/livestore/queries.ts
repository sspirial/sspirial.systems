import { queryDb } from '@livestore/livestore'

import { tables } from './schema.js'

export const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })

// Projects queries
export const allProjects$ = queryDb(
  tables.projects.select().where({ deletedAt: null }).orderBy('createdAt', 'desc'),
  { label: 'allProjects' }
)

export const activeProjects$ = queryDb(
  tables.projects.select().where({ status: 'active', deletedAt: null }).orderBy('createdAt', 'desc'),
  { label: 'activeProjects' }
)

export const archivedProjects$ = queryDb(
  tables.projects.select().where({ status: 'archived', deletedAt: null }).orderBy('createdAt', 'desc'),
  { label: 'archivedProjects' }
)

// Notebook entries queries
export const allNotebookEntries$ = queryDb(
  tables.notebookEntries.select().where({ deletedAt: null }).orderBy('date', 'desc'),
  { label: 'allNotebookEntries' }
)

export function notebookEntriesByType$(type: string) {
  return queryDb(
    tables.notebookEntries.select().where({ type, deletedAt: null }).orderBy('date', 'desc'),
    { label: `notebookEntries_${type}` }
  )
}


// Collaborators queries
export const allCollaborators$ = queryDb(
  tables.collaborators.select().where({ deletedAt: null }).orderBy('createdAt', 'asc'),
  { label: 'allCollaborators' }
)

