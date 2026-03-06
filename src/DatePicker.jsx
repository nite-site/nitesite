import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { getPhaseName } from './moonPhase.jsx';
import './DatePicker.css';

const DatePicker = forwardRef(({ onDateChange, initialDate = new Date(), isClosing = false, hapticTrigger }, ref) => {
  // Ensure initial date is within our data range (Jan 1, 2026 - Jan 31, 2027)
  const dataStartDate = new Date('2026-01-01');
  const dataEndDate = new Date('2027-01-31');
  
  const getValidInitialDate = (date) => {
    return date < dataStartDate ? dataStartDate : date > dataEndDate ? dataEndDate : date;
  };
  
  const [selectedDate, setSelectedDate] = useState(getValidInitialDate(initialDate));
  const [dates, setDates] = useState([]);
  const containerRef = useRef(null);
  const lastCenteredIndexRef = useRef(-1);
  const isReadyRef = useRef(false);

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

  // Mount-only: scroll to initial date (instant), set lastCenteredIndexRef, gate haptics with isReadyRef
  useEffect(() => {
    if (dates.length === 0 || !containerRef.current) return;
    const selectedIndex = dates.findIndex(date =>
      date.toDateString() === getValidInitialDate(initialDate).toDateString()
    );
    if (selectedIndex === -1) return;

    const container = containerRef.current;
    const item = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (item) {
      const containerWidth = container.offsetWidth;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);

      container.scrollTo({ left: scrollLeft, behavior: 'auto' });
      lastCenteredIndexRef.current = selectedIndex;

      setTimeout(() => {
        isReadyRef.current = true;
      }, 300);
    }
  }, [dates]); // initialDate used only for mount scroll target; omit to prevent re-scroll when parent updates

  const getCenteredIndex = (container) => {
    const centerX = container.scrollLeft + container.offsetWidth / 2;
    const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft);
    const isMobile = window.innerWidth <= 768;
    const itemWidth = isMobile ? 50 : 60;
    const gap = isMobile ? 4 : 8;
    const index = Math.round((centerX - paddingLeft) / (itemWidth + gap));
    return Math.max(0, Math.min(index, dates.length - 1));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || dates.length === 0) return;

    let rafId = null;
    let debounceTimeout = null;
    const supportsScrollEnd = 'onscrollend' in window;

    const handleScrollSettle = () => {
      const index = getCenteredIndex(container);
      if (index >= 0 && index < dates.length) {
        setSelectedDate(dates[index]);
        onDateChange(dates[index]);
      }
    };

    const handleScroll = () => {
      if (!isReadyRef.current) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const index = getCenteredIndex(container);
        if (index !== lastCenteredIndexRef.current) {
          lastCenteredIndexRef.current = index;
          setSelectedDate(dates[index]);
          onDateChange(dates[index]);
        }
        if (!supportsScrollEnd) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(handleScrollSettle, 250);
        }
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    if (supportsScrollEnd) {
      container.addEventListener('scrollend', handleScrollSettle);
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scrollend', handleScrollSettle);
      if (rafId) cancelAnimationFrame(rafId);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [dates, onDateChange, hapticTrigger]);

  const handleDateChange = (date) => {
    hapticTrigger?.([{ duration: 25 }], { intensity: 0.7 });
    setSelectedDate(date);
    onDateChange(date);

    const selectedIndex = dates.findIndex(d =>
      d.toDateString() === date.toDateString()
    );
    if (selectedIndex !== -1 && containerRef.current) {
      const item = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const scrollToToday = () => {
    hapticTrigger?.([{ duration: 25 }], { intensity: 0.7 });
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
      <div className="date-picker-container" ref={containerRef}>
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
