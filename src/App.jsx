import React, { useState, useEffect, useRef } from 'react';
import { getCurrentMoonPhase, getMoonPhaseSVG, getMoonIllumination } from './moonPhase.jsx';
import DatePicker from './DatePicker.jsx';
import './App.css';

function App() {
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

  const toggleDatePicker = () => {
    if (showDatePicker) {
      // Start closing animation
      setIsClosing(true);
      setTimeout(() => {
        setShowDatePicker(false);
        setIsClosing(false);
      }, 300); // Match CSS animation duration
    } else {
      setShowDatePicker(true);
    }
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        // Start closing animation
        setIsClosing(true);
        setTimeout(() => {
          setShowDatePicker(false);
          setIsClosing(false);
        }, 300); // Match CSS animation duration
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div className="app">
      {showDatePicker && <DatePicker ref={datePickerRef} onDateChange={handleDateChange} initialDate={selectedDate} isClosing={isClosing} />}
      <div className="content">
        <div className="moon-icon" onClick={toggleDatePicker}>
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
