import { Link } from 'react-router-dom';

function Footer() {
  

  return (
    <footer className="footer">
      {/* Newsletter & Links Section */}
      

      {/* CTA Buttons & Social */}
      
      {/* Big Brand Text */}
      <div className="footer-brand">
        <span className="brand-text">TECHORBIT</span>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-legal-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} TECHORBIT CO.</p>
      </div>
      
    </footer>
  );
}

export default Footer;