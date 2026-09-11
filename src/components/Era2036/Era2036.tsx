import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2036.module.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Era2036Props {
  data: CVData;
}

const BrainParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const particlesCount = 4000;
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    
    for(let i=0; i<particlesCount; i++) {
      let x, y, z, d;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
        d = x*x + y*y + z*z;
      } while(d > 1);
      
      // Brain ellipsoid
      x *= 1.2; y *= 1.0; z *= 1.4;
      
      // Longitudinal fissure
      if (Math.abs(x) < 0.1) {
        x = x > 0 ? x + 0.15 : x - 0.15;
      }
      
      // Temporal lobe bulge
      if (y < 0 && z > -0.2 && z < 0.5) {
        x *= 1.2;
      }

      pos[i*3] = x * 1.5;
      pos[i*3+1] = (y + 0.2) * 1.5; // shift up
      pos[i*3+2] = z * 1.5;
      
      // Coloring
      col[i*3] = 0.4 + (x * 0.3); // R
      col[i*3+1] = 0.6 + (y * 0.2); // G
      col[i*3+2] = 0.9 + (z * 0.1); // B
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {/* Neuralink Device Node inserted on the cortex */}
      <mesh position={[1.4, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color="#38bdf8" intensity={10} distance={4} />
      </mesh>
      {/* Signal glowing nodes */}
      <Sphere args={[0.05]} position={[-1.2, 1.0, 0.5]}>
        <meshBasicMaterial color="#38bdf8" />
      </Sphere>
      <Sphere args={[0.05]} position={[0.8, -0.5, 1.2]}>
        <meshBasicMaterial color="#c084fc" />
      </Sphere>
    </group>
  );
};

export const Era2036: React.FC<Era2036Props> = ({ data }) => {
  const [isPairing, setIsPairing] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [errorModal, setErrorModal] = useState(false);
  const [pairingProgress, setPairingProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartPairing = () => {
    if (isPairing) return;
    setIsPairing(true);
    setPairingProgress(0);
    setTelemetry([]);

    const logs = [
      `INITIALIZING SPATIAL NEURAL BROADCAST @ 60GHz...`,
      `SCANNING COGNITIVE NODES FOR: ${data.cv.name.toUpperCase()}...`,
      `3D NEURAL IMPLANT DETECTED: SPATIAL N1-DEVICE`,
      `TRANSMITTING CV NEURAL PACKETS TO IMPLANT...`,
      `PACKET INTEGRITY: 99.98% // LATENCY: 0.3ms`,
      `CV SYNC COMPLETE. VERIFYING CONSCIOUSNESS BRIDGE...`,
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setTelemetry(prev => [...prev, log]);
      }, idx * 500);
    });

    progressRef.current = setInterval(() => {
      setPairingProgress(p => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    setTimeout(() => {
      setIsPairing(false);
      setErrorModal(true);
      clearInterval(progressRef.current!);
      setPairingProgress(100);
    }, 3400);
  };

  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  return (
    <section id="era-2036" className={styles.neuralinkContainer} aria-label="2036 Neuralink Era">
      <div className={styles.ring1} />
      <div className={styles.ring2} />
      <div className={styles.ring3} />

      <div className={styles.innerWrapper}>
        <div className={styles.versionTag}>NEURALINK™ · v12 3D SPATIAL COGNITIVE MODEL</div>

        <div style={{ width: '300px', height: '300px', margin: '0 auto 36px', position: 'relative' }}>
          <div className={styles.brainHalo} style={{ zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            <Canvas camera={{ position: [0, 1.5, 4.5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <BrainParticles />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
          </div>
          
          <div className={styles.brainOrbit1} />
          <div className={styles.brainOrbit2} />
          <div className={styles.brainOrbit3} />
          <div className={styles.neuralNodeDot} />
          <div className={styles.neuralNodeDot2} />
        </div>

        <div className={styles.stepTitle}>STEP 1 OF 1 · SPATIAL NEURAL INTERFACE</div>
        <h1 className={styles.mainHeading}>Connect your Neuralink™</h1>
        <p className={styles.subText}>
          Hold your Neuralink device against your ear to pair with ChandraOS v2036.<br />
          Stay still while we establish the direct 3D cognitive mental link.
        </p>

        {isPairing && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${pairingProgress}%` }} />
            <div className={styles.progressLabel}>{pairingProgress}%</div>
          </div>
        )}

        <button className={styles.actionBtn} onClick={handleStartPairing} disabled={isPairing}>
          {isPairing ? 'Scanning Cognitive Nodes...' : 'Start Neural Pairing'}
        </button>

        {telemetry.length > 0 && (
          <div className={styles.telemetryBox}>
            {telemetry.map((line, idx) => (
              <div key={idx} className={styles.telemetryLine}>▸ {line}</div>
            ))}
          </div>
        )}
      </div>

      {errorModal && (
        <div className={styles.errorOverlay} onClick={() => setErrorModal(false)}>
          <div className={styles.errorBox} onClick={e => e.stopPropagation()}>
            <div className={styles.errorIcon}>⚠</div>
            <h3 className={styles.errorTitle}>Neural Hardware Required</h3>
            <p className={styles.errorMsg}>
              ERR_NEURAL_HARDWARE_ABSENT: Your current device only supports visual web browsing.
            </p>
            <p className={styles.errorDetail}>
              To view {data.cv.name}&apos;s CV via direct 3D cognitive sync, please enable your RCK Industries Neural ID implant v12+.
            </p>
            <button
              className={styles.actionBtn}
              style={{ marginTop: '20px', padding: '12px 28px', fontSize: '14px' }}
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
