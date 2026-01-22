import React, { useState } from "react";

function Footer() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreePolicy) {
      console.log("Subscribed:", { firstName, email });
      // Handle subscription logic
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter & Links Section */}
      <div className="footer-top">
        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Subscribe to the Newsletter</h3>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="email"
                placeholder="yourname@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="newsletter-bottom">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                />
                <span className="checkmark"></span>
                I agree to the <a href="#privacy">Privacy Policy</a>
              </label>
              <button type="submit" className="btn-subscribe">
                Get updates
              </button>
            </div>
          </form>
        </div>

        {/* Links Columns */}
        <div className="footer-links">
          <div className="link-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#vault">The Vault</a></li>
              <li><a href="#course">Page Transition Course <span className="badge">NEW</span></a></li>
              <li><a href="#icons">Icon Library</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#easings" className="muted">Easings <span className="badge-soon">SOON</span></a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4>Community</h4>
            <ul>
              <li><a href="#showcase">Showcase</a></li>
              <li><a href="#about">About Virtual Ware</a></li>
              <li><a href="#slack">Slack Community</a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4>Membership</h4>
            <ul>
              <li><a href="#updates">Updates</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Buttons & Social */}
      <div className="footer-cta">
        <div className="cta-buttons">
          <button className="btn-login">Login</button>
          <button className="btn-join">Join Now</button>
        </div>
        <div className="social-icons">
          <a href="#linkedin" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#instagram" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#twitter" aria-label="X">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
        </div>
      </div>

      {/* Big Brand Text */}
      <div className="footer-brand">
        <span className="brand-text">VIRTUAL WARE</span>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-legal-links">
          <a href="#licensing">LICENSING</a>
          <a href="#terms">T&Cs</a>
          <a href="#privacy">PRIVACY</a>
          <a href="#cookies">COOKIES</a>
        </div>
        <p className="copyright">© 2026 VIRTUAL WARE CO.</p>
        <div className="created-by">
          <span>CREATED BY</span>
          <a href="#creator1" className="creator-badge">YOU</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;