import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era1986.module.css';

interface Era1986Props {
  data: CVData;
  onNextEra?: () => void;
}

type AppMode = 'BBS' | 'DOS' | 'SNAKE';

export const Era1986: React.FC<Era1986Props> = ({ data, onNextEra }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mode, setMode] = useState<AppMode>('BBS');
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [isTypingOutput, setIsTypingOutput] = useState(false);

  // Snake game state (40x18 Grid for bigger canvas)
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 28, y: 6 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [nextDirection, setNextDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const directionRef = useRef(direction);

  useEffect(() => { directionRef.current = direction; }, [direction]);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((freq = 850, type: OscillatorType = 'square', duration = 0.03) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }, [soundEnabled, getAudioContext]);

  // Auto scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory, typedLines, isConnected, mode]);

  // Dial-up connecting animation (line by line with character typing)
  const handleConnect = useCallback(() => {
    setIsConnecting(true);
    setTypedLines([]);
    setTypingIndex(0);
    playSound(500, 'square', 0.15);
  }, [playSound]);

  const logLines = [
    'ATDT 1-800-CHANDRA...',
    'RING ... RING ...',
    'CARRIER DETECT 1200 BAUD',
    'CONNECT 1200 / 8-N-1 / ANSI',
    `Welcome, GUEST. You are caller #002,481.`,
    `SysOp: ${data.cv.name.toUpperCase()}`,
    `Last on: 14 JUN 1986  11:47 PM`,
    `>> "This is not a portfolio. It's a time machine."`,
    `> SYSTEM READY. Type HELP or press any letter key.`
  ];

  // Sequential line reveal with typing sound
  useEffect(() => {
    if (!isConnecting) return;
    if (typingIndex >= logLines.length) {
      const t = setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTypedLines(prev => [...prev, logLines[typingIndex]]);
      playSound(600 + typingIndex * 50, 'square', 0.05);
      setTypingIndex(i => i + 1);
    }, 550);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting, typingIndex]);

  // Keyboard controls for Snake — prevent page scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'SNAKE') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault();
        }
        const d = directionRef.current;
        if ((e.key === 'ArrowUp' || e.key === 'w') && d !== 'DOWN') setNextDirection('UP');
        if ((e.key === 'ArrowDown' || e.key === 's') && d !== 'UP') setNextDirection('DOWN');
        if ((e.key === 'ArrowLeft' || e.key === 'a') && d !== 'RIGHT') setNextDirection('LEFT');
        if ((e.key === 'ArrowRight' || e.key === 'd') && d !== 'LEFT') setNextDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Snake game loop
  useEffect(() => {
    if (mode !== 'SNAKE' || gameOver) return;
    const interval = setInterval(() => {
      setDirection(nextDirection);
      setSnake(prevSnake => {
        const currentDir = nextDirection;
        const head = { ...prevSnake[0] };
        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 18) {
          playSound(180, 'sawtooth', 0.3);
          setGameOver(true);
          return prevSnake;
        }
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          playSound(180, 'sawtooth', 0.3);
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          playSound(1400, 'sine', 0.1);
          setScore(s => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood({
            x: Math.floor(Math.random() * 38) + 1,
            y: Math.floor(Math.random() * 16) + 1
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [mode, nextDirection, food, gameOver, highScore, playSound]);

  const resetSnake = () => {
    playSound(600, 'square', 0.1);
    setSnake([{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }]);
    setFood({ x: 28, y: 6 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };

  // Streaming typewriter for command output
  const streamCommandOutput = useCallback((promptLine: string, linesToStream: string[]) => {
    setIsTypingOutput(true);
    setTerminalHistory(prev => [...prev, promptLine]);
    let lineIdx = 0;
    const go = () => {
      if (lineIdx < linesToStream.length) {
        const ln = linesToStream[lineIdx];
        setTerminalHistory(prev => [...prev, ln]);
        playSound(680 + (lineIdx % 6) * 60, 'square', 0.03);
        lineIdx++;
        setTimeout(go, 90);
      } else {
        setIsTypingOutput(false);
      }
    };
    setTimeout(go, 80);
  }, [playSound]);

  const executeCommand = useCallback((cmdStr: string) => {
    if (isTypingOutput) return;
    const cmd = cmdStr.trim().toUpperCase();
    setCommandInput('');
    const promptPrefix = mode === 'DOS' ? 'C:\\>' : 'COMMAND>';
    const promptLine = `${promptPrefix} ${cmdStr}`;
    const lines: string[] = [];

    if (cmd === 'A' || cmd === 'ABOUT') {
      lines.push(
        `╔══════════════════════════════════════════════════════════╗`,
        `║              [A] SYSOP PROFILE & ABOUT                  ║`,
        `╚══════════════════════════════════════════════════════════╝`,
        `NAME:     ${data.cv.name}`,
        `TITLE:    ${data.cv.title}`,
        `LOCATION: ${data.cv.location}`,
        `EMAIL:    ${data.cv.email}`,
        ``,
        `BIO:`,
        ...data.cv.about.match(/.{1,60}/g) || [data.cv.about]
      );
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'W' || cmd === 'WORK') {
      lines.push(`╔══════════════════════════════════════════════════════════╗`, `║           [W] WORK & EMPLOYMENT HISTORY                  ║`, `╚══════════════════════════════════════════════════════════╝`);
      data.jobs.forEach(j => {
        lines.push(`• ${j.role}`, `  @ ${j.org} (${j.period})`, `  ${j.desc}`, ``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'E' || cmd === 'EDU' || cmd === 'EDUCATION') {
      lines.push(`╔══════════════════════════════════════════════════════════╗`, `║               [E] ACADEMIC EDUCATION                    ║`, `╚══════════════════════════════════════════════════════════╝`);
      data.education.forEach(edu => {
        lines.push(`• ${edu.school}`, `  ${edu.detail} (${edu.period})`, ``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'S' || cmd === 'SKILLS') {
      lines.push(`╔══════════════════════════════════════════════════════════╗`, `║           [S] SKILLS & SYSTEM TECHNOLOGIES               ║`, `╚══════════════════════════════════════════════════════════╝`);
      data.skills.forEach(s => lines.push(`[✓] ${s}`));
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'C' || cmd === 'CONTACT') {
      lines.push(`╔══════════════════════════════════════════════════════════╗`, `║         [C] CONTACT & COMMUNICATION CHANNELS            ║`, `╚══════════════════════════════════════════════════════════╝`,
        `EMAIL:    ${data.cv.email}`, `PHONE:    ${data.cv.phone}`, `GITHUB:   ${data.social.github}`, `LINKEDIN: ${data.cv.linkedinUrl}`);
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'P' || cmd === 'PROJECTS') {
      lines.push(`╔══════════════════════════════════════════════════════════╗`, `║             [P] FEATURED PROJECTS SHOWCASE              ║`, `╚══════════════════════════════════════════════════════════╝`);
      data.projects.forEach((p, idx) => {
        lines.push(`[${idx + 1}] ${p.title.toUpperCase()}`, `    ${p.tagline}`, `    ${p.desc.slice(0, 80)}...`, p.link ? `    URL: ${p.link}` : '', ``);
      });
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'X' || cmd === 'EXIT' || cmd === 'DOS') {
      setMode('DOS');
      streamCommandOutput(promptLine, [`Exiting BBS... Loading MS-DOS 3.30.`, `C:\\> Type DIR, HELP, CHANDRA, GAME`]);
    } else if (cmd === 'CHANDRA' || cmd === 'BBS') {
      setMode('BBS');
      streamCommandOutput(promptLine, [`Returning to SysOp BBS Main Menu...`]);
    } else if (cmd === 'GAME' || cmd === 'SNAKE' || cmd === 'B') {
      resetSnake();
      setMode('SNAKE');
    } else if (cmd === 'DIR') {
      lines.push(` Volume in drive C has no label`, ` Directory of C:\\`, ``,
        `AUTOEXEC BAT         128 01-15-86  12:00p`,
        `CHANDRA  EXE       45056 09-06-86   4:20p`,
        `SNAKE    EXE       16384 03-12-86   8:30a`,
        `README   TXT        1024 08-20-86   1:15p`,
        `       4 File(s)    62592 bytes free`);
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'HELP') {
      lines.push(`AVAILABLE COMMANDS:`,
        `  [A] ABOUT        - View SysOp profile & bio`,
        `  [W] WORK         - Employment history`,
        `  [E] EDUCATION    - Academic record`,
        `  [S] SKILLS       - Technical competencies`,
        `  [C] CONTACT      - Electronic mail & socials`,
        `  [P] PROJECTS     - Portfolio showcase`,
        `  [B] GAME/SNAKE   - Play ASCII Snake Arcade`,
        `  DIR              - List MS-DOS directory`,
        `  CLS              - Clear terminal screen`,
        `  [X] EXIT         - Toggle BBS / DOS mode`);
      streamCommandOutput(promptLine, lines);
    } else if (cmd === 'CLS') {
      setTerminalHistory([]);
    } else if (cmd !== '') {
      streamCommandOutput(promptLine, [`Bad command or file name: "${cmdStr}". Type HELP.`]);
    }
  }, [isTypingOutput, mode, data, streamCommandOutput]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      playSound(800, 'square', 0.02);
      executeCommand(commandInput);
    }
  };

  // Render snake grid
  const renderSnakeGrid = () => {
    const COLS = 40, ROWS = 18;
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const isHead = snake[0].x === c && snake[0].y === r;
        const isBody = snake.some((seg, i) => i > 0 && seg.x === c && seg.y === r);
        const isFood = food.x === c && food.y === r;
        let char = '·', cls = styles.cellEmpty;
        if (isHead) { char = '◉'; cls = styles.cellHead; }
        else if (isBody) { char = '█'; cls = styles.cellBody; }
        else if (isFood) { char = '★'; cls = styles.cellFood; }
        row.push(<span key={c} className={cls}>{char}</span>);
      }
      cells.push(<div key={r} className={styles.snakeRow}>{row}</div>);
    }
    return cells;
  };

  return (
    <section id="era-1986" className={styles.tvMonitorContainer} aria-label="1986 CRT TV Era">
      {/* Fixed power LED top-right */}
      <div className={styles.powerGroup}>
        <span>SOUND:{soundEnabled ? 'ON' : 'OFF'}</span>
        <div className={`${styles.powerLed} ${(isConnected || isConnecting) ? styles.powerLedOn : ''}`} />
      </div>

      <div className={styles.tvCabinet}>
        {/* CRT Screen (now transparent full-page) */}
        <div className={styles.crtScreen}>

          {/* PRE-CONNECT STATE */}
          {!isConnected && !isConnecting && (
            <div className={styles.startupPreconnectBox}>
              <div className={styles.baudHeader}>
                1200 BAUD · 8-N-1 · ANSI · DIAL: 1-800-CHANDRA
              </div>
              <div className={styles.blinkingBlockLarge}>█</div>
              <h2 className={styles.startupTitle}>INITIALIZE CRT BBS TERMINAL</h2>
              <p className={styles.startupText}>
                Welcome to SysOp {data.cv.name}&apos;s 1986 BBS System.
                <br />Click CONNECT to initiate dial-up teletype sequence.
              </p>
              <button className={styles.connectBtn} onClick={handleConnect} id="connect-btn-1986">
                ► CONNECT
              </button>
            </div>
          )}

          {/* CONNECTING / DIALING STATE */}
          {isConnecting && (
            <div className={styles.typingLogContainer}>
              <div className={styles.typingLogHeader}>
                📡 MODEM DIALING 1-800-CHANDRA... ESTABLISHING CONNECTION
              </div>
              <div className={styles.typingLogBox}>
                {typedLines.map((line, idx) => (
                  <div key={idx} className={styles.typingLine}>{line}</div>
                ))}
                <span className={styles.blinkingCursor}>█</span>
              </div>
            </div>
          )}

          {/* CONNECTED TERMINAL */}
          {isConnected && (
            <div className={styles.terminalBodyContent} style={{ textAlign: 'left' }}>
              {/* Top BBS Header Bar */}
              <div className={styles.topBbsHeader}>
                <div className={styles.sysOpTitle}>
                  ┌─ {data.cv.name.toUpperCase()}&apos;S BBS // NODE 1 OF 1 ─────┐
                </div>
                <div className={styles.headerControls}>
                  <button
                    className={styles.soundToggleBtn}
                    onClick={() => setSoundEnabled(s => !s)}
                  >
                    SND:{soundEnabled ? '●' : '○'}
                  </button>
                  <span className={styles.modeTag}>[{mode}]</span>
                </div>
              </div>

              {/* Connection log */}
              <div className={styles.connectionLogBox}>
                <div>CONNECT 1200 &nbsp;|&nbsp; 8-N-1 &nbsp;|&nbsp; ANSI</div>
                <div>Welcome, GUEST. You are caller #002,481.</div>
                <div>SysOp: <span style={{ color: '#ffff00' }}>{data.cv.name.toUpperCase()}</span></div>
                <div>Last on: 14 JUN 1986  11:47 PM</div>
                <div className={styles.quoteLine}>&gt;&gt; &quot;This is not a portfolio. It&apos;s a time machine.&quot;</div>
                <div className={styles.readyLine}>&gt; SYSTEM READY. Type HELP or click a menu item below.</div>
              </div>

              {/* SNAKE MODE */}
              {mode === 'SNAKE' && (
                <div className={styles.snakeDialogueBox}>
                  <div className={styles.snakeHeaderBar}>
                    <span className={styles.snakeTitle}>🕹 RETRO ASCII SNAKE (1986)</span>
                    <div>
                      <span className={styles.snakeScore}>SCR:{score}</span>
                      <span className={styles.snakeHighScore}> HI:{highScore}</span>
                    </div>
                  </div>
                  <div className={styles.snakeBoardCanvas}>
                    {renderSnakeGrid()}
                  </div>
                  {gameOver ? (
                    <div className={styles.gameOverOverlay}>
                      <div className={styles.gameOverTitle}>═══ GAME OVER ═══</div>
                      <div>SCORE: {score} &nbsp;|&nbsp; HIGH: {highScore}</div>
                      <div className={styles.snakeBtnRow}>
                        <button className={styles.snakeActionBtn} onClick={resetSnake}>▶ RESTART</button>
                        <button className={styles.snakeActionBtn} onClick={() => setMode('BBS')}>◄ BBS MENU</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.snakeFooterControls}>
                      <div className={styles.dpadControls}>
                        <button type="button" onClick={() => nextDirection !== 'DOWN' && setNextDirection('UP')}>▲</button>
                        <div className={styles.dpadRow}>
                          <button type="button" onClick={() => nextDirection !== 'RIGHT' && setNextDirection('LEFT')}>◄</button>
                          <button type="button" onClick={() => nextDirection !== 'LEFT' && setNextDirection('RIGHT')}>►</button>
                        </div>
                        <button type="button" onClick={() => nextDirection !== 'UP' && setNextDirection('DOWN')}>▼</button>
                      </div>
                      <div className={styles.snakeHints}>
                        <div>WASD / ARROWS to move</div>
                        <div>Eat ★ to grow</div>
                        <button className={styles.exitSnakeBtn} onClick={() => setMode('BBS')}>
                          [ESC] BACK TO BBS
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BBS MAIN MENU */}
              {mode === 'BBS' && (
                <div className={styles.asciiMenuBox}>
                  <div className={styles.asciiMenuHeader}>
                    ┌──────────────────────────────────────────────────────────────────┐<br />
                    │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ MAIN MENU ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                    ├──────────────────────────────────────────────────────────────────┤
                  </div>
                  <div className={styles.asciiMenuOptions}>
                    {[
                      { key: 'A', label: 'About Me', cmd: 'A' },
                      { key: 'W', label: 'Work / Employment History', cmd: 'W' },
                      { key: 'E', label: 'Education', cmd: 'E' },
                      { key: 'S', label: 'Skills & Technologies', cmd: 'S' },
                      { key: 'C', label: 'Contact / Electronic Mail', cmd: 'C' },
                      { key: 'P', label: 'Projects Showcase', cmd: 'P' },
                    ].map(item => (
                      <div key={item.key} className={styles.menuLine} onClick={() => executeCommand(item.cmd)}>
                        <span className={styles.menuKey}>[{item.key}]</span>
                        <span className={styles.menuDots}> ... </span>
                        <span className={styles.menuLabel}>{item.label}</span>
                      </div>
                    ))}
                    <div className={styles.menuLine} style={{ borderTop: '1px dashed #004400', marginTop: '4px', paddingTop: '6px' }} onClick={() => { resetSnake(); setMode('SNAKE'); }}>
                      <span className={styles.menuKey} style={{ color: '#ffff00' }}>[B]</span>
                      <span className={styles.menuDots}> ... </span>
                      <span className={styles.menuLabel} style={{ color: '#ffff00' }}>Play Snake Arcade Game</span>
                    </div>
                    <div className={styles.menuLine} onClick={() => executeCommand('X')}>
                      <span className={styles.menuKey}>[X]</span>
                      <span className={styles.menuDots}> ... </span>
                      <span className={styles.menuLabel}>Exit to MS-DOS Prompt</span>
                    </div>
                  </div>
                  <div className={styles.asciiMenuFooter}>
                    └──────────────────────────────────────────────────────────────────┘
                  </div>
                </div>
              )}

              {/* DOS MODE indicator */}
              {mode === 'DOS' && (
                <div className={styles.dosPromptLabel}>
                  MS-DOS Version 3.30 &nbsp; Copyright 1981-1986 Microsoft Corp.
                  <br />
                  <span style={{ color: '#88ff88', fontSize: '13px' }}>Type CHANDRA to return to BBS. Type GAME for Snake. Type DIR or HELP.</span>
                </div>
              )}

              {/* Terminal Output History */}
              {terminalHistory.length > 0 && (
                <div className={styles.outputConsoleLog}>
                  {terminalHistory.map((line, i) => (
                    <div key={i} className={styles.logLine}>{line}</div>
                  ))}
                  {isTypingOutput && <span className={styles.blinkingCursor}>█</span>}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {/* Command Input */}
              <form onSubmit={handleFormSubmit} className={styles.commandForm}>
                <span className={styles.promptLabel}>
                  {mode === 'DOS' ? 'C:\\>' : 'COMMAND>'}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.commandInput}
                  value={commandInput}
                  onChange={e => {
                    setCommandInput(e.target.value);
                    playSound(820, 'square', 0.015);
                  }}
                  placeholder={mode === 'DOS' ? 'DIR, HELP, CHANDRA, GAME...' : 'A, W, E, S, C, P, GAME, EXIT...'}
                  disabled={isTypingOutput}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className={styles.blinkingCursor}>█</span>
              </form>

              {/* Quick Command Hints */}
              <div className={styles.quickCommandHints}>
                {['ABOUT', 'WORK', 'EDUCATION', 'SKILLS', 'CONTACT', 'PROJECTS', 'GAME'].map(cmd => (
                  <button key={cmd} type="button" onClick={() => executeCommand(cmd)}>{cmd}</button>
                ))}
                <button type="button" onClick={() => executeCommand(mode === 'DOS' ? 'CHANDRA' : 'EXIT')}>
                  {mode === 'DOS' ? '↩ BBS' : '↩ DOS'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation → 1996 */}
          {isConnected && (
            <div className={styles.bottomNextEraBox}>
              <button
                className={styles.nextEraBtn}
                onClick={() => onNextEra ? onNextEra() : (window.location.hash = '1996')}
              >
                [ JUMP TO 1996 → ]
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
