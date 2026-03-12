import React from 'react';
import { Shield, Eye, Lock, Database, Bell, UserCheck, Mail } from 'lucide-react';
import { SplitText, FadeIn } from '../components/common/AnimatedComponents';
import './Legal.css';

const sections = [
  {
    icon: <Database size={22} />,
    title: 'Information We Collect',
    content: [
      'Personal information (name, email address, phone number) when you create an account or place an order.',
      'Payment information (credit card details, billing address) processed securely through our payment partners.',
      'Browsing data (pages visited, products viewed, search queries) to improve your shopping experience.',
      'Device information (IP address, browser type, operating system) for security and analytics purposes.',
    ],
  },
  {
    icon: <Eye size={22} />,
    title: 'How We Use Your Information',
    content: [
      'To process and fulfill your orders, including shipping and delivery notifications.',
      'To personalize your shopping experience with relevant product recommendations.',
      'To communicate with you about your account, orders, and promotional offers.',
      'To improve our website, products, and services based on your feedback and usage patterns.',
      'To detect and prevent fraud, unauthorized access, and other security threats.',
    ],
  },
  {
    icon: <Lock size={22} />,
    title: 'Data Security',
    content: [
      'We use industry-standard SSL/TLS encryption to protect data transmitted between your browser and our servers.',
      'Payment information is processed through PCI DSS-compliant payment processors and is never stored on our servers.',
      'Access to personal data is restricted to authorized personnel who need it to perform their job functions.',
      'We regularly audit our security practices and update our systems to address potential vulnerabilities.',
    ],
  },
  {
    icon: <UserCheck size={22} />,
    title: 'Your Rights & Choices',
    content: [
      'You can access, update, or delete your personal information through your account settings at any time.',
      'You may opt out of marketing communications by clicking the unsubscribe link in any promotional email.',
      'You can request a copy of all personal data we hold about you by contacting our support team.',
      'You have the right to request data portability or restriction of processing under applicable laws.',
    ],
  },
  {
    icon: <Bell size={22} />,
    title: 'Cookies & Tracking',
    content: [
      'We use essential cookies to enable basic site functionality such as user login and cart management.',
      'Analytics cookies help us understand how visitors interact with our website to improve the user experience.',
      'You can manage cookie preferences through your browser settings at any time.',
      'We do not sell your personal data to third-party advertisers.',
    ],
  },
  {
    icon: <Mail size={22} />,
    title: 'Contact Us',
    content: [
      'If you have any questions about this Privacy Policy, please contact us at privacy@techorbit.com.',
      'You can also write to us at: Techorbit Co., 123 Tech Avenue, San Francisco, CA 94105.',
      'We will respond to all privacy-related inquiries within 30 business days.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">Legal</span>
          </FadeIn>
          <h1 className="legal-hero__title">
            <SplitText type="words" stagger={0.06}>Privacy Policy</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="legal-hero__sub">
              Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="legal-hero__date">Last updated: February 24, 2026</p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="legal-content section">
        <div className="legal-intro">
          <FadeIn>
            <p>
              At Techorbit, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes our practices regarding the collection, use, and disclosure of information when you use our website and services.
            </p>
          </FadeIn>
        </div>

        <div className="legal-sections">
          {sections.map((sec, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="legal-section-card">
                <div className="legal-section-card__header">
                  <div className="legal-section-card__icon">{sec.icon}</div>
                  <h2>{sec.title}</h2>
                </div>
                <ul className="legal-section-card__list">
                  {sec.content.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
