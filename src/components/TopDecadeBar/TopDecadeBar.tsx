import React, { useState, useEffect } from 'react';
import styles from './TopDecadeBar.module.css';

export type Era = '1986' | '1996' | '2016' | '2026' | '2036' | '2046';

interface TopDecadeBarProps {
  activeEra: Era;
  onSelectEra: (era: Era) => void;
}

export const TopDecadeBar: React.FC<TopDecadeBarProps> = ({ activeEra, onSelectEra }) => {
  const [isVisible, setIsVisible] = useState(true);
  const eras: Era[] = ['1986', '1996', '2016', '2026', '2036', '2046'];

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Show if cursor is within top 120px of viewport or near top bar
      if (e.clientY < 120) {
        setIsVisible(true);
        startTimer();
      } else {
        // If cursor moves away, start hide timer
        startTimer();
      }
    };

    // Show initially
    setIsVisible(true);
    startTimer();

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getClassForEra = (era: Era) => {
    if (activeEra !== era) return styles.yearButton;
    switch (era) {
      case '1986':
        return `${styles.yearButton} ${styles.active1986}`;
      case '1996':
        return `${styles.yearButton} ${styles.active1996}`;
      case '2016':
        return `${styles.yearButton} ${styles.active2016}`;
      case '2026':
        return `${styles.yearButton} ${styles.active2026}`;
      case '2036':
        return `${styles.yearButton} ${styles.active2036}`;
      case '2046':
        return `${styles.yearButton} ${styles.active2046}`;
    }
  };

  return (
    <nav
      className={`${styles.topBarWrapper} ${isVisible ? styles.visible : styles.hidden}`}
      aria-label="Top Decade Time Machine Selector"
      onMouseEnter={() => setIsVisible(true)}
    >
      {eras.map((era) => (
        <button
          key={era}
          className={getClassForEra(era)}
          onClick={() => onSelectEra(era)}
          title={`Jump to ${era} Era`}
        >
          {era}
        </button>
      ))}
    </nav>
  );
};
