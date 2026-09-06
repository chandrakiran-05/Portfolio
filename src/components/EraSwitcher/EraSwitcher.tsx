import React, { useState } from 'react';
import styles from './EraSwitcher.module.css';
import { Clock, Volume2, VolumeX, Layers, Layout } from 'lucide-react';

export type Era = '1996' | '2006' | '2016' | '2026';
export type ViewMode = 'page' | 'continuous';

interface EraSwitcherProps {
  activeEra: Era;
  viewMode: ViewMode;
  onSelectEra: (era: Era) => void;
  onToggleViewMode: () => void;
}

export const EraSwitcher: React.FC<EraSwitcherProps> = ({
  activeEra,
  viewMode,
  onSelectEra,
  onToggleViewMode
}) => {
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    setMuted(!muted);
  };

  const getClassForEra = (era: Era) => {
    if (activeEra !== era) return styles.eraBtn;
    switch (era) {
      case '1996':
        return `${styles.eraBtn} ${styles.active1996}`;
      case '2006':
        return `${styles.eraBtn} ${styles.active2006}`;
      case '2016':
        return `${styles.eraBtn} ${styles.active2016}`;
      case '2026':
        return `${styles.eraBtn} ${styles.active2026}`;
    }
  };

  return (
    <div className={styles.switcherContainer} aria-label="Time Machine Era Selector">
      <div className={styles.switcherLabel}>
        <Clock size={14} /> Time Machine
      </div>

      <button
        className={styles.modeToggleBtn}
        onClick={onToggleViewMode}
        title={viewMode === 'page' ? 'Switch to Continuous Timeline View' : 'Switch to Multi-Page View'}
      >
        {viewMode === 'page' ? (
          <>
            <Layout size={12} /> Page View
          </>
        ) : (
          <>
            <Layers size={12} /> Timeline View
          </>
        )}
      </button>

      <div className={styles.eraButtons}>
        <button
          className={getClassForEra('1996')}
          onClick={() => onSelectEra('1996')}
          title="1996 GeoCities Era"
        >
          1996
        </button>
        <button
          className={getClassForEra('2006')}
          onClick={() => onSelectEra('2006')}
          title="2006 Web 2.0 Era"
        >
          2006
        </button>
        <button
          className={getClassForEra('2016')}
          onClick={() => onSelectEra('2016')}
          title="2016 Modern Era"
        >
          2016
        </button>
        <button
          className={getClassForEra('2026')}
          onClick={() => onSelectEra('2026')}
          title="2026+ AI OS Era"
        >
          2026+
        </button>
      </div>

      <button
        className={`${styles.audioBtn} ${!muted ? styles.audioActive : ''}`}
        onClick={toggleSound}
        title={muted ? 'Enable Retro Audio Indicators (Muted)' : 'Sound On'}
        aria-label="Toggle Sound Effects"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
};
