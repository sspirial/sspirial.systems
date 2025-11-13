// sspirial.systems content renderers
// Functions to render data into HTML elements

const Renderers = (() => {
  
  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Render projects grid
   * @param {Array} projects - Array of project objects
   * @param {HTMLElement} container - Container element
   */
  function renderProjects(projects, container) {
    if (!container) return;

    const html = projects.map(project => {
      const statusClass = project.status === 'active' ? 'status-active' : 'status-archived';
      const linkHtml = project.link 
        ? `<p style="margin-top: 1rem;">
             <a href="${escapeHtml(project.link)}" ${project.link.startsWith('http') ? 'target="_blank"' : ''}>${escapeHtml(project.linkText || 'Learn more →')}</a>
           </p>`
        : '';

      return `
        <div class="project-card">
          <span class="project-status ${statusClass}">${escapeHtml(project.status)}</span>
          <h3>${escapeHtml(project.name)}</h3>
          <p class="project-origin">
            <strong>Origin:</strong> ${escapeHtml(project.origin)}
          </p>
          <p>${escapeHtml(project.description)}</p>
          <p class="project-learned">
            <strong>Learned:</strong> ${escapeHtml(project.learned)}
          </p>
          ${linkHtml}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  /**
   * Render notebook entries
   * @param {Array} entries - Array of notebook entry objects
   * @param {HTMLElement} container - Container element
   */
  function renderNotebook(entries, container) {
    if (!container) return;

    const html = entries.map(entry => `
      <div class="notebook-item">
        <p class="notebook-date">${escapeHtml(entry.date)}</p>
        <h4>${escapeHtml(entry.title)}</h4>
        <p>${escapeHtml(entry.content)}</p>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Render philosophy principles
   * @param {Array} principles - Array of philosophy objects
   * @param {HTMLElement} container - Container element
   */
  function renderPhilosophy(principles, container) {
    if (!container) return;

    const html = principles.map(principle => {
      const paragraphsHtml = principle.paragraphs
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');

      return `
        <div class="philosophy-item">
          <h3>${escapeHtml(principle.title)}</h3>
          ${paragraphsHtml}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  /**
   * Render collaborator types
   * @param {Array} collaborators - Array of collaborator type objects
   * @param {HTMLElement} container - Container element
   */
  function renderCollaborators(collaborators, container) {
    if (!container) return;

    console.log('🎨 Rendering collaborators:', collaborators);

    const html = collaborators.map(collab => {
      // Get the profile object using the id as the key (e.g., collab.builders)
      const profileKey = collab.id;
      const profile = collab[profileKey] || {};
      
      console.log(`  - ${collab.title} (${profileKey}):`, profile);
      
      // Render profile section if there's any profile data
      let profileHtml = '';
      if (profile && Object.keys(profile).length > 0) {
        profileHtml = `
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(107, 76, 154, 0.05); border-radius: 4px; border-left: 2px solid var(--purple);">
            <p style="font-size: 0.9rem; color: rgba(250, 250, 250, 0.6); margin-bottom: 0.5rem;"><strong>Featured:</strong></p>
            ${profile.name ? `<p style="margin: 0.25rem 0;"><strong>${escapeHtml(profile.name)}</strong></p>` : ''}
            ${profile.bio ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;">${escapeHtml(profile.bio)}</p>` : ''}
            ${profile.link ? `<p style="margin: 0.5rem 0 0 0;"><a href="${escapeHtml(profile.link)}" target="_blank" style="font-size: 0.85rem;">Learn more →</a></p>` : ''}
          </div>
        `;
      }

      return `
        <div class="philosophy-item">
          <h3>${collab.icon} ${escapeHtml(collab.title)}</h3>
          <p>${collab.description}</p>
          ${profileHtml}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
    console.log('✅ Collaborators rendered successfully');
  }

  /**
   * Update site metadata (footer, nav, etc.)
   * @param {Object} metadata - Site metadata object
   */
  function updateMetadata(metadata) {
    // Update footer year
    const footerYear = document.querySelector('footer p:first-child');
    if (footerYear && metadata.year) {
      footerYear.innerHTML = `&copy; ${metadata.year} ${escapeHtml(metadata.name)} — a microstudio experiment`;
    }

    // Update footer location
    const footerLocation = document.querySelector('footer p:last-child');
    if (footerLocation && metadata.location) {
      footerLocation.textContent = `crafted with curiosity in ${metadata.location}`;
    }

    // Update page title if on home
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.textContent.includes('sspirial.systems') && metadata.tagline) {
      pageTitle.textContent = `${metadata.name} — ${metadata.tagline}`;
    }
  }

  /**
   * Render navigation (if needed for dynamic updates)
   * @param {Object} metadata - Site metadata
   */
  function updateNavigation(metadata) {
    const logoSpan = document.querySelector('.logo span:not(.logo-icon)');
    if (logoSpan && metadata.name) {
      logoSpan.textContent = metadata.name;
    }
  }

  /**
   * Show loading state
   * @param {HTMLElement} container - Container element
   */
  function showLoading(container) {
    if (!container) return;
    container.innerHTML = '<p style="text-align: center; color: rgba(250, 250, 250, 0.5); padding: 2rem;">Loading...</p>';
  }

  /**
   * Show error state
   * @param {HTMLElement} container - Container element
   * @param {string} message - Error message
   */
  function showError(container, message = 'Failed to load content') {
    if (!container) return;
    container.innerHTML = `<p style="text-align: center; color: rgba(255, 107, 107, 0.8); padding: 2rem;">⚠️ ${escapeHtml(message)}</p>`;
  }

  // Public API
  return {
    renderProjects,
    renderNotebook,
    renderPhilosophy,
    renderCollaborators,
    updateMetadata,
    updateNavigation,
    showLoading,
    showError
  };
})();

// Make available globally
window.Renderers = Renderers;
