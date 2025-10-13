import { getPhaseName, getMoonPhaseProgress } from './moonPhase.jsx';

// Generate favicon SVG based on moon phase progress (matching main visual)
function generateFaviconSVG(progress) {
  const radius = 10;
  const centerX = 16;
  const centerY = 16;
  const containerSize = 32;
  const cornerRadius = 6;
  
  // Calculate shadow position using same logic as main moon visual
  let shadowX, shadowY;
  if (progress <= 50) {
    const normalizedProgress = progress / 50;
    shadowX = centerX - radius * 1.3 + (radius * 1.3 * normalizedProgress);
    shadowY = centerY - radius * 1.3 + (radius * 1.3 * normalizedProgress);
  } else {
    const normalizedProgress = (progress - 50) / 50;
    shadowX = centerX + (radius * 1.7 * normalizedProgress);
    shadowY = centerY + (radius * 1.7 * normalizedProgress);
  }
  
  const shadowRadius = radius;
  
  return `<svg width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${containerSize}" height="${containerSize}" rx="${cornerRadius}" fill="#222222"/>
    <!-- Full light moon circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#9D988E" stroke="#9D988E" stroke-width="1"/>
    <!-- Dark shadow overlay -->
    <circle cx="${shadowX}" cy="${shadowY}" r="${shadowRadius}" fill="#222222"/>
  </svg>`;
}

// Update favicon
function updateFavicon() {
  const progress = getMoonPhaseProgress();
  const svgString = generateFaviconSVG(progress);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Remove existing favicon
  const existingFavicon = document.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    existingFavicon.remove();
  }
  
  // Create new favicon
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = svgUrl;
  document.head.appendChild(favicon);
}

// Initialize favicon when DOM is loaded
export function initFavicon() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFavicon);
  } else {
    updateFavicon();
  }
}
