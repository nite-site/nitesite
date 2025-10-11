import React, { useState, useEffect } from 'react';
import phaseProgressData from '../phase-progress.json';

// Get moon phase progress percentage for a given date
export function getMoonPhaseProgress(date = null) {
  const now = date || new Date();
  // Use local date format to match our JSON data (avoiding timezone issues)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD format
  
  // Find the progress for the given date
  const dayData = phaseProgressData.dailyProgress.find(day => day.date === dateString);
  
  if (dayData) {
    return dayData.progress;
  }
  
  // Fallback: interpolate between available dates if exact date not found
  const sortedDays = phaseProgressData.dailyProgress.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // If before all dates, return first progress
  if (now < new Date(sortedDays[0].date)) {
    return sortedDays[0].progress;
  }
  
  // If after all dates, return last progress
  if (now > new Date(sortedDays[sortedDays.length - 1].date)) {
    return sortedDays[sortedDays.length - 1].progress;
  }
  
  // Find the two closest dates and interpolate
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const currentDate = new Date(sortedDays[i].date);
    const nextDate = new Date(sortedDays[i + 1].date);
    
    if (now >= currentDate && now <= nextDate) {
      const timeDiff = nextDate - currentDate;
      const elapsed = now - currentDate;
      const progress = elapsed / timeDiff;
      
      const currentProgress = sortedDays[i].progress;
      const nextProgress = sortedDays[i + 1].progress;
      
      return currentProgress + (nextProgress - currentProgress) * progress;
    }
  }
  
  // Fallback to 0 if nothing found
  return 0;
}

export function getCurrentMoonPhase(date = null) {
  const progress = getMoonPhaseProgress(date);
  
  // Map progress to phase names based on new mapping
  if (progress === 0) return 'Full Moon';
  if (progress === 25) return 'Third Quarter';
  if (progress === 50) return 'New Moon';
  if (progress === 75) return 'First Quarter';
  
  // For interpolated values, determine closest phase
  if (progress < 12.5) return 'Full Moon';
  if (progress < 37.5) return 'Third Quarter';
  if (progress < 62.5) return 'New Moon';
  if (progress < 87.5) return 'First Quarter';
  return 'Full Moon';
}

export function getMoonIllumination(date = null) {
  const progress = getMoonPhaseProgress(date);
  
  // Convert progress to illumination percentage
  // 0% progress = Full Moon = 100% illumination
  // 25% progress = Third Quarter = 50% illumination  
  // 50% progress = New Moon = 0% illumination
  // 75% progress = First Quarter = 50% illumination
  // 100% progress = Full Moon = 100% illumination
  
  if (progress <= 25) {
    // From Full Moon (0%) to Third Quarter (25%)
    return Math.round(100 - (progress / 25) * 50);
  } else if (progress <= 50) {
    // From Third Quarter (25%) to New Moon (50%)
    return Math.round(50 - ((progress - 25) / 25) * 50);
  } else if (progress <= 75) {
    // From New Moon (50%) to First Quarter (75%)
    return Math.round(((progress - 50) / 25) * 50);
  } else {
    // From First Quarter (75%) to Full Moon (100%)
    return Math.round(50 + ((progress - 75) / 25) * 50);
  }
}

export function getMoonPhaseIcon(phase) {
  const icons = {
    'New Moon': '🌑',
    'First Quarter': '🌓',
    'Full Moon': '🌕',
    'Third Quarter': '🌗'
  };
  
  return icons[phase] || '🌑';
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

