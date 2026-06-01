# Requirements Document

## Introduction

A world-class futuristic personal portfolio website for Umang Jaiswal (Entrepreneur, Developer, AI Builder). The website blends design aesthetics from Tesla, Apple Vision Pro, Cyberpunk 2077, and modern AI interfaces to create a premium, award-winning digital experience. The portfolio feels like entering a futuristic digital universe with cinematic animations, 3D-rich environments, immersive scrolling, and interactive elements. Built with React + Vite, Three.js/React Three Fiber, Framer Motion, GSAP ScrollTrigger, Tailwind CSS, ShadCN UI, TypeScript, and Lenis Smooth Scrolling.

## Glossary

- **Portfolio_App**: The complete futuristic personal portfolio web application
- **Intro_Loader**: The cinematic loading sequence displayed on initial page load
- **Hero_Section**: The full-screen 3D landing environment with avatar and dynamic background
- **Scroll_Engine**: The smooth scrolling system powered by Lenis with GSAP ScrollTrigger integration
- **About_Card**: The futuristic AI profile card in the About Me section
- **Skills_Galaxy**: The 3D solar system visualization of technical skills
- **Project_Universe**: The holographic project showcase section
- **Experience_Timeline**: The futuristic vertical timeline of career milestones
- **AI_Laboratory**: The control center section displaying statistics and visualizations
- **Testimonials_Section**: The floating holographic testimonial cards section
- **Contact_Portal**: The futuristic command center contact form
- **AI_Assistant**: The floating AI orb that answers questions about the portfolio owner
- **Command_Palette**: The CTRL+K activated futuristic command center overlay
- **Particle_System**: The WebGL-based particle simulation engine for visual effects
- **Glassmorphism_Panel**: A UI panel with frosted glass effect, blur, and transparency
- **Holographic_Card**: A 3D-tiltable card with reflective glass effect and dynamic lighting
- **Mouse_Tracker**: The system that tracks cursor position for interactive effects
- **Camera_Controller**: The Three.js camera system managing transitions and movements
- **Theme_Colors**: Primary Electric Blue (#00F5FF), Secondary Neon Purple (#8B5CF6), Accent Cyan/Pink/Glass White, Background Deep Space Black (#050505)

## Requirements

### Requirement 1: Cinematic Intro Loader

**User Story:** As a visitor, I want to see a cinematic loading sequence when the site loads, so that I feel immersed in a futuristic digital experience from the first moment.

#### Acceptance Criteria

1. WHEN the Portfolio_App is first accessed, THE Intro_Loader SHALL display a boot animation sequence with sequential lines of system initialization text appearing one line at a time
2. WHEN the Portfolio_App is loading assets, THE Intro_Loader SHALL display a loading percentage from 0 to 100 that reflects actual asset loading progress, updating at least every 500ms
3. WHILE the Intro_Loader is active, THE Particle_System SHALL render a particle formation effect that progressively assembles into a recognizable geometric shape by the time loading reaches 100%
4. THE Intro_Loader SHALL display the text "INITIALIZING PORTFOLIO" for a minimum of 1.5 seconds, followed by "LOADING DIGITAL EXPERIENCE" for the remainder of the loading sequence
5. WHEN all assets are loaded, THE Intro_Loader SHALL transition to the Hero_Section with a fade-out animation completing within 800ms
6. THE Intro_Loader SHALL complete the full loading sequence within 5 seconds on a connection of 25 Mbps download speed or higher, with a minimum display duration of 3 seconds even if assets load sooner
7. IF asset loading fails or exceeds 10 seconds, THEN THE Intro_Loader SHALL display an error message indicating the failure and provide a retry option to restart the loading sequence

### Requirement 2: Hero Section with 3D Environment

**User Story:** As a visitor, I want to see an impressive full-screen 3D environment with a floating avatar and dynamic background, so that I understand this is a premium, cutting-edge portfolio.

#### Acceptance Criteria

1. THE Hero_Section SHALL render a full-screen Three.js 3D environment occupying 100% of the viewport width and 100% of the viewport height
2. THE Hero_Section SHALL display a 3D holographic avatar with a floating animation using a continuous sine-wave vertical oscillation of 0.3 units amplitude and a 2.5-second period
3. WHEN the visitor moves the cursor, THE Mouse_Tracker SHALL update the avatar head rotation to follow the cursor position within a range of ±30 degrees horizontal and ±20 degrees vertical, with a smooth interpolation delay of 100ms
4. THE Hero_Section SHALL render an animated background containing at least 1000 stars, 200–500 floating particles, nebula clouds, a grid floor, and holographic rings
5. WHILE the Hero_Section is in viewport, THE Camera_Controller SHALL apply a continuous orbital movement at a rotation speed of 0.05 radians per second to create depth perception
6. WHEN the Hero_Section loads, THE Portfolio_App SHALL animate the name "UMANG JAISWAL" with a character-by-character reveal effect at 80ms per character, including glitch distortion and neon light trails, completing within 1500ms total
7. WHEN the name reveal animation completes, THE Hero_Section SHALL display the subtitle "Entrepreneur • Developer • AI Builder" below the name with a fade-in animation lasting 600ms
8. WHILE the Hero_Section is in viewport, THE Hero_Section SHALL maintain a minimum frame rate of 60 FPS on devices with a dedicated GPU released within the last 5 years, and a minimum frame rate of 30 FPS on all other devices
9. IF the visitor is on a touch device without a cursor, THEN THE Mouse_Tracker SHALL disable head-rotation tracking and the avatar SHALL maintain a neutral forward-facing orientation
10. WHEN the Hero_Section scrolls fully out of viewport, THE Hero_Section SHALL pause rendering of the 3D environment to conserve system resources

### Requirement 3: Smooth Scroll Experience

**User Story:** As a visitor, I want scrolling to feel like flying through a futuristic world, so that navigation between sections feels cinematic and immersive.

#### Acceptance Criteria

1. THE Scroll_Engine SHALL use Lenis for smooth scrolling with a duration of 1.2 seconds and cubic-bezier easing (0.25, 0.0, 0.35, 1.0)
2. WHEN the visitor scrolls between sections, THE Scroll_Engine SHALL apply parallax depth effects to background layers at 0.3x scroll speed, midground layers at 0.6x scroll speed, and foreground layers at 1.0x scroll speed
3. WHEN a section enters the viewport by at least 20%, THE Camera_Controller SHALL execute a camera position transition over 800ms with ease-in-out timing
4. THE Scroll_Engine SHALL eliminate standard page jumps by interpolating all scroll position changes with no instantaneous position updates
5. WHILE the visitor is scrolling, THE Portfolio_App SHALL render layered parallax effects on foreground, midground, and background elements at their respective scroll speed multipliers
6. THE Scroll_Engine SHALL support both mouse wheel and touch-based scrolling with identical easing and duration behavior across desktop and mobile devices
7. WHEN a navigation link or programmatic scroll is triggered, THE Scroll_Engine SHALL animate to the target section using the same duration and easing as manual scrolling

### Requirement 4: About Me Section

**User Story:** As a visitor, I want to see a futuristic AI profile card with Umang's information, so that I can learn about the portfolio owner in an engaging way.

#### Acceptance Criteria

1. WHEN the About section enters the viewport by at least 20% visibility, THE About_Card SHALL animate into view with a 3D rotation reveal from a folded state (starting at 90° on the X-axis rotating to 0°) completing within 800ms
2. THE About_Card SHALL display bio, experience summary, skills overview, and education using Glassmorphism_Panel styling
3. WHEN the visitor hovers over the About_Card, THE About_Card SHALL apply a 3D tilt effect responding to cursor position within the card bounds with a maximum tilt angle of 15 degrees on each axis
4. IF the visitor moves the cursor away from the About_Card, THEN THE About_Card SHALL smoothly reset the tilt angle to 0 degrees on both axes within 300ms
5. THE About_Card SHALL render holographic UI panel decorations including scan lines, decorative system-style text readouts, and border glow effects using Theme_Colors
6. WHILE the About section is in viewport, THE About_Card SHALL maintain a floating animation with a 6px vertical displacement over a 3-second oscillation cycle using a sine-wave easing

### Requirement 5: Skills Galaxy Visualization

**User Story:** As a visitor, I want to see skills displayed as a 3D solar system, so that I can explore technical competencies in an interactive and memorable way.

#### Acceptance Criteria

1. THE Skills_Galaxy SHALL render a 3D solar system with "AI ENGINEER" as the central core element
2. THE Skills_Galaxy SHALL display skill planets orbiting the central core: Python, React, Flask, PostgreSQL, TensorFlow, Docker, AWS, and Machine Learning
3. WHILE the Skills_Galaxy is in viewport, THE skill planets SHALL orbit the central core with continuous rotation at individually varied speeds ranging from 8 to 20 seconds per full orbit
4. WHEN the visitor hovers over a skill planet, THE Skills_Galaxy SHALL expand that planet to 1.5x its original size over 300ms, display a tooltip panel containing the skill name and proficiency level, and emit a particle burst effect
5. WHEN the visitor moves the cursor away from a skill planet, THE Skills_Galaxy SHALL return that planet to its original size over 300ms and hide the tooltip panel
6. THE Skills_Galaxy SHALL render orbital paths as visible rings with a glow effect at opacity between 0.2 and 0.4 using Theme_Colors
7. WHEN the Skills section enters the viewport, THE Skills_Galaxy SHALL animate planets from the center outward to their orbital positions over 1.5 seconds

### Requirement 6: Project Universe Showcase

**User Story:** As a visitor, I want to browse projects through holographic cards with immersive details, so that I can understand the scope and quality of work completed.

#### Acceptance Criteria

1. THE Project_Universe SHALL display project cards as Holographic_Cards with reflective glass effect and dynamic lighting that shifts based on cursor proximity to each card
2. THE Project_Universe SHALL showcase the following projects: AI Audio Safety System, Mental Health AI Chatbot, Stock Prediction Platform, Smart Waste Management, Community Resource Sharing, and Social Network Analyzer
3. WHEN the visitor hovers over a Holographic_Card, THE Holographic_Card SHALL apply a 3D tilt effect with a maximum tilt angle of 15 degrees, adjust lighting based on cursor position within the card, and display a muted autoplaying video preview of the project
4. WHEN the visitor clicks a Holographic_Card, THE Portfolio_App SHALL open a modal with Glassmorphism_Panel styling and an entrance animation completing within 400ms, containing project description, tech stack, screenshots, GitHub link, and live demo link
5. WHILE the project modal is open, THE Portfolio_App SHALL apply a background blur effect to the page content behind the modal and trap keyboard focus within the modal
6. IF the visitor presses the Escape key or clicks outside the modal, THEN THE Portfolio_App SHALL close the modal with an exit animation within 300ms and return focus to the previously active Holographic_Card
7. IF a project does not have a video preview or live demo link available, THEN THE Portfolio_App SHALL display a static thumbnail in place of the video preview and omit the live demo link from the modal
8. WHEN the Project_Universe section enters the viewport, THE Project_Universe SHALL animate the Holographic_Cards into view with a staggered fade-and-rise sequence completing within 1 second

### Requirement 7: Experience Timeline

**User Story:** As a visitor, I want to see career milestones on a futuristic timeline that activates as I scroll, so that I can follow the professional journey chronologically.

#### Acceptance Criteria

1. THE Experience_Timeline SHALL render a vertical timeline with a glowing progress path using Theme_Colors
2. WHEN a timeline node scrolls past 75% from the top of the viewport, THE Experience_Timeline SHALL illuminate that node and fill the progress path up to that node's position
3. WHEN a timeline event enters the viewport, THE Experience_Timeline SHALL animate that event with a fade from opacity 0 to 1 and a vertical slide of 30px upward over 600ms
4. THE Experience_Timeline SHALL display the following milestones in chronological order: MBA Graduate, Entrepreneur, Hackathons, AI Projects, and Leadership Roles, each showing a title, date or year, and a one-line description
5. WHILE a timeline node is illuminated, THE Experience_Timeline SHALL render a pulsing glow effect on the node connector with a 1.5-second pulse cycle
6. WHEN the Experience section first enters the viewport and no scrolling has activated any node, THE Experience_Timeline SHALL display all milestone nodes in a dimmed, non-illuminated state with the progress path unlit

### Requirement 8: AI Laboratory Statistics Section

**User Story:** As a visitor, I want to see a futuristic control center displaying achievements and statistics, so that I can quickly grasp the breadth of accomplishments.

#### Acceptance Criteria

1. THE AI_Laboratory SHALL render a futuristic control center layout with live coding animations and at least 3 floating chart visualizations
2. THE AI_Laboratory SHALL display animated counters for: Projects completed, Technologies mastered, GitHub contributions, and Hackathons attended, each with a configurable target value greater than or equal to zero
3. WHEN at least 25% of the AI_Laboratory section enters the viewport, THE animated counters SHALL count up from zero to their target values over 2 seconds with an easing curve
4. THE AI_Laboratory SHALL render an AI neural network visualization with at least 8 nodes and animated connection paths showing node activation effects
5. WHILE the AI_Laboratory is in viewport, THE floating charts SHALL animate with a continuous oscillation of 2-4px vertical translation and display a visual data-update effect every 3 to 5 seconds
6. IF the user scrolls the AI_Laboratory section out of the viewport and back into view, THEN THE animated counters SHALL remain at their final target values without re-triggering the count-up animation

### Requirement 9: Testimonials Section

**User Story:** As a visitor, I want to read testimonials displayed as floating holographic cards, so that I can see social proof in an engaging format.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL render a minimum of 3 and a maximum of 8 testimonial cards as floating Holographic_Cards arranged in 3D space with Z-axis depth variation of at least 30px between the nearest and farthest cards
2. THE Testimonials_Section SHALL display on each testimonial card the testimonial quote text (maximum 280 characters), the author name, and the author role or affiliation
3. WHILE the Testimonials section is in viewport, THE testimonial cards SHALL move with a continuous drift animation completing one full oscillation cycle every 8 to 12 seconds in 3D space
4. WHEN the visitor hovers over a testimonial card, THE testimonial card SHALL translate toward the viewer by at least 20px on the Z-axis and increase in brightness by 25% relative to its idle state
5. THE Testimonials_Section SHALL apply directional lighting from a single dominant light source to create visible shadow and highlight differentiation on the Holographic_Cards using Theme_Colors

### Requirement 10: Contact Portal

**User Story:** As a visitor, I want to use a futuristic contact form that feels like a command center, so that I can reach out while staying immersed in the experience.

#### Acceptance Criteria

1. THE Contact_Portal SHALL render a contact form using Glassmorphism_Panel styling with input fields for name (maximum 100 characters), email (maximum 254 characters), and message (maximum 1000 characters), where name and email are required and message is required
2. WHEN the visitor focuses on an input field, THE Contact_Portal SHALL animate the field border with a neon glow effect using Theme_Colors and display a typing cursor animation
3. THE Contact_Portal SHALL display an AI assistant orb with an animated speaking effect positioned adjacent to the form
4. WHEN the visitor hovers over the submit button, THE submit button SHALL apply a liquid hover effect with glow and magnetic interaction pulling toward the cursor within a 50px radius
5. WHEN the visitor submits the form with all required fields populated and a valid email format, THE Contact_Portal SHALL display a success confirmation message with an animated transition completing within 500ms
6. IF the visitor submits the form with any required field empty or an invalid email format, THEN THE Contact_Portal SHALL highlight each invalid field with a red glow effect and display an error message adjacent to each invalid field indicating the validation failure reason
7. WHILE the form is being submitted, THE Contact_Portal SHALL disable the submit button and display a loading indicator until submission completes or fails within a 10-second timeout
8. IF the form submission fails due to a network error or timeout, THEN THE Contact_Portal SHALL display an error message indicating the submission could not be completed and preserve the visitor's entered data

### Requirement 11: AI Assistant Orb

**User Story:** As a visitor, I want to interact with a floating AI orb that can answer questions about the portfolio owner, so that I can get information conversationally.

#### Acceptance Criteria

1. THE AI_Assistant SHALL render as a floating orb of 48–56px diameter, fixed-positioned in the bottom-right corner of the viewport, visible on all sections with a pulsing ambient glow animation cycling every 2–3 seconds
2. WHEN the visitor clicks the AI_Assistant orb, THE AI_Assistant SHALL expand into a chat interface with Glassmorphism_Panel styling within 300ms, displaying a text input field and a send button
3. WHEN the visitor submits a question by pressing Enter or clicking the send button, THE AI_Assistant SHALL provide an answer about skills, projects, contact information, or experience within 2 seconds, displayed with an animated speaking effect
4. WHILE the AI_Assistant is responding, THE AI_Assistant orb SHALL display an animated wave pattern indicating active processing
5. IF the visitor submits a question that does not relate to skills, projects, contact information, or experience, THEN THE AI_Assistant SHALL respond with a fallback message listing the available topics the visitor can ask about
6. WHEN the visitor clicks a close button within the chat interface or clicks the AI_Assistant orb while the chat is open, THE AI_Assistant SHALL collapse the chat interface back to the floating orb state within 300ms

### Requirement 12: Command Palette

**User Story:** As a visitor, I want to open a command center with keyboard shortcuts, so that I can quickly navigate to any section or action.

#### Acceptance Criteria

1. WHEN the visitor presses CTRL+K (or CMD+K on macOS), THE Command_Palette SHALL open as a centered overlay with Glassmorphism_Panel styling and a fade-in animation completing within 200ms
2. THE Command_Palette SHALL display commands for: View Projects, Download Resume, Contact, GitHub, and LinkedIn
3. WHEN the visitor types in the Command_Palette search field, THE Command_Palette SHALL filter available commands in real-time with fuzzy matching, updating results within 100ms of each keystroke
4. WHEN the visitor selects a command via click or Enter key, THE Command_Palette SHALL execute the action and close with a fade-out animation within 200ms
5. IF the visitor presses Escape while the Command_Palette is open, THEN THE Command_Palette SHALL close immediately with a fade-out animation within 200ms
6. THE Command_Palette SHALL support keyboard navigation with Up/Down arrow keys to move between commands and Enter to select the highlighted command
7. IF no commands match the visitor's search input, THEN THE Command_Palette SHALL display a "No results found" message in the results area

### Requirement 13: Mouse and Cursor Effects

**User Story:** As a visitor, I want interactive cursor effects throughout the site, so that every mouse movement feels responsive and futuristic.

#### Acceptance Criteria

1. WHILE the visitor moves the cursor, THE Mouse_Tracker SHALL render a trailing particle effect of 8 to 15 particles following the cursor path, where each particle fades out within 500ms of emission
2. WHEN the visitor moves the cursor within 50px of an interactive element, THE interactive element SHALL translate toward the cursor position by a maximum of 8px with an easing transition of 150ms
3. WHEN the visitor clicks anywhere on the page, THE Particle_System SHALL emit a burst of 12 to 20 particles from the click position, spreading radially outward and fading out within 800ms
4. THE Mouse_Tracker SHALL render a custom cursor of 32x32px replacing the default browser cursor with a crosshair design and a glow effect using Theme_Colors
5. WHILE the Portfolio_App is accessed on a touch device without a pointer, THE Mouse_Tracker SHALL disable all cursor-following effects and particle trails

### Requirement 14: Easter Eggs and Hidden Interactions

**User Story:** As a visitor, I want to discover hidden interactions and secret modes, so that I feel rewarded for exploring the site deeply.

#### Acceptance Criteria

1. WHEN the visitor enters the Konami code sequence (Up Up Down Down Left Right Left Right B A) via keyboard, THE Portfolio_App SHALL activate cyberpunk mode by applying a distinct neon-dominant color scheme and visual effects to the page within 1 second of the final key press
2. WHEN the visitor enters the Konami code sequence a second time while cyberpunk mode is active, THE Portfolio_App SHALL deactivate cyberpunk mode and restore the default color scheme and visual state within 1 second
3. WHEN the page loads, THE Portfolio_App SHALL log styled developer console messages containing ASCII art and the developer's name and role
4. WHILE cyberpunk mode is active, THE Portfolio_App SHALL apply a CRT scanline overlay, chromatic aberration, and increased neon glow effects compared to the default theme across all visible sections

### Requirement 15: Performance and Responsiveness

**User Story:** As a visitor, I want the portfolio to perform smoothly on all devices, so that the experience is consistent regardless of hardware.

#### Acceptance Criteria

1. WHILE the Portfolio_App is accessed on a device with a dedicated GPU, THE Portfolio_App SHALL maintain a minimum of 60 FPS for all CSS, Framer Motion, and Three.js animations measured over any continuous 5-second window
2. THE Portfolio_App SHALL lazy-load all Three.js assets, images, and components exceeding 50KB uncompressed that are not visible within the initial viewport on page load
3. THE Portfolio_App SHALL achieve a Lighthouse performance score of 90 or above on desktop using default Lighthouse simulated throttling settings
4. WHILE the Portfolio_App is accessed on a mobile device, THE Portfolio_App SHALL render a layout with no horizontal scrollbar, no content overflow beyond viewport width, and all interactive elements meeting a minimum tap target of 44x44px for viewport widths from 320px to 768px
5. WHILE the Portfolio_App is accessed on a device without a dedicated GPU, THE Portfolio_App SHALL reduce particle counts and disable background 3D animations and decorative particle effects to maintain a minimum of 30 FPS measured over any continuous 5-second window
6. THE Portfolio_App SHALL use code splitting to ensure the initial bundle size does not exceed 200KB gzipped
7. IF GPU capability detection fails, THEN THE Portfolio_App SHALL default to the reduced-performance mode defined in criterion 5

### Requirement 16: Visual Theme and Design System

**User Story:** As a visitor, I want a consistent futuristic visual theme throughout the site, so that the experience feels cohesive and polished.

#### Acceptance Criteria

1. THE Portfolio_App SHALL use Electric Blue (#00F5FF) as the primary color, Neon Purple (#8B5CF6) as the secondary color, and Deep Space Black (#050505) as the background color across all sections
2. THE Portfolio_App SHALL apply Glassmorphism_Panel styling to all card and panel elements with a backdrop blur of 12px, border opacity of 15%, and gradient overlays at 10% opacity
3. THE Portfolio_App SHALL render all text using the Inter typeface with weight 700 for headings, weight 600 for subheadings, and weight 400 for body text
4. WHEN the visitor hovers over or focuses on an interactive element, THE Portfolio_App SHALL apply a glow effect using Theme_Colors with a box-shadow spread of 6px and opacity of 60%
5. THE Portfolio_App SHALL maintain a dark theme throughout with no light mode variant
6. THE Portfolio_App SHALL maintain a minimum text contrast ratio of 4.5:1 for body text and 3:1 for large text (18px or above) against all background surfaces

### Requirement 17: Sound Architecture Readiness

**User Story:** As a developer, I want the portfolio to have a sound-ready architecture, so that spatial audio can be integrated in the future without refactoring.

#### Acceptance Criteria

1. WHEN the visitor performs a first interaction (click, tap, or keypress), THE Portfolio_App SHALL initialize a Web Audio API audio context and transition it to a running state
2. THE Portfolio_App SHALL render a global mute/unmute toggle in a fixed position visible across all sections without overlapping primary content
3. WHEN the Portfolio_App loads initially, THE Portfolio_App SHALL set the audio state to muted and persist the visitor's mute/unmute preference in local storage for subsequent visits
4. IF the audio context fails to initialize due to browser restrictions or unsupported environments, THEN THE Portfolio_App SHALL hide the mute/unmute toggle and continue operating without audio functionality
