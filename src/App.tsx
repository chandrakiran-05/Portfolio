import React, { useState, useEffect } from 'react';
import cvJson from './data/cv.json';
import { CVData } from './types/cv';
import { TopDecadeBar, Era } from './components/TopDecadeBar/TopDecadeBar';
import { TimeWarpEffect } from './components/TimeWarp/TimeWarpEffect';
import { Era1986 } from './components/Era1986/Era1986';
import { Era1996 } from './components/Era1996/Era1996';
import { Era2016 } from './components/Era2016/Era2016';
import { Era2026 } from './components/Era2026/Era2026';
import { Era2036 } from './components/Era2036/Era2036';
import { Era2046 } from './components/Era2046/Era2046';
import styles from './App.module.css';

const typedCvData = cvJson as unknown as CVData;

export const App: React.FC = () => {
  const [activeEra, setActiveEra] = useState<Era>('1986');
  const [isWarping, setIsWarping] = useState(false);
  const [warpTargetEra, setWarpTargetEra] = useState<Era>('1986');

  // Sync hash routing on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['1986', '1996', '2016', '2026', '2036', '2046'].includes(hash)) {
      setActiveEra(hash as Era);
    }
  }, []);

  const handleSelectEra = (era: Era) => {
    if (era === activeEra) return;

    setWarpTargetEra(era);
    setIsWarping(true);

    setTimeout(() => {
      setActiveEra(era);
      window.location.hash = era;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);

    setTimeout(() => {
      setIsWarping(false);
    }, 600);
  };

  return (
    <div className={styles.appContainer}>
      {/* Time-Warp CRT Glitch Transition Overlay */}
      {isWarping && <TimeWarpEffect targetEra={warpTargetEra} />}

      {/* Top Middle Fixed Decade Bar */}
      <TopDecadeBar activeEra={activeEra} onSelectEra={handleSelectEra} />

      {/* Single Page Views per Era */}
      <main style={{ width: '100%', minHeight: '100vh' }}>
        {activeEra === '1986' && (
          <Era1986 data={typedCvData} onNextEra={() => handleSelectEra('1996')} />
        )}
        {activeEra === '1996' && <Era1996 data={typedCvData} />}
        {activeEra === '2016' && <Era2016 data={typedCvData} />}
        {activeEra === '2026' && <Era2026 data={typedCvData} />}
        {activeEra === '2036' && <Era2036 data={typedCvData} />}
        {activeEra === '2046' && <Era2046 data={typedCvData} />}
      </main>
    </div>
  );
};

export default App;
