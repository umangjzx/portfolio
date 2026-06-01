# Implementation Plan: Futuristic Portfolio

## Overview

Build a world-class futuristic personal portfolio website for Umang Jaiswal using React + Vite + TypeScript. The implementation follows an incremental approach: project scaffolding → core services → section components → overlay features → integration and polish. Each step builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Project scaffolding and core infrastructure
  - [x] 1.1 Initialize Vite + React + TypeScript project with dependencies
    - Run `npm create vite@latest` with React + TypeScript template
    - Install core dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `gsap`, `@studio-freight/lenis`, `zustand`, `tailwindcss`, `@shadcn/ui`
    - Install dev dependencies: `vitest`, `fast-check`, `@testing-library/react`, `@types/three`
    - Configure Tailwind CSS with custom theme colors (Electric Blue #00F5FF, Neon Purple #8B5CF6, Deep Space Black #050505)
    - Configure Vitest for unit and property-based testing
    - _Requirements: 16.1, 16.5_

  - [x] 1.2 Create directory structure and core type definitions
    - Create folder structure: `src/components/sections/`, `src/components/overlays/`, `src/services/`, `src/store/`, `src/data/`, `src/hooks/`, `src/types/`, `src/assets/`
    - Define all TypeScript interfaces from the design: `Project`, `SkillPlanet`, `TimelineMilestone`, `ChatMessage`, `Command`, `Particle`, `MousePosition`, `GPUTier`, `ContactFormData`, `ContactFormState`, `AITopic`, `AIResponse`, `ValidationResult`, `StatConfig`
    - Create theme constants file with colors, glassmorphism settings, typography, and animation config
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 1.3 Create static data files
    - Create `src/data/projects.ts` with all 6 project entries (AI Audio Safety, Mental Health AI Chatbot, Stock Prediction, Smart Waste Management, Community Resource Sharing, Social Network Analyzer)
    - Create `src/data/skills.ts` with 8 skill planets (Python, React, Flask, PostgreSQL, TensorFlow, Docker, AWS, Machine Learning)
    - Create `src/data/milestones.ts` with 5 timeline milestones
    - Create `src/data/stats.ts` with 4 stat counters
    - Create `src/data/commands.ts` with command palette entries (View Projects, Download Resume, Contact, GitHub, LinkedIn)
    - Create `src/data/ai-knowledge.ts` with AI assistant knowledge base entries for skills, projects, contact, experience topics
    - _Requirements: 5.2, 6.2, 7.4, 8.2, 12.2, 11.3_

  - [x] 1.4 Implement Zustand global state store
    - Create `src/store/portfolioStore.ts` implementing the `PortfolioStore` interface
    - Include scroll state, GPU tier, theme mode, audio state, cursor position, loading state, AI assistant state, and command palette state
    - Implement all toggle and setter actions
    - _Requirements: 3.1, 15.5, 17.3_

- [x] 2. Core services layer
  - [x] 2.1 Implement GPU Detector service
    - Create `src/services/gpuDetector.ts` implementing `GPUDetectorService`
    - Detect GPU capability using WebGL renderer info
    - Return 'high' or 'low' tier with appropriate particle counts
    - Default to 'low' tier if detection fails
    - _Requirements: 15.1, 15.5, 15.7_

  - [x] 2.2 Implement Mouse Tracker service
    - Create `src/services/mouseTracker.ts` implementing `MouseTrackerService`
    - Track cursor position with normalized coordinates (-1 to 1)
    - Implement pub/sub pattern for position updates
    - Detect touch devices and disable cursor tracking accordingly
    - _Requirements: 2.3, 13.1, 13.5_

  - [x] 2.3 Implement Form Validator service
    - Create `src/services/formValidator.ts` implementing `FormValidatorService`
    - Validate name (required, max 100 chars), email (required, max 254 chars, valid format), message (required, max 1000 chars)
    - Return structured `ValidationResult` with per-field errors
    - _Requirements: 10.1, 10.5, 10.6_

  - [x]* 2.4 Write property test for Form Validator (Property 7)
    - **Property 7: Form validation correctly classifies inputs**
    - Use fast-check to generate arbitrary form data and verify validation rules
    - Test: name invalid if empty or >100 chars, email invalid if empty, >254 chars, or bad format, message invalid if empty or >1000 chars, isValid=true only when all pass
    - **Validates: Requirements 10.1, 10.5, 10.6**

  - [x] 2.5 Implement Fuzzy Search service
    - Create `src/services/fuzzySearch.ts` implementing `FuzzySearchService`
    - Implement fuzzy matching against command labels and keywords
    - Return filtered and relevance-sorted subset of input commands
    - _Requirements: 12.3_

  - [x]* 2.6 Write property test for Fuzzy Search (Property 9)
    - **Property 9: Fuzzy search returns valid subsets**
    - Use fast-check to generate arbitrary queries and command lists
    - Test: result is subset of input, only matching commands included, ordered by relevance score descending
    - **Validates: Requirements 12.3**

  - [x] 2.7 Implement Konami Code Detector service
    - Create `src/services/konamiDetector.ts` implementing `KonamiDetectorService`
    - Track key sequence, return true only when last 10 keys match Konami code exactly
    - Reset state on incorrect key
    - _Requirements: 14.1_

  - [x]* 2.8 Write property test for Konami Detector (Property 11)
    - **Property 11: Konami code detection is sequence-exact**
    - Use fast-check to generate arbitrary key sequences
    - Test: returns true only for exact Konami sequence, any wrong key resets state
    - **Validates: Requirements 14.1**

  - [x] 2.9 Implement AI Responder service
    - Create `src/services/aiResponder.ts` implementing `AIResponderService`
    - Route questions to topics based on keyword matching (skills, projects, contact, experience)
    - Return fallback response for unrecognized topics listing available topics
    - _Requirements: 11.3, 11.5_

  - [x]* 2.10 Write property test for AI Responder (Property 8)
    - **Property 8: AI responder routes questions to correct topics**
    - Use fast-check to generate question strings with/without topic keywords
    - Test: keyword-containing questions route to correct topic, no-keyword questions return fallback
    - **Validates: Requirements 11.3, 11.5**

  - [x] 2.11 Implement Audio Manager service
    - Create `src/services/audioManager.ts` implementing `AudioManagerService`
    - Initialize Web Audio API context on first user interaction
    - Persist mute/unmute preference in localStorage
    - Gracefully handle unsupported environments
    - _Requirements: 17.1, 17.3, 17.4_

- [x] 3. Checkpoint - Core services complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Scroll engine and performance system
  - [x] 4.1 Implement Lenis scroll engine with GSAP ScrollTrigger
    - Create `src/hooks/useScrollEngine.ts` initializing Lenis with duration 1.2s and cubic-bezier easing (0.25, 0.0, 0.35, 1.0)
    - Integrate GSAP ScrollTrigger for section-based animations
    - Update Zustand store with scroll position and current section
    - Support both mouse wheel and touch scrolling with identical behavior
    - _Requirements: 3.1, 3.4, 3.6, 3.7_

  - [x] 4.2 Implement parallax layer system
    - Create `src/hooks/useParallax.ts` computing layer offsets based on scroll position
    - Background layers at 0.3x, midground at 0.6x, foreground at 1.0x scroll speed
    - _Requirements: 3.2, 3.5_

  - [x]* 4.3 Write property test for parallax calculations (Property 3)
    - **Property 3: Parallax layer offsets respect multipliers**
    - Use fast-check to generate arbitrary scroll positions
    - Test: offset equals scroll × multiplier for each layer (0.3, 0.6, 1.0)
    - **Validates: Requirements 3.2, 3.5**

  - [x] 4.4 Implement Performance Manager with GPU detection integration
    - Create `src/hooks/usePerformance.ts` that runs GPU detection on mount
    - Set particle counts and 3D feature flags based on GPU tier
    - Store tier in Zustand for global access
    - _Requirements: 15.1, 15.5, 15.7_

- [x] 5. Intro Loader and Hero Section
  - [x] 5.1 Implement Intro Loader component
    - Create `src/components/sections/IntroLoader.tsx`
    - Render boot animation with sequential system initialization text lines
    - Display loading percentage (0-100) reflecting actual asset loading progress
    - Show "INITIALIZING PORTFOLIO" for minimum 1.5s, then "LOADING DIGITAL EXPERIENCE"
    - Implement particle formation effect assembling into geometric shape
    - Transition to Hero with 800ms fade-out on completion
    - Enforce minimum 3s display, max 5s on 25Mbps+, error state with retry after 10s
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x]* 5.2 Write property test for loading progress (Property 1)
    - **Property 1: Loading progress is bounded and monotonic**
    - Use fast-check to generate sequences of loading events
    - Test: progress always in [0, 100], each value ≥ previous value
    - **Validates: Requirements 1.2**

  - [x] 5.3 Implement Hero Section with 3D environment
    - Create `src/components/sections/HeroSection.tsx` with React Three Fiber canvas
    - Render 3D holographic avatar with sine-wave floating animation (0.3 units, 2.5s period)
    - Implement animated background: 1000+ stars, 200-500 particles, nebula clouds, grid floor, holographic rings
    - Apply orbital camera movement at 0.05 rad/s
    - Animate "UMANG JAISWAL" character-by-character (80ms/char, glitch + neon trails, 1500ms total)
    - Fade in subtitle "Entrepreneur • Developer • AI Builder" (600ms)
    - Pause 3D rendering when section scrolls out of viewport
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.10_

  - [x] 5.4 Implement cursor-to-avatar rotation tracking
    - Connect Mouse Tracker service to avatar head rotation
    - Clamp rotation to ±30° horizontal, ±20° vertical with 100ms interpolation
    - Disable on touch devices (neutral forward-facing)
    - _Requirements: 2.3, 2.9_

  - [x]* 5.5 Write property test for cursor-to-avatar rotation (Property 2)
    - **Property 2: Cursor-to-avatar rotation is clamped**
    - Use fast-check to generate arbitrary cursor positions (including extreme values)
    - Test: computed rotation always within ±30° horizontal and ±20° vertical
    - **Validates: Requirements 2.3**

