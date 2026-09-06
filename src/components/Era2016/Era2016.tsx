import React, { useState } from 'react';
import { CVData } from '../../types/cv';
import styles from './Era2016.module.css';
import { ExternalLink, Mail, MapPin, Phone, Github, Twitter, Heart, Send, Calendar, Briefcase, GraduationCap, Code } from 'lucide-react';

interface Era2016Props {
  data: CVData;
}

export const Era2016: React.FC<Era2016Props> = ({ data }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const featuredProject = data.projects.find(p => p.title.includes("To The Purest Soul"));
  const standardProjects = data.projects.filter(p => !p.title.includes("To The Purest Soul"));

  return (
    <div id="era-2016" className={styles.flat2016Wrapper} aria-label="2016 Flat Design Era">
      {/* 2016 Fixed Bootstrap Navbar */}
      <nav className={styles.flatNavbar}>
        <div className={styles.navContainer}>
          <a href="#hero-2016" className={styles.navBrand}>
            {data.cv.name} <span className={styles.yearTag}>2016</span>
          </a>
          <ul className={styles.navLinks}>
            <li><a href="#about-2016">About</a></li>
            <li><a href="#experience-2016">Experience</a></li>
            <li><a href="#education-2016">Education</a></li>
            <li><a href="#skills-2016">Skills</a></li>
            <li><a href="#projects-2016">Projects</a></li>
            <li><a href="#contact-2016">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Jumbotron Section */}
      <header id="hero-2016" className={styles.jumbotronHero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroGreeting}>Hi, I&apos;m {data.cv.name}.</h1>
          <h2 className={styles.heroSubheading}>{data.cv.title}</h2>
          <p className={styles.heroTagline}>&quot;This is not a portfolio. It&apos;s a time machine.&quot;</p>
          <div className={styles.heroButtons}>
            <a href="#contact-2016" className={styles.btnTeal}>
              Get in touch <Mail size={16} />
            </a>
            <a href="#projects-2016" className={styles.btnOutline}>
              Explore Featured Work
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className={styles.mainContainer}>
        {/* About Section */}
        <section id="about-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>About Me</h3>
            <div className={styles.sectionDivider} />
          </div>
          <div className={styles.aboutCard}>
            <p className={styles.aboutText}>{data.cv.about}</p>
            <div className={styles.quickMetrics}>
              <div className={styles.metricItem}>
                <MapPin className={styles.metricIcon} size={20} />
                <div>
                  <div className={styles.metricLabel}>Based In</div>
                  <div className={styles.metricValue}>{data.cv.location}</div>
                </div>
              </div>
              <div className={styles.metricItem}>
                <Briefcase className={styles.metricIcon} size={20} />
                <div>
                  <div className={styles.metricLabel}>Status</div>
                  <div className={styles.metricValue}>Open to Opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section id="experience-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Work Experience</h3>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.timelineList}>
            {data.jobs.map((job, idx) => (
              <div key={idx} className={styles.timelineCard}>
                <div className={styles.timelineBadge}>
                  <Calendar size={14} /> {job.period}
                </div>
                <h4 className={styles.jobRole}>{job.role}</h4>
                <div className={styles.jobOrg}>{job.org}</div>
                <p className={styles.jobDesc}>{job.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Education</h3>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.educationGrid}>
            {data.education.map((edu, idx) => (
              <div key={idx} className={styles.eduCard}>
                <GraduationCap className={styles.eduIcon} size={28} />
                <h4 className={styles.eduSchool}>{edu.school}</h4>
                <div className={styles.eduDetail}>{edu.detail}</div>
                <div className={styles.eduPeriod}>{edu.period}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Skills &amp; Technologies</h3>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.skillsPillsContainer}>
            {data.skills.map((skill, idx) => (
              <span key={idx} className={styles.flatSkillPill}>
                <Code size={14} /> {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Projects &amp; Portfolio</h3>
            <div className={styles.sectionDivider} />
          </div>

          {/* Featured Tribute Site Card */}
          {featuredProject && (
            <div className={styles.featuredProjectBanner}>
              <div className={styles.featuredBadgeRow}>
                <span className={styles.featuredTag}>
                  <Heart size={14} fill="#ffffff" /> Featured Tribute Story
                </span>
              </div>
              <h4 className={styles.featuredTitle}>{featuredProject.title}</h4>
              <p className={styles.featuredTagline}>{featuredProject.tagline}</p>
              <p className={styles.featuredDesc}>{featuredProject.desc}</p>
              <a
                href={featuredProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnTeal}
                style={{ marginTop: '12px' }}
              >
                Visit Live Site <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Grid of Standard Projects */}
          <div className={styles.projectsGrid}>
            {standardProjects.map((proj, idx) => (
              <div key={idx} className={styles.projectCard}>
                <h4 className={styles.projectTitle}>{proj.title}</h4>
                <div className={styles.projectTagline}>{proj.tagline}</div>
                <p className={styles.projectDesc}>{proj.desc}</p>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-2016" className={styles.sectionBlock}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Contact Me</h3>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.contactLayout}>
            <div className={styles.contactDetails}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#2c3e50' }}>Let&apos;s Connect</h4>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} size={20} />
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <a href={`mailto:${data.cv.email}`} className={styles.contactLink}>{data.cv.email}</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} size={20} />
                <div>
                  <div className={styles.contactLabel}>Phone</div>
                  <a href={`tel:${data.cv.phone}`} className={styles.contactLink}>{data.cv.phone}</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} size={20} />
                <div>
                  <div className={styles.contactLabel}>Location</div>
                  <div style={{ color: '#34495e', fontWeight: '500' }}>{data.cv.location}</div>
                </div>
              </div>

              <div className={styles.socialIconsRow}>
                <a href={data.social.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                  <Github size={22} />
                </a>
                <a href={data.social.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                  <Twitter size={22} />
                </a>
                <a href={data.cv.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <ExternalLink size={22} />
                </a>
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={handleContactSubmit}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input type="text" className={styles.formControl} placeholder="John Doe" required />
              </div>
              <div className={styles.formGroup}>
                <label>Your Email</label>
                <input type="email" className={styles.formControl} placeholder="john@example.com" required />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea className={styles.formControl} rows={4} placeholder="Hello Chandra Kiran..." required></textarea>
              </div>
              <button type="submit" className={styles.btnTeal} style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} /> Send Message
              </button>
              {contactSubmitted && (
                <div className={styles.alertSuccess}>
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* 2016 Footer */}
      <footer className={styles.flatFooter}>
        <p>&copy; 2016 {data.cv.name}. Built with Flat Design &amp; Bootstrap Aesthetics.</p>
      </footer>
    </div>
  );
};
