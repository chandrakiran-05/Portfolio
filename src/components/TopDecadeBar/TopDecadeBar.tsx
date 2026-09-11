import React, { useState, useEffect, useRef } from 'react';
import styles from './TopDecadeBar.module.css';

export type Era = '1986' | '1996' | '2016' | '2026' | '2036' | '2046';

interface TopDecadeBarProps {
  activeEra: Era;
  onSelectEra: (era: Era) => void;
}

export const TopDecadeBar: React.FC<TopDecadeBarProps> = ({ activeEra, onSelectEra }) => {
  const [isVisible, setIsVisible] = useState(true);
  const eras: Era[] = ['1986', '1996', '2016', '2026', '2036', '2046'];
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const startTimer = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isHovered.current) {
          setIsVisible(false);
        }
      }, 2500);
    };

    // Store it on the window object or a ref so we can call it from onMouseLeave
    (window as any).__startTopBarTimer = startTimer;

    startTimer();

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80 || isHovered.current) {
        setIsVisible(true);
        startTimer();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const getEraClass = (era: Era) => {
    const base = styles.yearButton;
    if (activeEra !== era) return base;
    const activeMap: Record<Era, string> = {
      '1986': styles.active1986,
      '1996': styles.active1996,
      '2016': styles.active2016,
      '2026': styles.active2026,
      '2036': styles.active2036,
      '2046': styles.active2046,
    };
    return `${base} ${activeMap[era]}`;
  };

  return (
    <nav
      ref={barRef}
      className={`${styles.topBarWrapper} ${isVisible ? styles.visible : styles.hidden}`}
      aria-label="Top Decade Time Machine Selector"
      onMouseEnter={() => {
        isHovered.current = true;
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        isHovered.current = false;
        if ((window as any).__startTopBarTimer) {
          (window as any).__startTopBarTimer();
        }
      }}
    >
      <div className={styles.peekTab}>TIMEBAR ▼</div>
      {eras.map((era, idx) => (
        <React.Fragment key={era}>
          <button
            className={getEraClass(era)}
            onClick={() => onSelectEra(era)}
            title={`Jump to ${era} Era`}
            aria-pressed={activeEra === era}
          >
            {era}
          </button>
          {idx < eras.length - 1 && <div className={styles.separator} />}
        </React.Fragment>
      ))}
    </nav>
  );
};
