import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line -- used as motion.div in JSX
import { Users, Award, Globe, Zap, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitText, FadeIn, RevealText, ScaleIn, HorizontalLine, StaggerContainer } from '../components/common/AnimatedComponents';
import { staggerItem } from '../components/common/animationVariants';
import { useCountUp } from '../hooks/useAnimations';
import './About.css';

const values = [
  { icon: <Zap size={24} />, title: 'Innovation First', desc: 'We curate only the most forward-thinking products that push boundaries.' },
  { icon: <Heart size={24} />, title: 'Customer Obsessed', desc: 'Every decision we make starts with how it impacts your experience.' },
  { icon: <Globe size={24} />, title: 'Global Reach', desc: 'Serving customers across 50+ countries with lightning-fast delivery.' },
  { icon: <Award size={24} />, title: 'Quality Promise', desc: 'Every product passes our rigorous 50-point quality inspection.' },
];

const team = [
  { name: 'Alex Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { name: 'Sarah Kim', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  { name: 'Marcus Johnson', role: 'CTO', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { name: 'Emily Rivera', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop' },
];

function StatCounter({ end, suffix = '', label }) {
  const [ref, count] = useCountUp(end, 2000);
  return (
    <div ref={ref} className="about-stat">
      <span className="about-stat__num">{count.toLocaleString()}{suffix}</span>
      <span className="about-stat__label">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">About Us</span>
          </FadeIn>
          <h1 className="about-hero__title">
            <SplitText type="words" stagger={0.06}>We Build the Future of Shopping</SplitText>
          </h1>
          <FadeIn delay={0.5}>
            <p className="about-hero__sub">
              Born from a passion for technology and design, Techorbit connects people with the products that define tomorrow.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.6}>
          <div className="about-hero__img">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop" alt="Team at work" />
          </div>
        </FadeIn>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <StatCounter end={50000} suffix="+" label="Happy Customers" />
        <StatCounter end={500} suffix="+" label="Products Curated" />
        <StatCounter end={50} suffix="+" label="Countries Served" />
        <StatCounter end={99} suffix="%" label="Satisfaction Rate" />
      </section>

      <HorizontalLine />

      {/* Story */}
      <section className="about-story section">
        <div className="about-story__grid">
          <div className="about-story__text">
            <FadeIn>
              <span className="eyebrow-tag">Our Story</span>
            </FadeIn>
            <RevealText delay={0.1}>
              <h2 className="section-heading">From a Garage to a Global Brand</h2>
            </RevealText>
            <FadeIn delay={0.3}>
              <p>
                It started in 2020 with a simple idea: technology shopping should feel exciting, not exhausting. We were tired of cluttered marketplaces and cookie-cutter experiences.
              </p>
              <p>
                So we built Techorbit — a curated destination where every product is handpicked, every detail is considered, and every customer interaction feels premium. Today, we're proud to serve over 50,000 customers worldwide.
              </p>
              <p>
                Our team of designers, engineers, and product specialists work together to ensure that every aspect of your experience — from browsing to unboxing — is nothing short of exceptional.
              </p>
            </FadeIn>
          </div>
          <ScaleIn delay={0.2}>
            <div className="about-story__img img-hover-zoom">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=700&fit=crop" alt="Our workspace" />
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Values */}
      <section className="about-values section">
        <div className="about-values__header">
          <FadeIn>
            <span className="eyebrow-tag">Core Values</span>
          </FadeIn>
          <RevealText delay={0.1}>
            <h2 className="section-heading">What Drives Us Forward</h2>
          </RevealText>
        </div>
        <StaggerContainer className="about-values__grid" stagger={0.15}>
          {values.map((v, i) => (
            <motion.div key={i} variants={staggerItem} className="about-value-card">
              <div className="about-value-card__icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </section>

      {/* Team */}
      <section className="about-team section">
        <div className="about-team__header">
          <FadeIn>
            <span className="eyebrow-tag">Meet the Team</span>
          </FadeIn>
          <RevealText delay={0.1}>
            <h2 className="section-heading">The People Behind the Brand</h2>
          </RevealText>
        </div>
        <StaggerContainer className="about-team__grid" stagger={0.12}>
          {team.map((member, i) => (
            <motion.div key={i} variants={staggerItem} className="about-team-card">
              <div className="about-team-card__img img-hover-zoom">
                <img src={member.img} alt={member.name} />
              </div>
              <h4>{member.name}</h4>
              <span>{member.role}</span>
            </motion.div>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <FadeIn>
          <div className="about-cta__inner">
            <h2>Ready to Experience the Difference?</h2>
            <p>Join 50,000+ customers who already shop smarter with Techorbit.</p>
            <div className="about-cta__btns">
              <Link to="/products" className="pill-btn pill-btn-green">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="pill-btn pill-btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
