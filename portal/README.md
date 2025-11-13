# sspirial.systems Portal

A digital cabinet of curiosities—the public-facing website for sspirial.systems microstudio.

## About

This portal showcases our tiny, strange, African-centric digital inventions. It's designed to feel like stepping into a playful workshop rather than a corporate website.

**Design principles:**
- Minimalist but artistic
- Cabinet of curiosities aesthetic  
- Brand colors: gold (#D4AF37), black (#0A0A0A), white (#FAFAFA), purple (#6B4C9A)
- Mascot: golden fox with mechanical gear 🦊⚙

## Structure

```
portal/
├── index.html          # Home page - poetic introduction
├── projects.html       # Project gallery with origin stories
├── lab-notebook.html   # Experimental notes and prototypes
├── philosophy.html     # Our worldview and principles
├── collaborate.html    # Invitation to collaborate
├── css/
│   └── style.css      # Main stylesheet
└── js/
    └── main.js        # Interactions and animations
```

## Features

- **Responsive design** - Works on all screen sizes
- **Subtle animations** - Fade-ins, parallax, hover effects
- **Accessibility** - Respects `prefers-reduced-motion`
- **Easter egg** - Konami code for a surprise 🎮
- **No build step** - Pure HTML/CSS/JS for simplicity

## Development

Serve locally with any static file server:

```bash
# Using Python
cd portal
python3 -m http.server 8080

# Using Node.js
npx serve portal

# Using PHP
php -S localhost:8080 -t portal
```

Then open `http://localhost:8080` in your browser.

## Deployment

This is a static site. Deploy to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static host

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
  --gold: #D4AF37;
  --black: #0A0A0A;
  --white: #FAFAFA;
  --purple: #6B4C9A;
}
```

### Content
- Update project examples in `projects.html`
- Add notebook entries in `lab-notebook.html`
- Modify philosophy items in `philosophy.html`
- Change contact details in `collaborate.html`

## Philosophy

This portal embodies our microstudio values:
- Small and focused
- Offline-first mindset (works without JS)
- African-centric design thinking
- Experimental and honest
- Beautiful in its simplicity

## License

Content © 2025 sspirial.systems  
Code available under MIT license (see root LICENSE file)

---

Built with curiosity in Africa 🌍
