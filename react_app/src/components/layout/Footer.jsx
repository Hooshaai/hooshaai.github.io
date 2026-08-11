const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">Hoosha AI</div>
        <div className="social-links">
          <a href="#"><i className="fab fa-github"></i></a>
          <a href="#"><i className="fas fa-envelope"></i></a>
          <a href="#"><i className="fas fa-robot"></i></a>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Join our Substack" />
          <button type="submit" className="btn btn-primary">Subscribe</button>
        </form>
      </div>
      <div className="copyright">© 2026 Hoosha AI. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
