import React, { useState, useEffect, useRef } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era1986.module.css';

interface Era1986Props {
  data: CVData;
  onNextEra?: () => void;
}

export const Era1986: React.FC<Era1986Props> = ({ data, onNextEra }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mode, setMode] = useState<'BBS' | 'DOS' | 'SNAKE'>('BBS');
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [isTypingOutput, setIsTypingOutput] = useState(false);

  // Snake Game State (32x14 Grid)
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 }
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 22, y: 5 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or Get Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play Authentic Vintage Teletype Key Click Sound Effect
  const playKeyClickSound = (freq = 850, type: OscillatorType = 'square', duration = 0.03) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, typedLines, isConnected, mode]);

  // Initial Startup Teletype Typing Animation Sequence (Slower & Authentic Sound)
  const handleConnect = () => {
    setIsConnecting(true);
    setTypedLines([]);
    playKeyClickSound(500, 'square', 0.15);

    const logLines = [
      'DIALING 1-800-CHANDRA...',
      'CARRIER DETECT 1200 BAUD',
      'CONNECT 1200 / 8-N-1 ANSI',
      `Welcome, GUEST. You are caller #002,481.`,
      `SysOp: ${data.cv.name.toUpperCase()}`,
      `Last on: 14 JUN 1986  11:47 PM`,
      `>> "This is not a portfolio. It's a time machine."`,
      `> SYSTEM READY. Type HELP or DIR and press ENTER.`
    ];

    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      if (lineIdx < logLines.length) {
        const fullLine = logLines[lineIdx];
        setTypedLines(prev => [...prev, fullLine]);
        playKeyClickSound(600 + lineIdx * 80, 'square', 0.06);
        lineIdx++;
      } else {
        clearInterval(lineInterval);
        setIsConnecting(false);
        setIsConnected(true);
      }
    }, 600); // 600ms per line so it is clearly visible and slow!
  };

  // Keyboard Controls (Prevents Page Scroll Jump!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'SNAKE') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault(); // Lock page scroll position!
        }
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && direction !== 'DOWN') {
          setDirection('UP');
          playKeyClickSound(950, 'square', 0.025);
        }
        if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && direction !== 'UP') {
          setDirection('DOWN');
          playKeyClickSound(950, 'square', 0.025);
        }
        if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && direction !== 'RIGHT') {
          setDirection('LEFT');
          playKeyClickSound(950, 'square', 0.025);
        }
        if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && direction !== 'LEFT') {
          setDirection('RIGHT');
          playKeyClickSound(950, 'square', 0.025);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, direction]);

  // Snake Game Loop (32x14 Grid)
  useEffect(() => {
    if (mode !== 'SNAKE' || gameOver) return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        // Boundaries (32x14)
        if (head.x < 0 || head.x >= 32 || head.y < 0 || head.y >= 14) {
          playKeyClickSound(220, 'sawtooth', 0.25);
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          playKeyClickSound(220, 'sawtooth', 0.25);
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          playKeyClickSound(1200, 'sine', 0.08);
          setScore(s => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood({
            x: Math.floor(Math.random() * 30) + 1,
            y: Math.floor(Math.random() * 12) + 1
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [mode, direction, food, gameOver, highScore]);

  const resetSnake = () => {
    playKeyClickSound(600, 'square', 0.1);
    setSnake([
      { x: 12, y: 7 },
      { x: 11, y: 7 },
      { x: 10, y: 7 }
    ]);
    setFood({ x: 22, y: 5 });
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };

  // Character-by-Character Typewriter Streaming with Teletype Sound Effects!
  const streamCommandOutput = (promptLine: string, linesToStream: string[]) => {
    setIsTypingOutput(true);
    setTerminalHistory(prev => [...prev, promptLine]);

    let lineIdx = 0;
    const streamInterval = setInterval(() => {
      if (lineIdx < linesToStream.length) {
        const nextLine = linesToStream[lineIdx];
        setTerminalHistory(prev => [...prev, nextLine]);
        playKeyClickSound(700 + (lineIdx % 5) * 80, 'square', 0.035);
        lineIdx++;
      } else {
        clearInterval(streamInterval);
        setIsTypingOutput(false);
      }
    }, 120); // 120ms per line for clear, retro, deliberate teletype typing animation!
  };

  const executeCommand = (cmdStr: string) => {
    if (isTypingOutput) return; // Wait for active typing animation
    const cmd = cmdStr.trim().toUpperCase();
    setCommandInput('');

    const promptPrefix = mode === 'DOS' ? 'C:\\>' : 'COMMAND>';
    const promptLine = `${promptPrefix} ${cmdStr}`;
    const lines: string[] = [];

    if (cmd === 'A' || cmd === 'ABOUT' || cmd === 'ABOUT ME') {
      lines.push(
        `=============================================================`,
        `                [A] SYSOP PROFILE & ABOUT                    `,
        `=============================================================`,
        `NAME:     ${data.cv.name}`,
        `TITLE:    ${data.cv.title}`,
        `LOCATION: ${data.cv.location}`,
        `EMAIL:    ${data.cv.email}`,
        ``,
        `BIO SUMMARY:`,
        `${data.cv.about}`
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'W' || cmd === 'WORK' || cmd === 'EXPERIENCE') {
      lines.push(
        `=============================================================`,
        `           [W] WORK & EMPLOYMENT HISTORY                     `,
        `=============================================================`
      );
      data.jobs.forEach(j => {
        lines.push(`• ROLE: ${j.role}`);
        lines.push(`  ORG:  ${j.org} (${j.period})`);
        lines.push(`  DESC: ${j.desc}`);
        lines.push(``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'E' || cmd === 'EDU' || cmd === 'EDUCATION') {
      lines.push(
        `=============================================================`,
        `                 [E] ACADEMIC EDUCATION                      `,
        `=============================================================`
      );
      data.education.forEach(edu => {
        lines.push(`• ${edu.school}`);
        lines.push(`  DEGREE: ${edu.detail} (${edu.period})`);
        lines.push(``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'S' || cmd === 'SKILLS' || cmd === 'LANGUAGES') {
      lines.push(
        `=============================================================`,
        `             [S] SKILLS & SYSTEM TECHNOLOGIES                `,
        `=============================================================`,
        data.skills.map(s => `[✓] ${s}`).join('   ')
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'C' || cmd === 'CONTACT' || cmd === 'EMAIL') {
      lines.push(
        `=============================================================`,
        `             [C] CONTACT & COMMUNICATION CHANNELS            `,
        `=============================================================`,
        `EMAIL:    ${data.cv.email}`,
        `PHONE:    ${data.cv.phone}`,
        `GITHUB:   ${data.social.github}`,
        `LINKEDIN: ${data.cv.linkedinUrl}`,
        `TWITTER:  ${data.social.twitter}`
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'P' || cmd === 'PROJECTS' || cmd === 'SHOWCASE') {
      lines.push(
        `=============================================================`,
        `               [P] FEATURED PROJECTS SHOWCASE                `,
        `=============================================================`
      );
      data.projects.forEach((p, idx) => {
        lines.push(`[${idx + 1}] ${p.title.toUpperCase()}`);
        lines.push(`    TAGLINE: ${p.tagline}`);
        lines.push(`    DESC:    ${p.desc}`);
        if (p.link) lines.push(`    URL:     ${p.link}`);
        lines.push(``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'X' || cmd === 'EXIT' || cmd === 'DOS') {
      setMode('DOS');
      lines.push(
        `Exiting BBS software... Loading MS-DOS 3.30 Prompt.`,
        `Type DIR, HELP, CHANDRA, or GAME.`
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'CHANDRA' || cmd === 'CHANDRA.EXE' || cmd === 'BBS') {
      setMode('BBS');
      lines.push(`Returning to SysOp Chandra Kiran Rudra's BBS Main Menu...`);
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'GAME' || cmd === 'SNAKE' || cmd === 'SNAKE.EXE' || cmd === 'B') {
      resetSnake();
      setMode('SNAKE');
    } else if (cmd === 'DIR') {
      lines.push(
        ` Volume in drive C has no label`,
        ` Directory of C:\\`,
        ``,
        `AUTOEXEC BAT         128 01-15-86  12:00p`,
        `CHANDRA  EXE       45056 09-06-86   4:20p`,
        `SNAKE    EXE       16384 03-12-86   8:30a`,
        `README   TXT        1024 08-20-86   1:15p`,
        `       4 File(s)    62592 bytes free`
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'HELP') {
      lines.push(
        `AVAILABLE BBS / DOS COMMANDS:`,
        `  ABOUT (A)      - View SysOp profile`,
        `  WORK (W)       - Employment history`,
        `  EDUCATION (E)  - Academic record`,
        `  SKILLS (S)     - Technical competencies`,
        `  CONTACT (C)    - Electronic mail & socials`,
        `  PROJECTS (P)   - Portfolio showcase`,
        `  GAME / SNAKE   - Play ASCII Snake Arcade Game`,
        `  DIR            - List MS-DOS directory`,
        `  CLS            - Clear output screen`,
        `  EXIT (X)       - Switch between BBS and DOS modes`
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'CLS') {
      setTerminalHistory([]);
    } else if (cmd === '') {
      // Empty enter
    } else {
      lines.push(`Unrecognized command: "${cmdStr}". Type HELP or DIR.`);
      streamCommandOutput(promptLine, lines);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(commandInput);
  };

  return (
    <section id="era-1986" className={styles.tvMonitorContainer} aria-label="1986 CRT TV Era">
      {/* Wooden & Plastic Retro CRT TV Enclosure Cabinet */}
      <div className={styles.tvCabinet}>
        {/* Brand Header Label & Power LED */}
        <div className={styles.tvBrandLabel}>
          <span>VINTAGE 1986 CRT PHOSPHOR MONITOR · MODEL BBS-86</span>
          <div className={styles.powerGroup}>
            <span style={{ fontSize: '13px' }}>POWER</span>
            <div className={`${styles.powerLed} ${isConnected || isConnecting ? styles.powerLedOn : ''}`} />
          </div>
        </div>

        {/* Curved Glass CRT Screen Display */}
        <div className={styles.crtScreen}>
          <div className={styles.scanlineOverlay} />

          {/* Initial Pre-connect Startup TV State with CONNECT Button */}
          {!isConnected && !isConnecting ? (
            <div className={styles.startupPreconnectBox}>
              <div className={styles.baudHeader}>
                1200 BAUD · 8-N-1 · ANSI · DIAL: 1-800-CHANDRA
              </div>
              <h2 className={styles.startupTitle}>INITIALIZE CRT BBS TERMINAL</h2>
              <p className={styles.startupText}>
                Welcome to SysOp {data.cv.name}&apos;s 1986 BBS System. Click the connect button below to turn on CRT display &amp; initiate dial-up teletype sequence.
              </p>
              <button className={styles.connectBtn} onClick={handleConnect}>
                ► CONNECT
              </button>
            </div>
          ) : isConnecting ? (
            /* Teletype Typing Animation Sequence Screen */
            <div className={styles.typingLogContainer}>
              <div className={styles.typingLogHeader}>
                📡 DIALING MODEM 1-800-CHANDRA... TELETYPE ANIMATION IN PROGRESS
              </div>
              <div className={styles.typingLogBox}>
                {typedLines.map((line, idx) => (
                  <div key={idx} className={styles.typingLine}>
                    {line}
                  </div>
                ))}
                <span className={styles.blinkingCursor}>█</span>
              </div>
            </div>
          ) : (
            /* Connected Terminal Body */
            <div className={styles.terminalBodyContent}>
              {/* Top Header Bar matching Pedro's BBS */}
              <div className={styles.topBbsHeader}>
                <div className={styles.sysOpTitle}>
                  CHANDRA&apos;S BBS // NODE 1 OF 1
                </div>
                <button
                  className={styles.soundToggleBtn}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  SOUND: {soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Connected Connection Teletype Log */}
              <div className={styles.connectionLogBox}>
                <div>CONNECT 1200</div>
                <div>Welcome, GUEST. You are caller #002,481.</div>
                <div>SysOp: {data.cv.name.toUpperCase()}</div>
                <div>Last on: 14 JUN 1986  11:47 PM</div>
                <div className={styles.quoteLine}>&gt;&gt; &quot;This is not a portfolio. It&apos;s a time machine.&quot;</div>
                <div className={styles.readyLine}>&gt; SYSTEM READY. Type HELP or DIR and press ENTER.</div>
              </div>

              {/* SNAKE GAME IN LARGE DIALOGUE BOX CONTAINER */}
              {mode === 'SNAKE' ? (
                <div className={styles.snakeDialogueBox}>
                  <div className={styles.snakeHeaderBar}>
                    <span className={styles.snakeTitle}>🕹️ RETRO ASCII SNAKE ARCADE (1986)</span>
                    <div>
                      <span className={styles.snakeScore}>SCORE: {score}</span>
                      <span className={styles.snakeHighScore}>HIGH: {highScore}</span>
                    </div>
                  </div>

                  <div className={styles.snakeBoardCanvas}>
                    {Array.from({ length: 14 }).map((_, r) => (
                      <div key={r} className={styles.snakeRow}>
                        {Array.from({ length: 32 }).map((_, c) => {
                          const isHead = snake[0].x === c && snake[0].y === r;
                          const isBody = snake.some((seg, idx) => idx > 0 && seg.x === c && seg.y === r);
                          const isFood = food.x === c && food.y === r;

                          let char = '·';
                          let charClass = styles.cellEmpty;
                          if (isHead) { char = 'O'; charClass = styles.cellHead; }
                          else if (isBody) { char = 'o'; charClass = styles.cellBody; }
                          else if (isFood) { char = '*'; charClass = styles.cellFood; }

                          return (
                            <span key={c} className={charClass}>
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {gameOver ? (
                    <div className={styles.gameOverOverlay}>
                      <h2>=== GAME OVER ===</h2>
                      <p>FINAL SCORE: {score}</p>
                      <div className={styles.snakeBtnRow}>
                        <button className={styles.snakeActionBtn} onClick={resetSnake}>
                          🎮 RESTART GAME
                        </button>
                        <button className={styles.snakeActionBtn} onClick={() => setMode('BBS')}>
                          ◄ RETURN TO BBS MENU
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.snakeFooterControls}>
                      <div className={styles.dpadControls}>
                        <button type="button" onClick={() => direction !== 'DOWN' && setDirection('UP')}>▲ UP</button>
                        <div className={styles.dpadRow}>
                          <button type="button" onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}>◄ LEFT</button>
                          <button type="button" onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}>RIGHT ►</button>
                        </div>
                        <button type="button" onClick={() => direction !== 'UP' && setDirection('DOWN')}>▼ DOWN</button>
                      </div>
                      <button className={styles.exitSnakeBtn} onClick={() => setMode('BBS')}>
                        RETURN TO BBS MENU [ESC]
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Pedro's BBS Main Menu Box */
                mode === 'BBS' && (
                  <div className={styles.asciiMenuBox}>
                    <div className={styles.asciiMenuHeader}>
                      ┌─────────────────────────────────────────────────────────────────────────────┐<br />
                      │                               [ MAIN MENU ]                                 │<br />
                      ├─────────────────────────────────────────────────────────────────────────────┤
                    </div>
                    <div className={styles.asciiMenuOptions}>
                      <div className={styles.menuLine} onClick={() => executeCommand('A')}>
                        <span className={styles.keyTag}>[A] ... About Me</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('W')}>
                        <span className={styles.keyTag}>[W] ... Work / Employment History</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('E')}>
                        <span className={styles.keyTag}>[E] ... Education</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('S')}>
                        <span className={styles.keyTag}>[S] ... Skills &amp; Languages</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('C')}>
                        <span className={styles.keyTag}>[C] ... Contact / Electronic Mail</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('P')}>
                        <span className={styles.keyTag}>[P] ... Projects Showcase</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('GAME')}>
                        <span className={styles.keyTag} style={{ color: '#ffff00' }}>[B] ... Play Snake Arcade Game</span>
                      </div>
                      <div className={styles.menuLine} onClick={() => executeCommand('X')}>
                        <span className={styles.keyTag}>[X] ... Exit to DOS</span>
                      </div>
                    </div>
                    <div className={styles.asciiMenuFooter}>
                      └─────────────────────────────────────────────────────────────────────────────┘
                    </div>
                  </div>
                )
              )}

              {/* Line Output Terminal History with Streaming Typewriter Animation & Sound Beeps */}
              {terminalHistory.length > 0 && (
                <div className={styles.outputConsoleLog}>
                  {terminalHistory.map((line, i) => (
                    <div key={i} className={styles.logLine}>{line}</div>
                  ))}
                  {isTypingOutput && <span className={styles.blinkingCursor}>█</span>}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {/* COMMAND Prompt Form Input */}
              <form onSubmit={handleFormSubmit} className={styles.commandForm}>
                <div className={styles.promptLabel}>
                  {mode === 'DOS' ? 'C:\\>' : 'COMMAND>'}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.commandInput}
                  value={commandInput}
                  onChange={e => {
                    setCommandInput(e.target.value);
                    playKeyClickSound(800, 'square', 0.02);
                  }}
                  placeholder={mode === 'DOS' ? 'Type DIR, HELP, CHANDRA, GAME...' : 'Type A, W, E, S, C, P, GAME, EXIT...'}
                  disabled={isTypingOutput}
                  autoFocus
                />
                <span className={styles.blinkingCursor}>█</span>
              </form>

              {/* Quick Command Hints */}
              <div className={styles.quickCommandHints}>
                <span style={{ color: '#00ff00', fontWeight: 'bold' }}>Type:</span>
                <button type="button" onClick={() => executeCommand('ABOUT')}>ABOUT</button> :
                <button type="button" onClick={() => executeCommand('WORK')}>WORK</button> :
                <button type="button" onClick={() => executeCommand('EDUCATION')}>EDUCATION</button> :
                <button type="button" onClick={() => executeCommand('SKILLS')}>SKILLS</button> :
                <button type="button" onClick={() => executeCommand('CONTACT')}>CONTACT</button> :
                <button type="button" onClick={() => executeCommand('PROJECTS')}>PROJECTS</button> :
                <button type="button" onClick={() => executeCommand('GAME')}>GAME</button> :
                <button type="button" onClick={() => executeCommand(mode === 'DOS' ? 'CHANDRA' : 'EXIT')}>
                  {mode === 'DOS' ? 'BBS' : 'EXIT'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation GO 1996 Box */}
          <div className={styles.bottomNextEraBox}>
            <button
              className={styles.nextEraBtn}
              onClick={() => {
                if (onNextEra) {
                  onNextEra();
                } else {
                  window.location.hash = '1996';
                }
              }}
            >
              [ GO 1996 ]
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
