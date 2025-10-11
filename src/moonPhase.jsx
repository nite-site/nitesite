import phaseProgressData from '../phase-progress.json';

// Utility function to format date as YYYY-MM-DD string
export function formatDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get moon phase name for a given date
export function getPhaseName(date) {
  const dateString = formatDateString(date);
  const dayData = phaseProgressData.dailyProgress.find(day => day.date === dateString);
  return dayData ? dayData.phase : 'Unknown';
}

// Get moon phase progress percentage for a given date
export function getMoonPhaseProgress(date = null) {
  const now = date || new Date();
  const dateString = formatDateString(now);
  
  // Find the progress for the given date
  const dayData = phaseProgressData.dailyProgress.find(day => day.date === dateString);
  
  if (dayData) {
    return dayData.progress;
  }
  
  // Simple fallback: return 0 if date not found in our data range
  return 0;
}

export function getCurrentMoonPhase(date = null) {
  const progress = getMoonPhaseProgress(date);
  
  // Map progress to phase names based on new mapping
  if (progress === 0) return 'Full Moon';
  if (progress === 25) return 'Last Quarter';
  if (progress === 50) return 'New Moon';
  if (progress === 75) return 'First Quarter';
  
  // For interpolated values, determine closest phase
  if (progress < 12.5) return 'Full Moon';
  if (progress < 37.5) return 'Last Quarter';
  if (progress < 62.5) return 'New Moon';
  if (progress < 87.5) return 'First Quarter';
  return 'Full Moon';
}

export function getMoonIllumination(date = null) {
  const progress = getMoonPhaseProgress(date);
  
  // Convert progress to illumination percentage
  // 0% progress = Full Moon = 100% illumination
  // 25% progress = Last Quarter = 50% illumination  
  // 50% progress = New Moon = 0% illumination
  // 75% progress = First Quarter = 50% illumination
  // 100% progress = Full Moon = 100% illumination
  
  // Use sine wave for smooth illumination curve
  const radians = (progress / 100) * 2 * Math.PI;
  const illumination = Math.round(50 + 50 * Math.cos(radians));
  
  return Math.max(0, Math.min(100, illumination));
}


export function getMoonPhaseSVG(phase, illumination = null, date = null) {
  // Get the progress percentage for accurate shadow positioning
  const progress = getMoonPhaseProgress(date);
  
  // Create dynamic SVG based on progress percentage
  const createMoonSVG = (progress) => {
    const radius = 25;
    const centerX = 30;
    const centerY = 30;
    
    // Map progress to shadow position
    // 0% progress = Full Moon = no shadow (shadow completely outside)
    // 25% progress = Third Quarter = shadow partially covering from top-left
    // 50% progress = New Moon = shadow centered (completely covering)
    // 75% progress = First Quarter = shadow partially covering from bottom-right
    // 100% progress = Full Moon = no shadow (shadow completely outside)
    
    // Calculate shadow position diagonally from top-left to bottom-right
    // Progress 0-50%: shadow moves from top-left edge to center
    // Progress 50-100%: shadow moves from center to bottom-right edge
    
    let shadowX, shadowY;
    
    if (progress <= 50) {
      // From Full Moon (0%) to New Moon (50%)
      // Shadow moves from slightly outside top-left to center
      const normalizedProgress = progress / 50; // 0 to 1
      // Start at 1.5x radius outside (slight shadow visible) to center
      shadowX = centerX - radius * 1.6 + (radius * 1.6 * normalizedProgress);
      shadowY = centerY - radius * 1.6 + (radius * 1.6 * normalizedProgress);
    } else {
      // From New Moon (50%) to Full Moon (100%)
      // Shadow moves from center to outside bottom-right
      const normalizedProgress = (progress - 50) / 50; // 0 to 1
      // End at 1.7x radius outside (balanced shadow disappearance)
      shadowX = centerX + (radius * 1.6 * normalizedProgress);
      shadowY = centerY + (radius * 1.6 * normalizedProgress);
    }
    
    const shadowRadius = radius; // Always same size as moon
    
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Full light moon circle */}
        <circle cx={centerX} cy={centerY} r={radius} fill="#9D988E" stroke="#9D988E" strokeWidth="2"/>
        {/* Dark shadow overlay - same size as moon */}
        <circle 
          cx={shadowX} 
          cy={shadowY} 
          r={shadowRadius} 
          fill="#222222"
          className="moon-shadow"
        />
      </svg>
    );
  };
  
  return createMoonSVG(progress);
}

