// sspirial.systems portal interactions

document.addEventListener('DOMContentLoaded', () => {
  // Load and render dynamic content first
  initializeContent();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
  });

  // Add stagger delay to grid items
  document.querySelectorAll('.project-grid .project-card, .notebook-grid .notebook-item, .philosophy-grid .philosophy-item').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    
    observer.observe(card);
  });

  // Cursor trail effect (subtle)
  let cursorTrail = [];
  const trailLength = 8;
  
  document.addEventListener('mousemove', (e) => {
    // Only on larger screens
    if (window.innerWidth < 768) return;
    
    // Create a subtle particle
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(212, 175, 55, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      animation: particleFade 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => particle.remove(), 800);
    
    // Limit trail
    cursorTrail.push(particle);
    if (cursorTrail.length > trailLength) {
      const old = cursorTrail.shift();
      if (old && old.parentNode) old.remove();
    }
  });

  // Add CSS animation for particles
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particleFade {
        0% { 
          opacity: 1; 
          transform: scale(1); 
        }
        100% { 
          opacity: 0; 
          transform: scale(0.5); 
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Easter egg: Konami code
  let konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateEasterEgg();
      konamiCode = [];
    }
  });

  function activateEasterEgg() {
    // Add rainbow effect to logo
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.style.animation = 'rainbow 3s linear infinite';
      
      // Add rainbow animation if not exists
      if (!document.getElementById('rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-style';
        style.textContent = `
          @keyframes rainbow {
            0% { color: #D4AF37; }
            16% { color: #FF6B6B; }
            33% { color: #4ECDC4; }
            50% { color: #FFE66D; }
            66% { color: #A8E6CF; }
            83% { color: #6B4C9A; }
            100% { color: #D4AF37; }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Show message
      const message = document.createElement('div');
      message.textContent = '🦊✨ You found the secret! Keep being curious.';
      message.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gold);
        color: var(--black);
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideUp 0.5s ease-out;
      `;
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.style.animation = 'slideDown 0.5s ease-out';
        setTimeout(() => message.remove(), 500);
      }, 3000);
    }
  }

  // Parallax effect for fox mascot on home page
  const foxMascot = document.querySelector('.fox-mascot');
  if (foxMascot) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          foxMascot.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Add hover sound effect (optional, commented out by default)
  /*
  document.querySelectorAll('.project-card, .notebook-item, .philosophy-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Play a subtle sound
      const audio = new Audio('assets/hover.mp3');
      audio.volume = 0.2;
      audio.play();
    });
  });
  */

  // Dynamic time-based greeting
  const updateGreeting = () => {
    const hour = new Date().getHours();
    const heroSubtitles = document.querySelectorAll('.hero-subtitle');
    
    if (heroSubtitles.length > 0 && hour >= 0 && hour < 5) {
      // Late night message
      const lateNightMsg = document.createElement('p');
      lateNightMsg.style.cssText = 'font-size: 0.9rem; color: var(--purple); margin-top: 2rem; font-style: italic;';
      lateNightMsg.textContent = '(Working late? Us too. Take a break soon. 🌙)';
      heroSubtitles[heroSubtitles.length - 1].after(lateNightMsg);
    }
  };

  updateGreeting();

  // Accessibility: Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  }

  console.log('%c🦊⚙ sspirial.systems', 'font-size: 24px; color: #D4AF37; font-weight: bold;');
  console.log('%cCurious about how this works? Check out the source: https://github.com/sspirial/sspirial.systems', 'color: #6B4C9A;');
});

/**
 * Initialize dynamic content loading and rendering
 */
async function initializeContent() {
  try {
    // Load site metadata for all pages
    const metadata = await DataLoader.load('site-metadata.json');
    Renderers.updateMetadata(metadata);
    Renderers.updateNavigation(metadata);

    // Check which page we're on and load appropriate content from data.json
    const currentPath = window.location.pathname;

    if (currentPath.includes('projects.html')) {
      const projects = await DataLoader.load({file: 'data.json', key: 'projects'});
      await loadProjects(projects);
    } else if (currentPath.includes('lab-notebook.html')) {
      const notebook = await DataLoader.load({file: 'data.json', key: 'notebook'});
      await loadNotebook(notebook);
    } else if (currentPath.includes('philosophy.html')) {
      const philosophy = await DataLoader.load({file: 'site-metadata.json', key: 'philosophy'});
      await loadPhilosophy(philosophy);
    } else if (currentPath.includes('collaborate.html')) {
      const collaborators = await DataLoader.load({file: 'data.json', key: 'collaborators'});
      await loadCollaborators(collaborators);
    }
  } catch (error) {
    console.error('Failed to initialize content:', error);
  }
}

/**
 * Load and render projects
 */
async function loadProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    Renderers.showLoading(container);
    Renderers.renderProjects(projects, container);
  } catch (error) {
    console.error('Failed to load projects:', error);
    Renderers.showError(container, 'Failed to load projects');
  }
}

/**
 * Load and render notebook entries
 */
async function loadNotebook(entries) {
  const container = document.getElementById('notebook-container');
  if (!container) return;

  try {
    Renderers.showLoading(container);
    Renderers.renderNotebook(entries, container);
  } catch (error) {
    console.error('Failed to load notebook:', error);
    Renderers.showError(container, 'Failed to load notebook entries');
  }
}

/**
 * Load and render philosophy principles
 */
async function loadPhilosophy(principles) {
  const container = document.getElementById('philosophy-container');
  if (!container) return;

  try {
    Renderers.showLoading(container);
    Renderers.renderPhilosophy(principles, container);
  } catch (error) {
    console.error('Failed to load philosophy:', error);
    Renderers.showError(container, 'Failed to load philosophy principles');
  }
}

/**
 * Load and render collaborator types
 */
async function loadCollaborators(collaborators) {
  const container = document.getElementById('collaborators-container');
  if (!container) return;

  try {
    Renderers.showLoading(container);
    Renderers.renderCollaborators(collaborators, container);
  } catch (error) {
    console.error('Failed to load collaborators:', error);
    Renderers.showError(container, 'Failed to load collaborator types');
  }
}
