/**
 * Pure computation utilities extracted from components to enable
 * both unit testing and React Fast Refresh compatibility.
 */

// ============================================================
// CursorEffects - Magnetic Pull (dot cursor)
// ============================================================

export function computeMagneticPull(
  cursorX: number,
  cursorY: number,
  elementCenterX: number,
  elementCenterY: number
): { translateX: number; translateY: number } {
  const dx = cursorX - elementCenterX;
  const dy = cursorY - elementCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 50) return { translateX: 0, translateY: 0 };

  const strength = (1 - distance / 50) * 8;
  const angle = Math.atan2(dy, dx);
  return { translateX: Math.cos(angle) * strength, translateY: Math.sin(angle) * strength };
}

// ============================================================
// ContactPortal - Magnetic Pull (button)
// ============================================================

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX_TRANSLATION = 16;

export function computeContactMagneticPull(
  cursorX: number,
  cursorY: number,
  elementCenterX: number,
  elementCenterY: number
): { x: number; y: number } {
  const dx = cursorX - elementCenterX;
  const dy = cursorY - elementCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > MAGNETIC_RADIUS || distance === 0) return { x: 0, y: 0 };
  const strength = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_MAX_TRANSLATION;
  const angle = Math.atan2(dy, dx);
  return { x: Math.cos(angle) * strength, y: Math.sin(angle) * strength };
}

// ============================================================
// ExperienceTimeline - Illumination
// ============================================================

export function computeTimelineIllumination(
  nodePositions: number[],
  scrollPosition: number,
  viewportHeight: number
): { illuminated: boolean[]; progressFill: number } {
  const totalNodes = nodePositions.length;
  if (totalNodes === 0) return { illuminated: [], progressFill: 0 };
  const threshold = scrollPosition + viewportHeight * 0.6;
  const illuminated = nodePositions.map((pos) => pos < threshold);
  const illuminatedCount = illuminated.filter(Boolean).length;
  return { illuminated, progressFill: illuminatedCount / totalNodes };
}

// ============================================================
// AILaboratory - Counter Animation
// ============================================================

function easeOutCubic(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 3);
}

export function computeCounterValue(
  targetValue: number,
  elapsedMs: number,
  durationMs: number
): number {
  if (targetValue < 0) return 0;
  if (durationMs <= 0) return targetValue;
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= durationMs) return targetValue;

  const progress = elapsedMs / durationMs;
  const easedProgress = easeOutCubic(progress);
  return Math.round(easedProgress * targetValue);
}

// ============================================================
// IntroLoader - Loading Progress
// ============================================================

export function computeLoadingProgress(rawProgress: number, previousProgress: number): number {
  return Math.max(Math.min(100, rawProgress), previousProgress);
}

// ============================================================
// ProjectUniverse - Card Tilt
// ============================================================

export function computeTilt(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }) {
  if (rect.width <= 0 || rect.height <= 0) {
    return { rotateX: 0, rotateY: 0, lightX: 50, lightY: 50 };
  }

  const x = clientX - rect.left, y = clientY - rect.top;
  const normalizedX = (x - rect.width / 2) / (rect.width / 2);
  const normalizedY = (y - rect.height / 2) / (rect.height / 2);

  const maxTilt = 15;
  const rotateY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));
  const rotateX = Math.max(-maxTilt, Math.min(maxTilt, -normalizedY * maxTilt));

  // Light position as percentage (0-100), clamped
  const lightX = Math.max(0, Math.min(100, (x / rect.width) * 100));
  const lightY = Math.max(0, Math.min(100, (y / rect.height) * 100));

  return { rotateX, rotateY, lightX, lightY };
}

// ============================================================
// AboutSection - Card Tilt
// ============================================================

export function computeCardTilt(
  cursorX: number,
  cursorY: number,
  cardWidth: number,
  cardHeight: number
): { tiltX: number; tiltY: number } {
  if (cardWidth <= 0 || cardHeight <= 0) return { tiltX: 0, tiltY: 0 };

  const normalizedX = (cursorX - cardWidth / 2) / (cardWidth / 2);
  const normalizedY = (cursorY - cardHeight / 2) / (cardHeight / 2);

  const maxTilt = 15;
  const tiltY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));
  const tiltX = Math.max(-maxTilt, Math.min(maxTilt, -normalizedY * maxTilt));

  return { tiltX, tiltY };
}
