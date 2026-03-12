import React from 'react';
import { FileText, ShoppingBag, CreditCard, Truck, RotateCcw, AlertTriangle, Scale } from 'lucide-react';
import { SplitText, FadeIn } from '../components/common/AnimatedComponents';
import './Legal.css';

const sections = [
  {
    icon: <FileText size={22} />,
    title: 'General Terms',
    content: [
      'By accessing and using the Techorbit website, you accept and agree to be bound by these Terms & Conditions.',
      'We reserve the right to update or modify these terms at any time without prior notice. Continued use of the site constitutes acceptance of any changes.',
      'You must be at least 18 years old or have parental consent to use our services and make purchases.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
    ],
  },
  {
    icon: <ShoppingBag size={22} />,
    title: 'Products & Orders',
    content: [
      'All product descriptions, images, and specifications are provided for informational purposes and may vary slightly from the actual product.',
      'We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion due to pricing errors, stock issues, or suspected fraud.',
      'Prices are subject to change without notice. The price displayed at the time of order placement will be honored.',
      'Order confirmation emails serve as acknowledgment of your order, not acceptance. We reserve the right to cancel before shipment.',
    ],
  },
  {
    icon: <CreditCard size={22} />,
    title: 'Payment Terms',
    content: [
      'We accept major credit cards, debit cards, and other payment methods as displayed at checkout.',
      'All payments are processed securely through PCI DSS-compliant payment processors.',
      'You agree to provide accurate and complete payment information. Any fraudulent activity will result in order cancellation and possible legal action.',
      'Applicable taxes and shipping fees will be calculated and displayed during checkout before order confirmation.',
    ],
  },
  {
    icon: <Truck size={22} />,
    title: 'Shipping & Delivery',
    content: [
      'Estimated delivery times are approximate and may vary based on location, product availability, and carrier conditions.',
      'Techorbit is not responsible for delays caused by carriers, customs, weather, or other circumstances beyond our control.',
      'Risk of loss and title for items pass to you upon delivery to the carrier.',
      'It is your responsibility to ensure the shipping address provided is accurate and complete.',
    ],
  },
  {
    icon: <RotateCcw size={22} />,
    title: 'Returns & Refunds',
    content: [
      'Products may be returned within 30 days of delivery in their original condition and packaging.',
      'Refunds will be processed to the original payment method within 5-10 business days after we receive the returned item.',
      'Certain items such as personalized products, intimate apparel, and digital downloads are non-returnable.',
      'Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.',
    ],
  },
  {
    icon: <AlertTriangle size={22} />,
    title: 'Limitation of Liability',
    content: [
      'Techorbit shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.',
      'Our total liability for any claim shall not exceed the amount you paid for the specific product or service in question.',
      'We do not warrant that the website will be uninterrupted, secure, or error-free at all times.',
      'All content is provided "as is" without warranties of any kind, express or implied.',
    ],
  },
  {
    icon: <Scale size={22} />,
    title: 'Governing Law',
    content: [
      'These Terms & Conditions are governed by the laws of the State of California, United States.',
      'Any disputes shall be resolved through binding arbitration in San Francisco, CA, unless otherwise required by law.',
      'If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force.',
      'For any questions regarding these terms, please contact us at legal@techorbit.com.',
    ],
  },
];

export default function TermsConditions() {
  return (
    <div className="legal-page">
      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">Legal</span>
          </FadeIn>
          <h1 className="legal-hero__title">
            <SplitText type="words" stagger={0.06}>Terms & Conditions</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="legal-hero__sub">
              Please read these terms carefully before using our website and services.
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
              Welcome to Techorbit. These Terms & Conditions govern your use of our website, products, and services. By accessing or using our platform, you agree to comply with and be bound by these terms. If you do not agree, please refrain from using our services.
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
