import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'
import { LiveStoreProvider, useStore } from '@livestore/react'
import { FPSMeter } from '@overengineering/fps-meter'
import type React from 'react'
import { unstable_batchedUpdates as batchUpdates } from 'react-dom'

import { Sidebar } from './components/Sidebar.js'
import { ProjectsSection } from './components/ProjectsSection.js'
import { NotebookSection } from './components/NotebookSection.js'
import { CollaboratorsSection } from './components/CollaboratorsSection.js'
import { ExportSection } from './components/ExportSection.js'
import { PortalRouter } from './components/portal/PortalRouter.js'
import { usePortalRoute } from './components/portal/usePortalRoute.js'
import '../src/components/portal/portal-style.css'
import LiveStoreWorker from './livestore.worker?worker'
import { schema } from './livestore/schema.js'
import { uiState$ } from './livestore/queries.js'
import { getStoreId } from './util/store-id.js'


const StudioContent: React.FC = () => {
  const { store } = useStore();
  const uiState = store.useQuery(uiState$);
  const [portalRoute] = usePortalRoute();

  // If hash starts with 'portal', show portal pages
  if (window.location.hash.replace(/^#\/?/, '').startsWith('portal')) {
    return (
      <div className="portal-wrapper">
        <PortalRouter route={portalRoute} />
      </div>
    );
  }

  const renderSection = () => {
    switch (uiState.activeSection) {
      case 'projects':
        return <ProjectsSection />;
      case 'notebook':
        return <NotebookSection />;
      case 'collaborators':
        return <CollaboratorsSection />;
      case 'export':
        return <ExportSection />;
      default:
        return (
          <div className="content-section">
            <h2>Welcome</h2>
            <p>Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="studio-layout">
      <Sidebar />
      <main className="studio-main">{renderSection()}</main>
    </div>
  );
};

const AppBody: React.FC = () => (
  <div className="studio-app">
    <StudioContent />
  </div>
)

const storeId = getStoreId()

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
})

export const App: React.FC = () => (
  <LiveStoreProvider
    schema={schema}
    adapter={adapter}
    renderLoading={(_) => <div className="loading-screen">Loading sspirial studio ({_.stage})...</div>}
    batchUpdates={batchUpdates}
    storeId={storeId}
    syncPayload={{ authToken: 'insecure-token-change-me' }}
  >
    <div style={{ top: 0, right: 0, position: 'absolute', background: '#333', zIndex: 9999 }}>
      <FPSMeter height={40} />
    </div>
    <AppBody />
  </LiveStoreProvider>
)
