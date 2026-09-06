import React, { useState } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2036.module.css';
import { User, AlertTriangle } from 'lucide-react';

interface Era2036Props {
  data: CVData;
}

export const Era2036: React.FC<Era2036Props> = ({ data }) => {
  const [isPairing, setIsPairing] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [errorModal, setErrorModal] = useState(false);

  const handleStartPairing = () => {
    if (isPairing) return;
    setIsPairing(true);
    setTelemetry([
      "INITIALIZING SPATIAL NEURAL BROADCAST AT 60GHz...",
      `SCANNING COGNITIVE NODES FOR OPERATOR: ${data.cv.name.toUpperCase()}...`
    ]);

    setTimeout(() => {
      setTelemetry(prev => [...prev, "3D NEURAL IMPLANT DETECTED: SPATIAL N1-DEVICE"]);
    }, 1000);

    setTimeout(() => {
      setTelemetry(prev => [...prev, "TRANSMITTING CV NEURAL PACKETS TO IMPLANT..."]);
    }, 2000);

    setTimeout(() => {
      setIsPairing(false);
      setErrorModal(true);
    }, 3200);
  };

  return (
    <section id="era-2036" className={styles.neuralinkContainer} aria-label="2036 Neuralink Era">
      <div className={styles.innerWrapper}>
        <div className={styles.versionTag}>NEURALINK™ · v12 3D SPATIAL MODEL</div>

        {/* Styled 3D Head & Neural Device Model */}
        <div className={styles.head3dModelContainer}>
          <div className={styles.orbitingDeviceRing} />
          <div className={styles.headOutlineCircle}>
            <User size={100} style={{ color: '#c084fc' }} />
            <div className={styles.neuralNodeDot} />
          </div>
        </div>

        <div className={styles.stepTitle}>STEP 1 OF 1</div>
        <h1 className={styles.mainHeading}>Connect your Neuralink™</h1>
        <p className={styles.subText}>
          Hold your Neuralink device against your ear to pair with ChandraOS.<br />
          Stay still while we establish the direct 3D cognitive mental link.
        </p>

        <button className={styles.actionBtn} onClick={handleStartPairing} disabled={isPairing}>
          {isPairing ? "Scanning Cognitive Nodes..." : "Start Neural Pairing"}
        </button>

        {telemetry.length > 0 && (
          <div className={styles.telemetryBox}>
            {telemetry.map((line, idx) => (
              <div key={idx}>▸ {line}</div>
            ))}
          </div>
        )}
      </div>

      {/* Error Modal */}
      {errorModal && (
        <div className={styles.errorOverlay} onClick={() => setErrorModal(false)}>
          <div className={styles.errorBox} onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '12px' }} />
            <h3 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Neural Hardware Required</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              ERR_NEURAL_HARDWARE_ABSENT: Your current device only supports visual web browsing.<br /><br />
              To view {data.cv.name}&apos;s CV via direct 3D cognitive sync, please enable your Musk Industries Neural ID implant.
            </p>
            <button
              className={styles.actionBtn}
              style={{ marginTop: '20px', padding: '10px 24px', fontSize: '14px' }}
              onClick={() => setErrorModal(false)}
            >
              Return to Visual View
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
