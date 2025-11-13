import { Events, makeSchema, Schema, SessionIdSymbol, State } from '@livestore/livestore'

// Studio data models - managing sspirial.systems content
export const tables = {
  // Projects table
  projects: State.SQLite.table({
    name: 'projects',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      name: State.SQLite.text({ default: '' }),
      status: State.SQLite.text({ default: 'active' }), // 'active' | 'archived'
      origin: State.SQLite.text({ default: '' }),
      description: State.SQLite.text({ default: '' }),
      learned: State.SQLite.text({ default: '' }),
      link: State.SQLite.text({ nullable: true }),
      linkText: State.SQLite.text({ nullable: true }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),
  
  // Lab notebook entries
  notebookEntries: State.SQLite.table({
    name: 'notebookEntries',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      date: State.SQLite.text({ default: '' }), // Format: YYYY.MM.DD
      title: State.SQLite.text({ default: '' }),
      type: State.SQLite.text({ default: 'note' }), // 'prototype' | 'sketch' | 'failed' | 'concept' | 'note' | 'thought' | 'reflection'
      content: State.SQLite.text({ default: '' }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),
  
  
  // Collaborator types
  collaborators: State.SQLite.table({
    name: 'collaborators',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      icon: State.SQLite.text({ default: '' }),
      title: State.SQLite.text({ default: '' }),
      description: State.SQLite.text({ default: '' }),
      order: State.SQLite.integer({ default: 0 }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),
  
  
  // Client documents for UI state
  uiState: State.SQLite.clientDocument({
    name: 'uiState',
    schema: Schema.Struct({ 
      activeSection: Schema.Literal('projects', 'notebook', 'collaborators', 'export'),
      selectedItemId: Schema.Union(Schema.String, Schema.Null),
    }),
    default: { id: SessionIdSymbol, value: { activeSection: 'projects', selectedItemId: null } },
  }),
}

// Events describe data changes (https://docs.livestore.dev/reference/events)
export const events = {
  // Project events
  projectCreated: Events.synced({
    name: 'v1.ProjectCreated',
    schema: Schema.Struct({ 
      id: Schema.String, 
      name: Schema.String,
      status: Schema.Literal('active', 'archived'),
      origin: Schema.String,
      description: Schema.String,
      learned: Schema.String,
      link: Schema.Union(Schema.String, Schema.Null),
      linkText: Schema.Union(Schema.String, Schema.Null),
      createdAt: Schema.Date,
    }),
  }),
  projectUpdated: Events.synced({
    name: 'v1.ProjectUpdated',
    schema: Schema.Struct({ 
      id: Schema.String,
      name: Schema.optional(Schema.String),
      status: Schema.optional(Schema.Literal('active', 'archived')),
      origin: Schema.optional(Schema.String),
      description: Schema.optional(Schema.String),
      learned: Schema.optional(Schema.String),
      link: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      linkText: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      updatedAt: Schema.Date,
    }),
  }),
  projectDeleted: Events.synced({
    name: 'v1.ProjectDeleted',
    schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
  }),
  
  // Notebook entry events
  notebookEntryCreated: Events.synced({
    name: 'v1.NotebookEntryCreated',
    schema: Schema.Struct({ 
      id: Schema.String,
      date: Schema.String,
      title: Schema.String,
      type: Schema.Literal('prototype', 'sketch', 'failed', 'concept', 'note', 'thought', 'reflection'),
      content: Schema.String,
      createdAt: Schema.Date,
    }),
  }),
  notebookEntryUpdated: Events.synced({
    name: 'v1.NotebookEntryUpdated',
    schema: Schema.Struct({ 
      id: Schema.String,
      date: Schema.optional(Schema.String),
      title: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal('prototype', 'sketch', 'failed', 'concept', 'note', 'thought', 'reflection')),
      content: Schema.optional(Schema.String),
      updatedAt: Schema.Date,
    }),
  }),
  notebookEntryDeleted: Events.synced({
    name: 'v1.NotebookEntryDeleted',
    schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
  }),
  
  
  // Collaborator events
  collaboratorCreated: Events.synced({
    name: 'v1.CollaboratorCreated',
    schema: Schema.Struct({ 
      id: Schema.String,
      icon: Schema.String,
      title: Schema.String,
      description: Schema.String,
      order: Schema.Number,
      createdAt: Schema.Date,
    }),
  }),
  collaboratorUpdated: Events.synced({
    name: 'v1.CollaboratorUpdated',
    schema: Schema.Struct({ 
      id: Schema.String,
      icon: Schema.optional(Schema.String),
      title: Schema.optional(Schema.String),
      description: Schema.optional(Schema.String),
      order: Schema.optional(Schema.Number),
      updatedAt: Schema.Date,
    }),
  }),
  collaboratorDeleted: Events.synced({
    name: 'v1.CollaboratorDeleted',
    schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
  }),
  
  
  // UI state
  uiStateSet: tables.uiState.set,
}

// Materializers map events to state changes
const materializers = State.SQLite.materializers(events, {
  // Project materializers
  'v1.ProjectCreated': (payload) => tables.projects.insert({
    id: payload.id,
    name: payload.name,
    status: payload.status,
    origin: payload.origin,
    description: payload.description,
    learned: payload.learned,
    link: payload.link,
    linkText: payload.linkText,
    createdAt: payload.createdAt,
  }),
  'v1.ProjectUpdated': (payload) => {
    const updates: Record<string, any> = { updatedAt: payload.updatedAt }
    if (payload.name !== undefined) updates.name = payload.name
    if (payload.status !== undefined) updates.status = payload.status
    if (payload.origin !== undefined) updates.origin = payload.origin
    if (payload.description !== undefined) updates.description = payload.description
    if (payload.learned !== undefined) updates.learned = payload.learned
    if (payload.link !== undefined) updates.link = payload.link
    if (payload.linkText !== undefined) updates.linkText = payload.linkText
    return tables.projects.update(updates).where({ id: payload.id })
  },
  'v1.ProjectDeleted': ({ id, deletedAt }) => 
    tables.projects.update({ deletedAt }).where({ id }),
  
  // Notebook entry materializers
  'v1.NotebookEntryCreated': (payload) => tables.notebookEntries.insert({
    id: payload.id,
    date: payload.date,
    title: payload.title,
    type: payload.type,
    content: payload.content,
    createdAt: payload.createdAt,
  }),
  'v1.NotebookEntryUpdated': (payload) => {
    const updates: Record<string, any> = { updatedAt: payload.updatedAt }
    if (payload.date !== undefined) updates.date = payload.date
    if (payload.title !== undefined) updates.title = payload.title
    if (payload.type !== undefined) updates.type = payload.type
    if (payload.content !== undefined) updates.content = payload.content
    return tables.notebookEntries.update(updates).where({ id: payload.id })
  },
  'v1.NotebookEntryDeleted': ({ id, deletedAt }) => 
    tables.notebookEntries.update({ deletedAt }).where({ id }),
  
  
  // Collaborator materializers
  'v1.CollaboratorCreated': (payload) => tables.collaborators.insert({
    id: payload.id,
    icon: payload.icon,
    title: payload.title,
    description: payload.description,
    order: payload.order,
    createdAt: payload.createdAt,
  }),
  'v1.CollaboratorUpdated': (payload) => {
    const updates: Record<string, any> = { updatedAt: payload.updatedAt }
    if (payload.icon !== undefined) updates.icon = payload.icon
    if (payload.title !== undefined) updates.title = payload.title
    if (payload.description !== undefined) updates.description = payload.description
    if (payload.order !== undefined) updates.order = payload.order
    return tables.collaborators.update(updates).where({ id: payload.id })
  },
  'v1.CollaboratorDeleted': ({ id, deletedAt }) => 
    tables.collaborators.update({ deletedAt }).where({ id }),
  
})

const state = State.SQLite.makeState({ tables, materializers })

export const schema = makeSchema({ events, state })
