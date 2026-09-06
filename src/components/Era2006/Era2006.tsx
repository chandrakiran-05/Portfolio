import React, { useState } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2006.module.css';

interface Era2006Props {
  data: CVData;
}

export const Era2006: React.FC<Era2006Props> = ({ data }) => {
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const flickrPhotos = [
    { title: "Python Code", tag: "AI/DEV" },
    { title: "Desk Setup", tag: "WORK" },
    { title: "AI Agents", tag: "OPENCLAW" },
    { title: "Video Edit", tag: "CREATIVE" },
    { title: "Storytelling", tag: "MUMMA" },
    { title: "Design Lab", tag: "UI/UX" }
  ];

  return (
    <section id="era-2006" className={styles.web2006Container} aria-label="2006 Web 2.0 Era">
      <div className={styles.innerWrapper}>
        {/* Site of the Day Badge */}
        <div className={styles.siteOfTheDayRibbon}>
          ★ CSS Gallery: Site of the Day
        </div>

        {/* Glossy Web 2.0 Header */}
        <header className={styles.glossyHeader}>
          <h1 className={styles.siteTitle}>{data.cv.name}</h1>
          <div className={styles.siteTagline}>{data.cv.title} — {data.cv.tagline}</div>
        </header>

        {/* Glossy Nav Bar */}
        <nav className={styles.glossyNav}>
          <a href="#w-about" className={styles.navItem}>About</a>
          <a href="#w-exp" className={styles.navItem}>Experience</a>
          <a href="#w-edu" className={styles.navItem}>Education</a>
          <a href="#w-projects" className={styles.navItem}>Projects</a>
          <a href="#w-contact" className={styles.navItem}>Contact</a>
        </nav>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Main Column */}
          <main>
            {/* About Post */}
            <article id="w-about" className={styles.blogPostCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>Welcome to My Web 2.0 Hub</h2>
                <div className={styles.postDate}>Posted on October 14, 2006 by {data.cv.name}</div>
              </div>
              <p>{data.cv.about}</p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                <strong style={{ color: '#166534' }}>Current Location:</strong> {data.cv.location}
              </div>
            </article>

            {/* Experience Post */}
            <article id="w-exp" className={styles.blogPostCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>Work & Experience Blog</h2>
                <div className={styles.postDate}>Career Timeline</div>
              </div>
              {data.jobs.map((job, idx) => (
                <div key={idx} style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: idx < data.jobs.length - 1 ? '1px dashed #cbd5e1' : 'none' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#1d4ed8' }}>{job.role} @ {job.org}</h3>
                  <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {job.period}
                  </span>
                  <p style={{ marginTop: '8px', color: '#475569' }}>{job.desc}</p>
                </div>
              ))}
            </article>

            {/* Education Post */}
            <article id="w-edu" className={styles.blogPostCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>Academic Credentials</h2>
                <div className={styles.postDate}>SRM University</div>
              </div>
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a' }}>{edu.school}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{edu.detail} ({edu.period})</p>
                </div>
              ))}
            </article>

            {/* Projects Post */}
            <article id="w-projects" className={styles.blogPostCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>Featured Web 2.0 Applications</h2>
                <div className={styles.postDate}>Showcase</div>
              </div>
              {data.projects.map((proj, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1d4ed8' }}>{proj.title}</h3>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', marginBottom: '6px' }}>{proj.tagline}</div>
                  <p style={{ fontSize: '14px', color: '#475569', marginBottom: '10px' }}>{proj.desc}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      Launch Application ↗
                    </a>
                  )}
                </div>
              ))}
            </article>
          </main>

          {/* Sidebar */}
          <aside>
            {/* RSS Widget */}
            <div className={styles.sidebarWidget} style={{ textAlign: 'center' }}>
              <a href="#rss" className={styles.rssButton} onClick={(e) => { e.preventDefault(); alert('RSS 2.0 Feed Subscribed!'); }}>
                📡 Subscribe via RSS 2.0
              </a>
            </div>

            {/* Skill Tag Cloud with Dynamic Weights */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Weighted Skill Tag Cloud</h3>
              <div className={styles.tagCloud}>
                {data.skills.map((skill, idx) => {
                  const fontSize = 11 + (idx % 5) * 2;
                  return (
                    <span key={idx} className={styles.tagCloudItem} style={{ fontSize: `${fontSize}px` }}>
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Flickr Photo Stream Grid */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Flickr Stream [Click to View]</h3>
              <div className={styles.flickrGrid}>
                {flickrPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={styles.flickrThumb}
                    onClick={() => setLightboxImage(photo.title)}
                  >
                    {photo.tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Blogroll Widget */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Blogroll Links</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#2563eb', fontSize: '13px' }}>
                <li><a href="https://techcrunch.com" target="_blank" rel="noopener noreferrer">TechCrunch</a></li>
                <li><a href="https://digg.com" target="_blank" rel="noopener noreferrer">Digg Web2.0</a></li>
                <li><a href="https://slashdot.org" target="_blank" rel="noopener noreferrer">Slashdot News</a></li>
              </ul>
            </div>

            {/* Contact Widget */}
            <div id="w-contact" className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Get In Touch</h3>
              <p style={{ fontSize: '13px', color: '#475569' }}>
                Email: <a href={`mailto:${data.cv.email}`} style={{ color: '#2563eb', fontWeight: 'bold' }}>{data.cv.email}</a>
              </p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', padding: '20px', textAlign: 'center' }}>
          <div className={styles.w3cBadges}>
            <span className={styles.w3cBadge}>W3C XHTML 1.0 STRICT</span>
            <span className={styles.w3cBadge}>W3C CSS VALID</span>
            <span className={styles.w3cBadge}>RSS 2.0 FEED</span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
            Designed in Web 2.0 style. Powered by React & CSS Modules.
          </p>
        </footer>
      </div>

      {/* Flickr Lightbox Modal */}
      {lightboxImage && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImage(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#1e3a8a', margin: '0 0 10px 0' }}>Flickr Photo Preview</h3>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', height: '180px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold', marginBottom: '14px' }}>
              📷 {lightboxImage}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Snapshot from {data.cv.name}'s creative engineering & media workflow.
            </p>
            <button className={styles.cookieBtn} onClick={() => setLightboxImage(null)}>
              Close Lightbox
            </button>
          </div>
        </div>
      )}

      {/* Pedrobelleza Satirical Cookie Banner */}
      {!cookieAccepted && (
        <div className={styles.cookieBanner}>
          <div>
            🍪 <b>Cookie Policy:</b> We use cookies to remember which decade you're visiting, how you take your coffee, and the precise moment you stopped reading this sentence. You can't opt out, but we've generously provided some choices.
          </div>
          <button className={styles.cookieBtn} onClick={() => setCookieAccepted(true)}>
            You Must Accept
          </button>
        </div>
      )}
    </section>
  );
};
