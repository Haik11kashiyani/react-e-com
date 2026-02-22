import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line -- used as motion.div in JSX
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Check } from 'lucide-react';
import { validateEmail, validateName, validateRequired } from '../utils/validation';
import { SplitText, FadeIn, RevealText, StaggerContainer } from '../components/common/AnimatedComponents';
import { staggerItem } from '../components/common/animationVariants';
import './Contact.css';

const contactInfo = [
  { icon: <Mail size={22} />, title: 'Email Us', detail: 'support@virtualware.com', sub: 'We reply within 24 hours' },
  { icon: <Phone size={22} />, title: 'Call Us', detail: '+1 (555) 123-4567', sub: 'Mon-Fri, 9am-6pm EST' },
  { icon: <MapPin size={22} />, title: 'Visit Us', detail: '123 Tech Avenue, SF, CA', sub: 'Open for appointments' },
  { icon: <Clock size={22} />, title: 'Business Hours', detail: 'Mon - Fri: 9am - 6pm', sub: 'Weekends: 10am - 4pm' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    let error = null;
    if (name === 'name') error = validateName(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'subject') error = validateRequired(value, 'Subject');
    if (name === 'message') error = validateRequired(value, 'Message');
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const subjectErr = validateRequired(formData.subject, 'Subject');
    const messageErr = validateRequired(formData.message, 'Message');

    setErrors({ name: nameErr, email: emailErr, subject: subjectErr, message: messageErr });
    setTouched({ name: true, email: true, subject: true, message: true });

    if (!nameErr && !emailErr && !subjectErr && !messageErr) {
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">Contact Us</span>
          </FadeIn>
          <h1 className="contact-hero__title">
            <SplitText type="words" stagger={0.06}>Let's Start a Conversation</SplitText>
          </h1>
          <FadeIn delay={0.5}>
            <p className="contact-hero__sub">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Info Cards */}
      <StaggerContainer className="contact-info-grid section-sm" stagger={0.12}>
        {contactInfo.map((info, i) => (
          <motion.div key={i} variants={staggerItem} className="contact-info-card">
            <div className="contact-info-card__icon">{info.icon}</div>
            <h3>{info.title}</h3>
            <p className="contact-info-card__detail">{info.detail}</p>
            <span className="contact-info-card__sub">{info.sub}</span>
          </motion.div>
        ))}
      </StaggerContainer>

      {/* Form Section */}
      <section className="contact-form-section section">
        <div className="contact-form-grid">
          {/* Left info */}
          <div className="contact-form-left">
            <FadeIn>
              <span className="eyebrow-tag">Write to Us</span>
            </FadeIn>
            <RevealText delay={0.1}>
              <h2 className="section-heading">Send Us a Message</h2>
            </RevealText>
            <FadeIn delay={0.3}>
              <p className="contact-form-left__desc">
                Fill out the form and our team will get back to you within 24 hours. We value every message and strive to provide thoughtful, helpful responses.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="contact-form-left__features">
                <div className="contact-feature">
                  <MessageCircle size={18} />
                  <span>Typically respond within hours</span>
                </div>
                <div className="contact-feature">
                  <Send size={18} />
                  <span>Direct line to our support team</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form */}
          <FadeIn delay={0.2} direction="right">
            <div className="contact-form-card">
              {submitted ? (
                <motion.div
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="contact-success__icon"><Check size={28} /></div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="pill-btn pill-btn-primary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); setTouched({}); }}>
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form__row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={touched.name && errors.name ? 'error' : ''}
                        placeholder="Your name"
                      />
                      {touched.name && errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={touched.email && errors.email ? 'error' : ''}
                        placeholder="you@example.com"
                      />
                      {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.subject && errors.subject ? 'error' : ''}
                      placeholder="How can we help?"
                    />
                    {touched.subject && errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.message && errors.message ? 'error' : ''}
                      placeholder="Tell us more about what you need..."
                    />
                    {touched.message && errors.message && <span className="error-message">{errors.message}</span>}
                  </div>
                  <button type="submit" className="pill-btn pill-btn-primary contact-submit">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Map */}
      <section className="contact-map">
        <FadeIn>
          <div className="contact-map__inner">
            <div className="contact-map__placeholder">
              <MapPin size={40} />
              <span>123 Tech Avenue, San Francisco, CA 94105</span>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
