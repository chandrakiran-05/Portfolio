import React from 'react';
import styles from './TimeWarpEffect.module.css';

interface TimeWarpEffectProps {
  targetEra: string;
}

export const TimeWarpEffect: React.FC<TimeWarpEffectProps> = ({ targetEra }) => {
  return (
    <div className={styles.timeWarpOverlay}>
      <div className={styles.scanline} />
      <div className={styles.warpText}>
        ⚡ WARPING TO ERA {targetEra}... ⚡
      </div>
    </div>
  );
};
