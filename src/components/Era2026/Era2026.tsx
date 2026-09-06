import React, { useState } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2026.module.css';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface Era2026Props {
  data: CVData;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const Era2026: React.FC<Era2026Props> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Greetings! I am CHANDRA-AI v2026. I hold full access to ${data.cv.name}'s CV, work experience, and tech stack. Ask me anything!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [showPricingTrigger, setShowPricingTrigger] = useState(false);

  const handleQuery = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: queryText }
    ];
    setMessages(newMessages);
    setInputQuery('');
    setIsTyping(true);

    const q = queryText.toLowerCase();
    let fullResponse = "";

    if (q.includes("who") || q.includes("about") || q.includes("chandra") || q.includes("rudra")) {
      fullResponse = `${data.cv.name} is a ${data.cv.title} based in ${data.cv.location}.\n\n${data.cv.about}`;
    } else if (q.includes("hpe") || q.includes("intern") || q.includes("job") || q.includes("work")) {
      fullResponse = `Work Experience Summary:\n\n` + data.jobs.map(j => `• ${j.role} @ ${j.org} (${j.period}): ${j.desc}`).join("\n\n");
    } else if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
      fullResponse = `${data.cv.name}'s Core Skills include:\n\n` + data.skills.map(s => `• ${s}`).join("\n");
    } else if (q.includes("contact") || q.includes("email") || q.includes("reach")) {
      fullResponse = `You can reach ${data.cv.name} via Email at ${data.cv.email} or LinkedIn: ${data.cv.linkedinUrl}.`;
    } else {
      fullResponse = `Neural Query Match: ${data.cv.name} is a ${data.cv.title}. Tagline: "${data.cv.tagline}". Key skills: ${data.skills.slice(0, 6).join(", ")}. Feel free to ask about his work at HPE or Briks!`;
    }

    // Typewriter streaming effect
    let currentLength = 0;
    const aiMessageIndex = newMessages.length;

    setMessages([...newMessages, { sender: 'ai', text: '' }]);

    const interval = setInterval(() => {
      currentLength += 4;
      if (currentLength >= fullResponse.length) {
        currentLength = fullResponse.length;
        clearInterval(interval);
        setIsTyping(false);

        // Trigger pricing modal after 2 chat messages!
        if (newCount === 2) {
          setTimeout(() => {
            setShowPricingTrigger(true);
          }, 600);
        }
      }
      setMessages((prev) => {
        const updated = [...prev];
        updated[aiMessageIndex] = {
          sender: 'ai',
          text: fullResponse.slice(0, currentLength)
        };
        return updated;
      });
    }, 20);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(inputQuery);
  };

  return (
    <section id="era-2026" className={styles.aiOsContainer} aria-label="2026 AI OS Era">
      <div className={styles.innerWrapper}>
        {/* Minimalist Header with 3D Revolving Center Icon */}
        <div className={styles.headerSection}>
          <div className={styles.revolvingIconContainer}>
            <div className={styles.revolvingCube}>
              <div className={styles.cubeFace} style={{ transform: 'translateZ(40px)' }}>AI</div>
              <div className={styles.cubeFace} style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>OS</div>
              <div className={styles.cubeFace} style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}>CKR</div>
              <div className={styles.cubeFace} style={{ transform: 'rotateY(90deg) translateZ(40px)' }}>2026</div>
              <div className={styles.cubeFace} style={{ transform: 'rotateX(90deg) translateZ(40px)' }}>⚡</div>
              <div className={styles.cubeFace} style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}>❖</div>
            </div>
          </div>

          <h1 className={styles.chatTitle}>{data.cv.name} AI Terminal</h1>
          <p className={styles.chatSubtext}>Minimalist Natural Language Chat Interface</p>
        </div>

        {/* Clean Chatbox Terminal */}
        <div className={styles.chatWindow}>
          <div className={styles.chatHeaderBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} /> CHANDRA-AI v2026 TERMINAL
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {isTyping ? "TYPING..." : "ONLINE"}
            </div>
          </div>

          <div className={styles.chatMessagesBox}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.messageBubble} ${
                  msg.sender === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                {msg.sender === 'ai' && (
                  <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: '#555' }}>
                    <Sparkles size={12} /> CHANDRA AI:
                  </div>
                )}
                {msg.text}
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className={styles.presetBar}>
            <button className={styles.presetChip} onClick={() => handleQuery("Who is Chandra Kiran Rudra?")}>
              👤 Who is Chandra Kiran?
            </button>
            <button className={styles.presetChip} onClick={() => handleQuery("Tell me about HPE Internship")}>
              💼 HPE Internship & AI
            </button>
            <button className={styles.presetChip} onClick={() => handleQuery("What are his top skills?")}>
              ⚡ Technical Skills
            </button>
            <button className={styles.presetChip} onClick={() => handleQuery("How to contact him?")}>
              ✉️ Contact Info
            </button>
          </div>

          {/* Chat Form */}
          <form className={styles.chatInputForm} onSubmit={handleFormSubmit}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Ask the AI Terminal anything about Chandra Kiran Rudra..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className={styles.sendBtn} disabled={isTyping}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Pricing Modal Triggered After 2 Chat Queries */}
      {showPricingTrigger && (
        <div className={styles.pricingModalOverlay} onClick={() => setShowPricingTrigger(false)}>
          <div className={styles.pricingModalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>AI OS Access Tier Unlocked</h3>
              <button onClick={() => setShowPricingTrigger(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', marginBottom: '20px' }}>
              You have completed 2 chat queries with CHANDRA-AI! Select a parody pricing option to continue:
            </p>

            <div style={{ background: '#f5f5f5', border: '2px solid #000', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>🆓 Human Viewer Tier: $0 / mo</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Full visual access to Chandra Kiran Rudra's credentials.
              </div>
            </div>

            <div style={{ background: '#000', color: '#fff', border: '2px solid #000', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>⚡ Quantum Hiring Tier: 1 Job Offer</div>
              <div style={{ fontSize: '13px', color: '#ccc', marginTop: '4px' }}>
                Instant deployment of Chandra Kiran Rudra to your engineering team.
              </div>
            </div>

            <button className={styles.sendBtn} style={{ width: '100%', padding: '12px 0', fontSize: '14px' }} onClick={() => setShowPricingTrigger(false)}>
              Continue Chatting
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
