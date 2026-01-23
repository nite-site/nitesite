import React, { useState, useEffect, useRef, forwardRef } from 'react';
import phaseProgressData from '../phase-progress.json';
import { getPhaseName } from './moonPhase.jsx';
import './DatePicker.css';

const DatePicker = forwardRef(({ onDateChange, initialDate = new Date(), isClosing = false }, ref) => {
  // Ensure initial date is within our data range (Jan 1, 2026 - Jan 31, 2027)
  const dataStartDate = new Date('2026-01-01');
  const dataEndDate = new Date('2027-01-31');
  
  const getValidInitialDate = (date) => {
    return date < dataStartDate ? dataStartDate : date > dataEndDate ? dataEndDate : date;
  };
  
  const [selectedDate, setSelectedDate] = useState(getValidInitialDate(initialDate));
  const [dates, setDates] = useState([]);
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false);
  const containerRef = useRef(null);

  // Generate dates for the picker (within our phase-progress.json data range)
  useEffect(() => {
    const generateDates = () => {
      const dateList = [];
      // Our data covers January 1, 2026 to January 31, 2027
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2027-01-31');
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dateList.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setDates(dateList);
    };
    
    generateDates();
  }, []);

  // Auto-scroll to selected date when component mounts (instant, no animation)
  useEffect(() => {
    if (dates.length > 0 && containerRef.current) {
      const selectedIndex = dates.findIndex(date => 
        date.toDateString() === selectedDate.toDateString()
      );
      
      if (selectedIndex !== -1) {
        const container = containerRef.current;
        const item = container.querySelector(`[data-index="${selectedIndex}"]`);
        if (item) {
          // Center the item in the container (instant scroll)
          const containerWidth = container.offsetWidth;
          const itemLeft = item.offsetLeft;
          const itemWidth = item.offsetWidth;
          const scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);
          
          container.scrollTo({
            left: scrollLeft,
            behavior: 'auto' // Instant scroll, no animation
          });
          
          // Enable smooth scrolling after a short delay
          setTimeout(() => {
            setEnableSmoothScroll(true);
          }, 300); // 300ms delay to allow picker to fully open
        }
      }
    }
  }, [dates, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
    
    // Scroll to center the selected date
    const selectedIndex = dates.findIndex(d => 
      d.toDateString() === date.toDateString()
    );
    
    if (selectedIndex !== -1 && containerRef.current) {
      const container = containerRef.current;
      const item = container.querySelector(`[data-index="${selectedIndex}"]`);
      if (item) {
        // Use scrollIntoView for better smooth scrolling support
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const scrollToToday = () => {
    const today = new Date();
    // If today is outside our data range, use the closest valid date
    const validToday = getValidInitialDate(today);
    
    const todayIndex = dates.findIndex(date => 
      date.toDateString() === validToday.toDateString()
    );
    if (todayIndex !== -1 && containerRef.current) {
      const container = containerRef.current;
      const item = container.querySelector(`[data-index="${todayIndex}"]`);
      if (item) {
        // Use scrollIntoView for better smooth scrolling support
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
        
        // Also select the valid date (without triggering another scroll)
        setSelectedDate(validToday);
        onDateChange(validToday);
      }
    }
  };

  // Get the moon phase for the currently selected date
  const currentPhase = getPhaseName(selectedDate);

  return (
    <div className={`date-picker ${isClosing ? 'closing' : ''}`} ref={ref}>
      <div className="date-picker-header">
        <h3>{currentPhase}</h3>
        <button onClick={scrollToToday} className="today-button">
          Today
        </button>
      </div>
      <div className={`date-picker-container ${enableSmoothScroll ? 'smooth-scroll' : ''}`} ref={containerRef}>
        {dates.map((date, index) => (
          <div
            key={index}
            data-index={index}
            className={`date-item ${selectedDate.toDateString() === date.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateChange(date)}
          >
            <div className="date-day">{date.getDate()}</div>
            <div className="date-month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
            <div className="date-year">{date.getFullYear()}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DatePicker;
