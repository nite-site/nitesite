import React, { useState, useEffect } from 'react';
import phasesData from '../phases.json';

export function getCurrentMoonPhase(date = null) {
  const now = date || new Date();
  const events = phasesData.events;
  
  // Find the most recent moon phase event
  for (let i = events.length - 1; i >= 0; i--) {
    const eventDate = new Date(events[i].datetime_local);
    if (eventDate <= now) {
      return events[i].phase;
    }
  }
  
  // Fallback to first event if we're before all events
  return events[0].phase;
}

export function getMoonIllumination(date = null) {
  const now = date || new Date();
  const events = phasesData.events;
  
  // Find the current phase and next phase
  let currentPhase = null;
  let nextPhase = null;
  let currentPhaseDate = null;
  let nextPhaseDate = null;
  
  for (let i = events.length - 1; i >= 0; i--) {
    const eventDate = new Date(events[i].datetime_local);
    if (eventDate <= now) {
      currentPhase = events[i].phase;
      currentPhaseDate = eventDate;
      if (i < events.length - 1) {
        nextPhase = events[i + 1].phase;
        nextPhaseDate = new Date(events[i + 1].datetime_local);
      }
      break;
    }
  }
  
  // If we're before all events, use the first two
  if (!currentPhase) {
    currentPhase = events[0].phase;
    currentPhaseDate = new Date(events[0].datetime_local);
    if (events.length > 1) {
      nextPhase = events[1].phase;
      nextPhaseDate = new Date(events[1].datetime_local);
    }
  }
  
  // Calculate illumination percentage based on phase progression
  let baseIllumination = 0;
  let targetIllumination = 0;
  
  // Map phases to illumination percentages
  const phaseIllumination = {
    'New Moon': 0,
    'First Quarter': 50,
    'Full Moon': 100,
    'Third Quarter': 50
  };
  
  baseIllumination = phaseIllumination[currentPhase];
  
  if (nextPhase && nextPhaseDate) {
    targetIllumination = phaseIllumination[nextPhase];
    
    // Calculate time progression between phases
    const totalDuration = nextPhaseDate - currentPhaseDate;
    const elapsed = now - currentPhaseDate;
    const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
    
    // Interpolate between phases
    const illumination = baseIllumination + (targetIllumination - baseIllumination) * progress;
    return Math.round(illumination);
  }
  
  return baseIllumination;
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
  // If no illumination provided, get it
  if (illumination === null) {
    illumination = getMoonIllumination(date);
  }
  
  // Create dynamic SVG based on illumination percentage
  const createMoonSVG = (illumination) => {
    const radius = 25;
    const centerX = 30;
    const centerY = 30;
    
    if (illumination === 0) {
      // New Moon - just the outline
      return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx={centerX} cy={centerY} r={radius} fill="#222222" stroke="#9D988E" strokeWidth="2"/>
        </svg>
      );
    } else if (illumination === 100) {
      // Full Moon - completely illuminated
      return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx={centerX} cy={centerY} r={radius} fill="#9D988E" stroke="#9D988E" strokeWidth="2"/>
        </svg>
      );
    } else {
      // Partial illumination - use dark shadow overlay
      // Shadow moves diagonally from top-left (-100%, -100%) to bottom-right (100%, 100%)
      // 0% illumination = shadow at center (0%, 0%) = new moon
      // 50% illumination = shadow at (50%, 50%) = first quarter
      // 100% illumination = shadow at (-100%, -100%) = full moon
      
      const progress = illumination / 100; // 0 to 1
      
      // Calculate shadow position diagonally
      // At 0% illumination: shadow at center (0%, 0%) = new moon
      // At 100% illumination: shadow completely outside moon bounds = full moon
      // We need to map this so that:
      // - 0% illumination = shadow at center (0%, 0%) = new moon
      // - 100% illumination = shadow at (-radius*2, -radius*2) = full moon (completely outside)
      const shadowX = centerX + (radius * 3 * (0.5 - progress));
      const shadowY = centerY + (radius * 3 * (0.5 - progress));
      const shadowRadius = radius; // Always same size as moon
      
      return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Full light moon circle */}
          <circle cx={centerX} cy={centerY} r={radius} fill="#9D988E" stroke="#9D988E" strokeWidth="2"/>
          {/* Dark shadow overlay - same size as moon with animation */}
          <circle 
            cx={shadowX} 
            cy={shadowY} 
            r={shadowRadius} 
            fill="#222222"
            className="moon-shadow"
          />
        </svg>
      );
    }
  };
  
  return createMoonSVG(illumination);
}
