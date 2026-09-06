import React from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2046.module.css';

interface Era2046Props {
  data: CVData;
}

export const Era2046: React.FC<Era2046Props> = ({ data }) => {
  return (
    <section id="era-2046" className={styles.discontinuedContainer} aria-label="2046 Era">
      <div className={styles.innerWrapper}>
        <h1 className={styles.cinematicTitle}>
          Connecting to {data.cv.name}&apos;s consciousness via web browser was discontinued in 2041.
        </h1>
        <div className={styles.cinematicSub}>
          Your current device only supports visual browsing.
        </div>
        <div className={styles.cinematicCode}>
          ERR_NEURAL_ID_REQUIRED · SESSION 0xA93F · DISCONTINUED
        </div>
      </div>

      <footer className={styles.disclaimerFooter}>
        By accessing this site your biological data may be used to improve personalization, optimize compliance and generate future versions of you without additional consent.
        <br />
        <span style={{ fontSize: '10px', display: 'block', marginTop: '8px', color: '#94a3b8' }}>
          © 2046 {data.cv.name}. All Rights Reserved.
        </span>
      </footer>
    </section>
  );
};
