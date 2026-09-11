import React, { useState, useEffect } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era1996.module.css';

interface Era1996Props {
  data: CVData;
}

export const Era1996: React.FC<Era1996Props> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<string>('ABOUT');
  const [isHacked, setIsHacked] = useState(false);
  const [hackedCountdown, setHackedCountdown] = useState(4);
  const [guestName, setGuestName] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const [guestEntries, setGuestEntries] = useState<{ name: string; msg: string; date: string }[]>([
    { name: 'Neo99', msg: 'Awesome retro 90s webpage! Subscribed to your web ring.', date: '12-MAY-1996' },
    { name: 'WebSurfer96', msg: 'Great portfolio! Bookmark added to Netscape bookmarks.', date: '04-AUG-1996' }
  ]);

  const triggerHackedAnimation = () => {
    setIsHacked(true);
    setHackedCountdown(4);
  };

  useEffect(() => {
    if (!isHacked) return;

    const timer = setInterval(() => {
      setHackedCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsHacked(false);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isHacked]);

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMsg.trim()) return;
    setGuestEntries([
      { name: guestName.trim(), msg: guestMsg.trim(), date: '06-SEP-1996' },
      ...guestEntries
    ]);
    setGuestName('');
    setGuestMsg('');
  };

  return (
    <section id="era-1996" className={styles.geoCitiesContainer} aria-label="1996 GeoCities Era">
      {/* HACKED SCREEN OVERLAY */}
      {isHacked && (
        <div className={styles.hackedOverlay}>
          <div className={styles.hackedTitle}>⚠️ SYSTEM HACKED! ⚠️</div>
          <div className={styles.hackedMsg}>
            &quot;YOU HAVE BEEN HACKED!<br />
            REDIRECTING TO YOUR DESTINY...<br />
            YOU ARE GOING TO HIRE {data.cv.name.toUpperCase()}!&quot;
          </div>
          <div style={{ fontSize: '18px', color: '#00ffff', marginTop: '30px' }}>
            REDIRECTING BACK TO WEBSITE IN {hackedCountdown} SECONDS...
          </div>
        </div>
      )}

      {/* Netscape Navigator Browser Window Wrapper */}
      <div className={styles.netscapeWindow}>
        {/* Title Bar */}
        <div className={styles.netscapeTitleBar}>
          <div>Netscape Navigator - [{data.cv.name}&apos;s Web Realm 1996]</div>
          <div className={styles.titleControls}>
            <button className={styles.winBtn}>_</button>
            <button className={styles.winBtn}>□</button>
            <button className={styles.winBtn}>X</button>
          </div>
        </div>

        {/* Inner Wrapper */}
        <div className={styles.innerWrapper}>
          {/* Animated Marquee Banner */}
          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeText}>
              ★ WELCOME TO {data.cv.name.toUpperCase()}&apos;S OFFICIAL 1996 GEOCITIES HOMEPAGE! BEST VIEWED IN NETSCAPE NAVIGATOR 3.0 AT 800x600 RESOLUTION! ★
            </div>
          </div>

          {/* FIRE BAR — matching Pedro Belleza 1996 */}
          <div className={styles.fireBar}>
            {'🔥'.repeat(28)}
          </div>

          {/* Hero Title Banner */}
          <header className={styles.geocitiesHeader}>
            <h1 className={styles.geocitiesHeading}>
              🔥 {data.cv.name}&apos;s World 96 🔥
            </h1>
            <div className={styles.subHeading}>~ This is not a portfolio. It&apos;s a time machine. ~</div>
            <div className={styles.locationTag}>
              📍 <b>Location:</b> {data.cv.location}
            </div>
          </header>

          {/* Authentic 2-Column GeoCities Layout (Left Navigation Box + Right Main Content) */}
          <div className={styles.twoColumnLayout}>
            {/* LEFT COLUMN NAVIGATION BOX */}
            <aside className={styles.leftColumnNav}>
              <div className={styles.leftNavTitle}>★ NAVIGATION ★</div>
              <div className={styles.pushNavStack}>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'ABOUT' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('ABOUT')}
                >
                  [ About Me ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'WORK' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('WORK')}
                >
                  [ Where I&apos;ve Worked ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'EDU' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('EDU')}
                >
                  [ School Daze ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'SKILLS' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('SKILLS')}
                >
                  [ Skills &amp; Tools ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'PROJECTS' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('PROJECTS')}
                >
                  [ My Projects ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'CONTACT' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('CONTACT')}
                >
                  [ Contact Me ]
                </button>
                <button
                  className={`${styles.pushNavBtn} ${activeSection === 'GUESTBOOK' ? styles.pushNavBtnActive : ''}`}
                  onClick={() => setActiveSection('GUESTBOOK')}
                >
                  [ Sign Guestbook ]
                </button>
              </div>

              {/* GeoCities Retro Badges & Construction Block */}
              <div className={styles.leftNavBadges}>
                <div className={styles.constructionBadge}>
                  🚧 UNDER CONSTRUCTION 🚧
                </div>
                <div className={styles.hitCounter}>
                  VISITOR HITS: 004,892
                </div>
              </div>

              {/* WARNING DIALOGUE BUTTON */}
              <div className={styles.warningBox}>
                <div style={{ color: '#ffff00', fontWeight: 'bold', fontSize: '12px' }}>
                  ⚠️ WARNING DIALOGUE ⚠️
                </div>
                <button className={styles.dontClickBtn} onClick={triggerHackedAnimation}>
                  DO NOT CLICK THIS WARNING DIALOGUE (SERIOUSLY!)
                </button>
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT COLUMN */}
            <main className={styles.mainContentColumn}>
              {activeSection === 'ABOUT' && (
                <div className={styles.sectionBox}>
                  <h2>★ About {data.cv.name}</h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{data.cv.about}</p>
                  <div style={{ color: '#000080', marginTop: '14px', fontStyle: 'italic', fontWeight: 'bold' }}>
                    Note: &quot;This is not a portfolio. It&apos;s a time machine.&quot;
                  </div>
                </div>
              )}

              {activeSection === 'WORK' && (
                <div className={styles.sectionBox}>
                  <h2>💼 Work Experience</h2>
                  {data.jobs.map((job, idx) => (
                    <div key={idx} className={styles.itemCard}>
                      <h3 style={{ margin: '0 0 4px 0', color: '#000080' }}>{job.role} @ {job.org}</h3>
                      <div style={{ color: '#555', fontSize: '12px', fontWeight: 'bold' }}>{job.period}</div>
                      <p style={{ marginTop: '6px', fontSize: '14px' }}>{job.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'EDU' && (
                <div className={styles.sectionBox}>
                  <h2>🎓 School Daze (Education)</h2>
                  {data.education.map((edu, idx) => (
                    <div key={idx} className={styles.itemCard}>
                      <h3 style={{ margin: '0 0 4px 0', color: '#000080' }}>{edu.school}</h3>
                      <div>{edu.detail} ({edu.period})</div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'SKILLS' && (
                <div className={styles.sectionBox}>
                  <h2>⚡ Technical &amp; Creative Skills</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className={styles.skillPill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'PROJECTS' && (
                <div className={styles.sectionBox}>
                  <h2>🚀 Featured Projects</h2>
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className={styles.itemCard}>
                      <h3 style={{ color: '#000080', margin: '0 0 4px 0' }}>{proj.title}</h3>
                      <div style={{ color: '#555', fontStyle: 'italic', marginBottom: '6px' }}>{proj.tagline}</div>
                      <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>{proj.desc}</p>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtn}>
                          👉 CLICK HERE TO VISIT LIVE SITE 👈
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'CONTACT' && (
                <div className={styles.sectionBox}>
                  <h2>✉️ Contact {data.cv.name}</h2>
                  <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <div><b>Email:</b> <a href={`mailto:${data.cv.email}`} style={{ color: '#0000ff' }}>{data.cv.email}</a></div>
                    <div><b>Phone:</b> <a href={`tel:${data.cv.phone}`} style={{ color: '#0000ff' }}>{data.cv.phone}</a></div>
                    <div><b>LinkedIn:</b> <a href={data.cv.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff' }}>{data.cv.linkedinUrl}</a></div>
                  </div>
                </div>
              )}

              {activeSection === 'GUESTBOOK' && (
                <div className={styles.sectionBox}>
                  <h2 style={{ color: '#ff00ff', margin: '0 0 14px 0' }}>📖 Sign My 1996 Guestbook</h2>
                  <form onSubmit={handleGuestbookSubmit} className={styles.guestbookForm}>
                    <input
                      type="text"
                      placeholder="Your Webhandle / Name"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className={styles.guestInput}
                      required
                    />
                    <textarea
                      placeholder="Your Guestbook Message..."
                      value={guestMsg}
                      onChange={e => setGuestMsg(e.target.value)}
                      className={styles.guestInput}
                      rows={3}
                      required
                    />
                    <button type="submit" className={styles.submitGuestBtn}>
                      ✍️ POST GUESTBOOK ENTRY
                    </button>
                  </form>

                  <div className={styles.guestEntriesList}>
                    {guestEntries.map((entry, idx) => (
                      <div key={idx} className={styles.guestEntryCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffff00', fontWeight: 'bold' }}>
                          <span>👤 {entry.name}</span>
                          <span style={{ fontSize: '12px', color: '#ff00ff' }}>{entry.date}</span>
                        </div>
                        <p style={{ color: '#ffffff', margin: '6px 0 0 0', fontSize: '14px' }}>{entry.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>

          <footer className={styles.geocitiesFooter}>
            Copyright © 1996 {data.cv.name}. All Rights Reserved. Hosted on GeoCities Neighborhoods.
          </footer>
        </div>
      </div>
    </section>
  );
};
