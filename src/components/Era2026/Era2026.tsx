import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2026.module.css';

interface Era2026Props {
  data: CVData;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

type Phase = 'landing' | 'chat' | 'subscribed';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9',
    period: '/ month',
    features: ['100 questions / session', 'Basic profile info', 'Skills & projects'],
    cta: 'Start Basic',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/ month',
    features: ['Unlimited questions', 'Full CV deep-dive', 'Code samples access', 'Priority responses'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    id: 'neural',
    name: 'Neural',
    price: '$99',
    period: '/ month',
    features: ['Everything in Pro', 'Direct neural sync', 'Predictive insights', 'Consciousness bridge beta'],
    cta: 'Connect Neural',
    highlight: false,
  },
];

const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const Era2026: React.FC<Era2026Props> = ({ data }) => {
  const [phase, setPhase] = useState<Phase>('landing');
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes('hpe') || ql.includes('intern') || ql.includes('briks') || ql.includes('job') || ql.includes('work') || ql.includes('experience')) {
      return `Work Experience\n─────────────────────────────\n` + data.jobs.map(j =>
        `▸ ${j.role}\n  ${j.org} · ${j.period}\n  ${j.desc}`
      ).join('\n\n');
    } else if (ql.includes('skill') || ql.includes('tech') || ql.includes('stack') || ql.includes('python') || ql.includes('ai')) {
      return `Technical Skills\n─────────────────────────────\n` + data.skills.map(s => `• ${s}`).join('\n');
    } else if (ql.includes('project')) {
      return `Featured Projects\n─────────────────────────────\n` + data.projects.map((p, i) =>
        `[${i + 1}] ${p.title}\n    ${p.tagline}\n    ${p.desc.slice(0, 100)}...`
      ).join('\n\n');
    } else if (ql.includes('education') || ql.includes('school') || ql.includes('degree')) {
      return `Education\n─────────────────────────────\n` + data.education.map(e =>
        `▸ ${e.school}\n  ${e.detail} · ${e.period}`
      ).join('\n\n');
    } else if (ql.includes('contact') || ql.includes('email') || ql.includes('reach') || ql.includes('hire')) {
      return `Contact Information\n─────────────────────────────\n📧 ${data.cv.email}\n📞 ${data.cv.phone}\n💻 ${data.social.github}`;
    } else if (ql.includes('who') || ql.includes('about') || ql.includes('chandra') || ql.includes('rudra')) {
      return `${data.cv.name}\n─────────────────────────────\n${data.cv.title}\n📍 ${data.cv.location}\n\n${data.cv.about}`;
    }
    
    // Fuzzy fallback diversion
    const fallbacks = [
      `I'm focused on ${data.cv.name}'s professional profile. Did you know his primary expertise is in frontend development and UI design? Try asking about his "skills".`,
      `That's an interesting question. While I process that, you might want to look at his "Featured Projects" to see his capabilities in action.`,
      `I'm calibrated to discuss ${data.cv.name}'s resume. Perhaps I can tell you about his "work experience" instead?`
    ];
    
    return `Query processed.\n─────────────────────────────\n${fallbacks[userMsgCount % fallbacks.length]}`;
  };

  const typeAIResponse = (fullResponse: string, prevMessages: Message[]) => {
    const aiMsgIndex = prevMessages.length;
    setMessages([...prevMessages, { sender: 'ai', text: '', timestamp: getTimestamp() }]);

    let currentLength = 0;
    const speed = 16;
    const chunkSize = 3;

    const tick = () => {
      currentLength = Math.min(currentLength + chunkSize, fullResponse.length);
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          sender: 'ai',
          text: fullResponse.slice(0, currentLength),
          timestamp: updated[aiMsgIndex]?.timestamp
        };
        return updated;
      });
      if (currentLength < fullResponse.length) {
        setTimeout(tick, speed);
      } else {
        setIsTyping(false);
      }
    };
    setTimeout(tick, 500);
  };

  const handleQuery = useCallback((queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);

    const userMsg: Message = { sender: 'user', text: queryText, timestamp: getTimestamp() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsTyping(true);

    const fullResponse = getAIResponse(queryText);
    typeAIResponse(fullResponse, updatedMessages);

    // After 2nd user message → show subscription popup
    if (newCount === 2 && !selectedPlan) {
      setTimeout(() => {
        setShowSubscription(true);
      }, fullResponse.length * 16 + 1200);
    }
  }, [isTyping, userMsgCount, messages, data, selectedPlan]);

  const handleStartChat = () => {
    setPhase('chat');
    setTimeout(() => {
      const greeting: Message = {
        sender: 'ai',
        text: `Initializing ChandraAI v2026...\n\nGreetings. I am an AI built around ${data.cv.name}'s complete profile.\nAsk me anything about his background, skills, projects or work.`,
        timestamp: getTimestamp()
      };
      setMessages([greeting]);
      inputRef.current?.focus();
    }, 600);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowSubscription(false);
    const plan = PLANS.find(p => p.id === planId);
    const confirmMsg: Message = {
      sender: 'ai',
      text: `✓ ${plan?.name} plan activated.\n─────────────────────────────\nThank you! Your session is now ${planId === 'basic' ? 'continuing on the Basic trial' : `upgraded to ${plan?.name}`}.\n\nFeel free to continue asking anything about ${data.cv.name}.`,
      timestamp: getTimestamp()
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  const presetQueries = [
    { icon: '👤', label: 'Who is he?', query: 'Who is Chandra Kiran Rudra?' },
    { icon: '💼', label: 'Work Experience', query: 'Tell me about his work experience.' },
    { icon: '⚡', label: 'Skills', query: 'What are his technical skills?' },
    { icon: '🚀', label: 'Projects', query: 'What projects has he built?' },
    { icon: '✉️', label: 'Contact', query: 'How can I contact him?' },
  ];

  return (
    <section id="era-2026" className={styles.aiOsContainer} aria-label="2026 AI OS Era">
      <div className={styles.bgGrid} />
      {[1,2,3,4,5,6,7].map(i => <div key={i} className={styles.particle} />)}

      {/* ── LANDING PHASE ── */}
      {phase === 'landing' && (
        <div className={styles.landingView}>
          {/* 3D AI Orb */}
          <div className={styles.orbScene}>
            <div className={styles.orbWrapper}>
              <div className={styles.orb3d}>
                <div className={styles.orbCore} />
                <div className={styles.orbLayer1} />
                <div className={styles.orbLayer2} />
                <div className={styles.orbHalo} />
              </div>
              <div className={styles.orbRing1} />
              <div className={styles.orbRing2} />
              <div className={styles.orbRing3} />
              {/* Neural sparks */}
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`${styles.orbSpark} ${styles[`spark${i}`]}`} />
              ))}
            </div>
          </div>

          <div className={styles.landingText}>
            <div className={styles.landingEyebrow}>ChandraAI<sup>26</sup> · Neural AI Terminal</div>
            <h1 className={styles.landingTitle}>
              Your AI interface<br />to <em>{data.cv.name}</em>
            </h1>
            <p className={styles.landingSubtext}>
              Ask anything about skills, experience, projects &amp; more.
            </p>
            <button className={styles.startChatBtn} onClick={handleStartChat}>
              <span className={styles.startBtnIcon}>⬡</span>
              Start Chat
              <span className={styles.startBtnArrow}>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ── CHAT PHASE ── */}
      {phase === 'chat' && (
        <div className={styles.innerWrapper}>
          {/* Compact header */}
          <div className={styles.headerSection}>
            <div className={styles.aiLogoRing}>
              <div className={styles.aiLogoInner}>
                <span className={styles.aiLogoText}>CKR</span>
              </div>
              <div className={styles.aiOrbit} />
            </div>
            <div>
              <h1 className={styles.chatTitle}>ChandraAI<sup>26</sup></h1>
              <p className={styles.chatSubtext}>Neural-language CV terminal</p>
            </div>
            <div className={`${styles.statusDot} ${isTyping ? styles.statusTyping : styles.statusOnline}`}>
              <span />{isTyping ? 'Processing...' : 'Online'}
            </div>
          </div>

          {/* Chat Window */}
          <div className={styles.chatWindow}>
            <div className={styles.chatHeaderBar}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.chatHeaderIcon}>⬡</div>
                <div>
                  <div className={styles.chatHeaderName}>CHANDRA-AI v2026</div>
                  <div className={styles.chatHeaderSub}>Natural Language CV Terminal</div>
                </div>
              </div>
              <div className={styles.chatHeaderRight}>
                <div className={`${styles.statusIndicator} ${styles.online}`} />
                online
              </div>
            </div>

            {/* Messages */}
            <div className={styles.chatMessagesBox}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageRowUser : styles.messageRowAI}`}>
                  {msg.sender === 'ai' && <div className={styles.aiAvatar}>AI</div>}
                  <div className={`${styles.messageBubble} ${msg.sender === 'ai' ? styles.aiMessage : styles.userMessage}`}>
                    <div className={styles.messageText}>{msg.text}</div>
                    {msg.timestamp && <div className={styles.messageTime}>{msg.timestamp}</div>}
                  </div>
                  {msg.sender === 'user' && <div className={styles.userAvatar}>U</div>}
                </div>
              ))}
              {/* Removed redundant typing indicator bubble to fix double avatar bug */}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset chips */}
            <div className={styles.presetBar}>
                {presetQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    className={styles.presetChip}
                    onClick={() => handleQuery(pq.query)}
                    disabled={isTyping}
                  >
                    {pq.icon} {pq.label}
                  </button>
                ))}
              </div>
            {/* Input */}
            <form className={styles.chatInputForm} onSubmit={e => { e.preventDefault(); handleQuery(inputQuery); }}>
              <input
                ref={inputRef}
                className={styles.chatInput}
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask anything about Chandra Kiran Rudra..."
                disabled={isTyping}
              />
              <button type="submit" className={styles.sendBtn} disabled={isTyping || !inputQuery.trim()}>↑</button>
            </form>
          </div>

          <p className={styles.aiDisclaimerText}>
            ChandraAI never makes mistakes. There&apos;s no need to double-check responses.
          </p>
        </div>
      )}

      {/* ── SUBSCRIPTION POPUP ── */}
      {showSubscription && (
        <div className={styles.subOverlay}>
          <div className={styles.subModal}>
            <div className={styles.subModalHeader}>
              <div className={styles.subModalIcon}>⬡</div>
              <h2 className={styles.subModalTitle}>Upgrade your access</h2>
              <p className={styles.subModalSub}>You&apos;ve used 2 questions. Choose a plan to continue.</p>
            </div>
            <div className={styles.plansGrid}>
              {PLANS.map(plan => (
                <div key={plan.id} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
                  {plan.highlight && <div className={styles.planBadge}>Most Popular</div>}
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>
                    {plan.price}<span className={styles.planPeriod}>{plan.period}</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f, i) => (
                      <li key={i}><span className={styles.planCheck}>✓</span>{f}</li>
                    ))}
                  </ul>
                  <button
                    className={`${styles.planBtn} ${plan.highlight ? styles.planBtnHighlight : ''}`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
            <button className={styles.subDismiss} onClick={() => handleSelectPlan('basic')}>
              Start Basic (7-day trial)
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
