import React, { useEffect, useRef } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2046.module.css';

interface Era2046Props {
  data: CVData;
}

/** Splits text into spans per word with staggered animation-delay (Apple style) */
const WordReveal: React.FC<{ text: string; baseDelay?: number; className?: string }> = ({
  text,
  baseDelay = 0,
  className = ''
}) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={styles.revealWord}
          style={{ animationDelay: `${baseDelay + i * 65}ms` }}
        >
          {word}
          {i < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </span>
  );
};

export const Era2046: React.FC<Era2046Props> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger animation on mount
    const el = containerRef.current;
    if (el) {
      el.classList.add(styles.animating);
    }
  }, []);

  const name = data.cv.name;

  return (
    <section
      id="era-2046"
      ref={containerRef}
      className={styles.discontinuedContainer}
      aria-label="2046 Era - Consciousness Discontinued"
    >
      <div className={styles.innerWrapper}>

        {/* Error code — top left */}
        <div className={styles.errorCode}>
          <WordReveal text="ERR_NEURAL_ID_REQUIRED · 2046" baseDelay={100} />
        </div>

        {/* Main title — massive, word-by-word Apple reveal */}
        <h1 className={styles.cinematicTitle}>
          <span className={styles.titleLine}>
            <WordReveal text={`Connecting to ${name}'s`} baseDelay={300} />
          </span>
          <span className={styles.titleLine}>
            <WordReveal text="consciousness via web browser" baseDelay={700} />
          </span>
          <span className={styles.titleLine}>
            <WordReveal text="was discontinued in 2041." baseDelay={1200} />
          </span>
        </h1>

        {/* Sub text — fades in as one block after title */}
        <p className={styles.cinematicSub}>
          <WordReveal text="Your current device only supports visual browsing." baseDelay={1900} />
          <span className={styles.cinematicSubSmall}>
            <WordReveal
              text="To continue, enable your Neural ID implant or contact your Musk Industries agent."
              baseDelay={2200}
            />
          </span>
        </p>

        {/* Ghost strikethrough line */}
        <div className={styles.glitchLine}>
          <WordReveal
            text="By accessing this site you acknowledge that consciousness bridging is a registered trademark of Musk Industries Corp."
            baseDelay={3000}
          />
        </div>
      </div>

      {/* Bottom disclaimer */}
      <footer className={styles.disclaimerFooter}>
        <WordReveal
          text="By accessing this site your biological data may be used to improve personalization, optimize compliance and generate future versions of you without additional consent."
          baseDelay={3400}
        />
        <span style={{ display: 'block', marginTop: '6px', color: '#bbb' }}>
          <WordReveal
            text={`© 2046 ${name} · MUSK INDUSTRIES NEURAL PLATFORM v14`}
            baseDelay={3700}
          />
        </span>
      </footer>
    </section>
  );
};