- [x] 6. Checkpoint - Core sections rendering
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Content sections (About, Skills, Projects)
  - [x] 7.1 Implement About Me section
    - Create `src/components/sections/AboutSection.tsx`
    - Render About_Card with Glassmorphism styling (backdrop blur 12px, border opacity 15%, gradient 10%)
    - Animate 3D rotation reveal from 90° X-axis to 0° on 20% viewport entry (800ms)
    - Implement 3D tilt on hover (max ±15°), reset to 0° in 300ms on mouse leave
    - Add holographic decorations: scan lines, system text readouts, border glow
    - Floating animation: 6px vertical displacement, 3s sine-wave cycle
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x]* 7.2 Write property test for card tilt angles (Property 4)
    - **Property 4: Card tilt angles are bounded**
    - Use fast-check to generate arbitrary cursor positions relative to card bounds
    - Test: computed tilt always within ±15° on both X and Y axes
    - **Validates: Requirements 4.3**

  - [x] 7.3 Implement Skills Galaxy section
    - Create `src/components/sections/SkillsGalaxy.tsx` with R3F canvas
    - Render "AI ENGINEER" central core with 8 orbiting skill planets
    - Animate continuous orbital rotation (8-20s per orbit, individually varied)
    - Implement hover: expand planet to 1.5x (300ms), show tooltip with name + proficiency, emit particle burst
    - Render orbital paths as glowing rings (opacity 0.2-0.4)
    - Entry animation: planets from center outward to orbits over 1.5s
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 7.4 Implement Project Universe section
    - Create `src/components/sections/ProjectUniverse.tsx`
    - Render 6 project Holographic Cards with reflective glass and dynamic lighting
    - Implement hover: 3D tilt (max 15°), lighting shift, muted autoplay video preview
    - Implement click: open modal with Glassmorphism styling (400ms entrance), description, tech stack, screenshots, GitHub/live links
    - Modal: background blur, focus trap, close on Escape/outside click (300ms exit)
    - Handle missing video/live demo gracefully (static thumbnail, omit link)
    - Staggered entry animation (fade-and-rise, 1s total)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 8. Content sections (Timeline, AI Lab, Testimonials, Contact)
  - [x] 8.1 Implement Experience Timeline section
    - Create `src/components/sections/ExperienceTimeline.tsx`
    - Render vertical timeline with glowing progress path
    - Illuminate nodes when scrolled past 75% from viewport top, fill progress path
    - Animate events: fade (0→1) + slide (30px up) over 600ms on viewport entry
    - Display 5 milestones in order with title, date, description
    - Pulsing glow on illuminated nodes (1.5s cycle)
    - Initial state: all nodes dimmed, path unlit
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x]* 8.2 Write property test for timeline illumination (Property 5)
    - **Property 5: Timeline node illumination is threshold-based**
    - Use fast-check to generate node positions and scroll positions
    - Test: node illuminated iff scrolled past 75% threshold, progress fill = illuminated/total
    - **Validates: Requirements 7.2**

  - [x] 8.3 Implement AI Laboratory section
    - Create `src/components/sections/AILaboratory.tsx`
    - Render control center layout with live coding animations and 3+ floating charts
    - Implement animated counters: count from 0 to target over 2s with easing on 25% viewport entry
    - Render neural network visualization (8+ nodes, animated connections)
    - Floating charts: 2-4px oscillation, visual data-update every 3-5s
    - Counters stay at final value if section re-enters viewport (no re-trigger)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x]* 8.4 Write property test for counter easing (Property 6)
    - **Property 6: Counter easing produces bounded monotonic values**
    - Use fast-check to generate target values and elapsed times
    - Test: value in [0, target], monotonically non-decreasing, equals target at duration end
    - **Validates: Requirements 8.3**

  - [x] 8.5 Implement Testimonials section
    - Create `src/components/sections/TestimonialsSection.tsx`
    - Render 3-8 testimonial Holographic Cards in 3D space (Z-depth variation ≥30px)
    - Display quote (max 280 chars), author name, role/affiliation
    - Continuous drift animation (8-12s oscillation cycle)
    - Hover: translate +20px Z-axis, +25% brightness
    - Directional lighting with shadow/highlight differentiation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 8.6 Implement Contact Portal section
    - Create `src/components/sections/ContactPortal.tsx`
    - Render Glassmorphism form with name, email, message fields (with max lengths)
    - Focus animation: neon glow border + typing cursor
    - Submit button: liquid hover effect with magnetic pull (50px radius, max 8px translation)
    - Integrate Form Validator service for client-side validation
    - Success confirmation (500ms animated transition)
    - Error display: red glow on invalid fields with adjacent error messages
    - Disable submit + loading indicator during submission (10s timeout)
    - Preserve data on network error
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [x]* 8.7 Write property test for magnetic pull (Property 10)
    - **Property 10: Magnetic pull is distance-gated and magnitude-bounded**
    - Use fast-check to generate cursor and element positions
    - Test: translation is zero when distance >50px, magnitude ≤8px when distance ≤50px
    - **Validates: Requirements 13.2**

