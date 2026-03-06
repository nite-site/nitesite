import React, { useState, useEffect, useRef } from 'react';
import { useWebHaptics } from 'web-haptics/react';
import { getCurrentMoonPhase, getMoonPhaseSVG, getMoonIllumination } from './moonPhase.jsx';
import DatePicker from './DatePicker.jsx';
import './App.css';

function App() {
  const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
  // Initialize with a valid date within our data range (Jan 1, 2026 - Jan 31, 2027)
  const getValidInitialDate = () => {
    const today = new Date();
    const dataStartDate = new Date('2026-01-01');
    const dataEndDate = new Date('2027-01-31');
    
    // If today is within range, use it; otherwise use the start date
    if (today >= dataStartDate && today <= dataEndDate) {
      return today;
    }
    return dataStartDate;
  };
  
  const [selectedDate, setSelectedDate] = useState(getValidInitialDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const datePickerRef = useRef(null);
  
  const currentPhase = getCurrentMoonPhase(selectedDate);
  const illumination = getMoonIllumination(selectedDate);
  const moonIcon = getMoonPhaseSVG(currentPhase, illumination, selectedDate);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleDatePicker = (event) => {
    if (showDatePicker) {
      event?.preventDefault?.(); // Prevent delayed click on touch devices from re-opening
      trigger([
        { duration: 40 },
        { delay: 100, duration: 30 },
      ], { intensity: 1 });
      // Start closing animation
      setIsClosing(true);
      setTimeout(() => {
        setShowDatePicker(false);
        setIsClosing(false);
      }, 300); // Match CSS animation duration
    } else {
      trigger([
        { duration: 30 },
        { delay: 60, duration: 40 },
      ], { intensity: 1 });
      setShowDatePicker(true);
    }
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        !event.target.closest('.moon-icon')
      ) {
        trigger([
          { duration: 40 },
          { delay: 100, duration: 30 },
        ], { intensity: 1 });
        // Start closing animation
        setIsClosing(true);
        setTimeout(() => {
          setShowDatePicker(false);
          setIsClosing(false);
        }, 300); // Match CSS animation duration
      }
    };

    if (showDatePicker) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [showDatePicker, trigger]);

  return (
    <div className="app">
      {showDatePicker && <DatePicker ref={datePickerRef} onDateChange={handleDateChange} initialDate={selectedDate} isClosing={isClosing} hapticTrigger={trigger} />}
      <div className="content">
        <div className="moon-icon" onPointerDown={(e) => toggleDatePicker(e)}>
          {moonIcon}
        </div>
        <div className="text-content">
          <p className="main-text">Delightful digital experiences.</p>
          <p className="main-text">Designed after hours.</p>
        </div>
        <div className="footer">
          <p><span>© {new Date().getFullYear()}</span>  Nite Site <span>ltd.</span></p>
        </div>
      </div>
    </div>
  );
}

export default App;
