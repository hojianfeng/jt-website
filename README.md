# JT Business Institute: Professional Business Training Website

This is a production-ready, single-page marketing website built for JT Business Institute — a modern training provider specialising in artificial intelligence, digital marketing, business management, and workplace skills. The codebase is a fully self-contained frontend, engineered for performance, SEO visibility, and lead conversion with zero framework dependencies.

## Core Design

**Visual Identity**: The site is built around a deliberate six-colour palette — **Navy #252E59**, **Terracotta #AD5A3F**, **Dark Green #2B4415**, **Lime #AFD65C**, **Peach #F2B59B**, and **Lavender #B8C3F0** — applied consistently through CSS custom properties across every section. Typography pairs **Inter** for body copy with **Playfair Display** for headings, establishing a premium corporate-education aesthetic. A dark mode toggle persists the user's preference via `localStorage`.

**Responsive Layout**: Every section is built mobile-first using CSS Grid and Flexbox with three breakpoints at 1024px, 768px, and 480px. The navigation collapses to a slide-in hamburger menu on mobile. All images are lazy-loaded and aspect-ratio locked to prevent layout shift.

## Sections & Content Structure

**Hero**: Full-viewport section with a Ken Burns zoom background image, a dual-gradient dark overlay blending navy and dark green, and a subtle CSS particle float animation. Copy includes a headline, subheading, two CTAs, and a three-metric KPI strip. Hero elements stagger in on load via a sequenced `animation-delay` pattern.

**Course Showcase**: A dedicated dark-green section highlights the flagship **Transforming Marketing with AI** course, including a meta pill row, skills tag cloud, course imagery with a floating badge, and two companion info cards. A separate six-card benefits grid reinforces the course value proposition with icon cards that animate a gradient top-border on hover.

**Course Filter**: A JavaScript-driven category filter allows visitors to toggle between **Artificial Intelligence**, **Digital Marketing**, **Business & Management**, **Workplace Skills**, and **Corporate Training** course cards without page reload. Cards animate in on filter change, with `Coming Soon` badges for pipeline courses.

**Corporate Training**: A two-column section promotes customised in-house and workshop-format training engagements, with four illustrated format rows and a proposal CTA leading directly to the enquiry form.

**Social Proof**: A three-slide testimonial carousel with autoplay, dot navigation, and touch swipe support. An FAQ accordion handles six common objections with smooth open/close transitions.

## Lead Capture

**Enquiry Form**: The contact section integrates with **FormSubmit.co** via `fetch()` to deliver enquiries directly to `hello@jt.edu.sg` without a backend server. The form includes client-side validation for all required fields — name, email, phone, and course selection — with inline error messages, a loading spinner state, and a success/error swap replacing the form on submission. Validation fires on `blur` and clears progressively as the user corrects each field.

## Animations & Interactivity

**Scroll Animations**: An `IntersectionObserver` triggers staggered `.anim → .visible` transitions across every content block as it enters the viewport, with sibling elements offset by 80ms each. **Animated statistics** in the Why JT section use a `requestAnimationFrame` counter with an ease-out cubic curve. A sticky navbar transitions from fully transparent over the hero to a frosted-glass surface with a drop shadow once the user scrolls past 60px.

**Utility Components**: A floating WhatsApp button with a tooltip, a back-to-top button that appears after 400px of scroll, and a full-screen loading screen with a progress bar animation that resolves before the hero sequence fires.

## Technology

Pure **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks, no build tools, no dependencies. Icons via **Font Awesome 6**. Fonts via **Google Fonts**. Form delivery via **FormSubmit.co**. Images served from **Unsplash** with width and quality parameters for fast loading. The entire site ships as three files: `index.html`, `style.css`, and `script.js`.

## Deployment

The site is hosted on **GitHub Pages** directly from the `main` branch root — no build step required. Any commit to `main` is live within seconds.