- [x] 9. Checkpoint - All content sections complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Overlay components and interactions
  - [x] 10.1 Implement AI Assistant Orb overlay
    - Create `src/components/overlays/AIAssistant.tsx`
    - Render floating orb (48-56px), fixed bottom-right, pulsing glow (2-3s cycle)
    - Click: expand to chat interface with Glassmorphism styling (300ms)
    - Text input + send button, submit on Enter or click
    - Integrate AI Responder service for answers (display with animated speaking effect)
    - Processing state: animated wave pattern on orb
    - Close: collapse back to orb (300ms) on close button or orb click
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 10.2 Implement Command Palette overlay
    - Create `src/components/overlays/CommandPalette.tsx`
    - Open on CTRL+K / CMD+K with centered Glassmorphism overlay (200ms fade-in)
    - Display 5 commands (View Projects, Download Resume, Contact, GitHub, LinkedIn)
    - Real-time fuzzy filtering via Fuzzy Search service (<100ms per keystroke)
    - Execute action + close (200ms fade-out) on click or Enter
    - Close on Escape (200ms fade-out)
    - Keyboard navigation: Up/Down arrows + Enter to select
    - "No results found" message when no matches
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [x] 10.3 Implement Cursor Effects overlay
    - Create `src/components/overlays/CursorEffects.tsx`
    - Render trailing particle effect (8-15 particles, fade within 500ms)
    - Magnetic pull on interactive elements within 50px (max 8px, 150ms easing)
    - Click burst: 12-20 particles radially outward, fade within 800ms
    - Custom cursor (32x32px crosshair with glow)
    - Disable all effects on touch devices
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 10.4 Implement Konami Code and Easter Eggs
    - Integrate Konami Detector service with global keydown listener
    - On activation: apply cyberpunk mode (neon-dominant colors, CRT scanlines, chromatic aberration, increased glow)
    - On second activation: restore default theme
    - Log styled console messages with ASCII art on page load
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 10.5 Implement Audio Toggle overlay
    - Create `src/components/overlays/AudioToggle.tsx`
    - Render fixed-position mute/unmute toggle visible on all sections
    - Initialize audio context on first user interaction
    - Default to muted, persist preference in localStorage
    - Hide toggle if audio context fails to initialize
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [x] 11. App shell and integration wiring
  - [x] 11.1 Implement App.tsx root component
    - Create `src/App.tsx` wiring all sections in order: IntroLoader → Hero → About → Skills → Projects → Experience → AI Lab → Testimonials → Contact
    - Initialize Lenis scroll engine on mount
    - Initialize GPU detection and set performance tier
    - Render overlay components (AI Orb, Cursor Effects, Audio Toggle, Command Palette)
    - Manage intro loader → main content transition
    - _Requirements: 1.5, 3.1, 15.7_

  - [x] 11.2 Implement responsive layout and mobile adaptations
    - Ensure no horizontal scrollbar or content overflow for viewports 320px-768px
    - All interactive elements meet 44x44px minimum tap target
    - Disable 3D/particle effects on low-tier GPU mobile devices
    - _Requirements: 15.4, 15.5_

  - [x] 11.3 Implement lazy loading and code splitting
    - Lazy-load all Three.js canvases, images, and components >50KB not in initial viewport
    - Configure Vite code splitting to keep initial bundle ≤200KB gzipped
    - _Requirements: 15.2, 15.3, 15.6_

  - [x] 11.4 Implement accessibility features
    - Focus trap in project modal and command palette
    - Keyboard navigation for command palette (Up/Down/Enter/Escape)
    - Minimum text contrast ratio 4.5:1 body, 3:1 large text (18px+)
    - Proper ARIA labels on interactive elements
    - _Requirements: 6.5, 6.6, 12.6, 16.6_

- [x] 12. Final checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses TypeScript throughout as specified in the design
- All 11 correctness properties from the design are covered by property test tasks
- fast-check is used as the property-based testing library with minimum 100 iterations per test

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1", "2.2", "2.3", "2.5", "2.7", "2.9", "2.11"] },
    { "id": 3, "tasks": ["2.4", "2.6", "2.8", "2.10", "4.1", "4.2", "4.4"] },
    { "id": 4, "tasks": ["4.3", "5.1", "5.3"] },
    { "id": 5, "tasks": ["5.2", "5.4"] },
    { "id": 6, "tasks": ["5.5", "7.1", "7.3", "7.4"] },
    { "id": 7, "tasks": ["7.2", "8.1", "8.3", "8.5", "8.6"] },
    { "id": 8, "tasks": ["8.2", "8.4", "8.7"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5"] },
    { "id": 10, "tasks": ["11.1"] },
    { "id": 11, "tasks": ["11.2", "11.3", "11.4"] }
  ]
}
```
