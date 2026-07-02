import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format: "Monday, October 25, 2025"
  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format: "10:45:30 AM"
  const timeString = time.toLocaleTimeString('en-US');

  return (
    <div className="text-right hidden md:block">
      <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none tracking-tight">
        {timeString}
      </div>
      <div className="text-sm font-medium text-teal-600 dark:text-teal-400 mt-1">
        {dateString}
      </div>
    </div>
  );
};

export default Clock;