import React, { useState, useEffect, useRef, forwardRef } from 'react';
import './DatePicker.css';

const DatePicker = forwardRef(({ onDateChange, initialDate = new Date(), isClosing = false }, ref) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dates, setDates] = useState([]);
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false);
  const containerRef = useRef(null);

  // Generate dates for the picker (6 months before and after current date)
  useEffect(() => {
    const generateDates = () => {
      const dateList = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dateList.push(date);
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
    const todayIndex = dates.findIndex(date => 
      date.toDateString() === today.toDateString()
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
        
        // Also select today's date (without triggering another scroll)
        setSelectedDate(today);
        onDateChange(today);
      }
    }
  };

  return (
    <div className={`date-picker ${isClosing ? 'closing' : ''}`} ref={ref}>
      <div className="date-picker-header">
        <h3>Select Date</h3>
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
