import { getCurrentMoonPhase, getMoonIllumination } from './moonPhase.jsx';

// Generate favicon SVG based on moon phase
function generateFaviconSVG(illumination) {
  const radius = 10; // Increased radius for larger moon
  const centerX = 16;
  const centerY = 16;
  const containerSize = 32;
  const cornerRadius = 6;
  
  if (illumination === 0) {
    // New Moon - just the outline
    return `<svg width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${containerSize}" height="${containerSize}" rx="${cornerRadius}" fill="#222222"/>
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#212121" stroke="#9D988E" stroke-width="1"/>
    </svg>`;
  } else if (illumination === 100) {
    // Full Moon - completely filled
    return `<svg width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${containerSize}" height="${containerSize}" rx="${cornerRadius}" fill="#222222"/>
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#9D988E"/>
    </svg>`;
  } else {
    // Partial illumination - use dark shadow overlay
    const progress = illumination / 100;
    
    // Calculate shadow position diagonally
    const shadowX = centerX + (radius * 3 * (0.5 - progress));
    const shadowY = centerY + (radius * 3 * (0.5 - progress));
    
    return `<svg width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="moonClip">
          <rect width="${containerSize}" height="${containerSize}" rx="${cornerRadius}"/>
        </clipPath>
      </defs>
      <rect width="${containerSize}" height="${containerSize}" rx="${cornerRadius}" fill="#222222"/>
      <g clip-path="url(#moonClip)">
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#9D988E"/>
        <circle cx="${shadowX}" cy="${shadowY}" r="${radius}" fill="#222222"/>
      </g>
    </svg>`;
  }
}

// Update favicon
function updateFavicon() {
  const illumination = getMoonIllumination();
  const svgString = generateFaviconSVG(illumination);
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
