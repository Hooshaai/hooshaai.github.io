import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    const newSub = {
      e: email,
      org: 'Website User',
      d: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      s: 'Active'
    };

    const existing = JSON.parse(localStorage.getItem('hoosha_subscribers') || '[]');
    localStorage.setItem('hoosha_subscribers', JSON.stringify([...existing, newSub]));

    try {
      await fetch('http://localhost:8000/api/v1/newsletter/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.warn('Offline mode: Saved subscriber locally', err);
    }

    setEmail('');
    alert('Subscribed successfully!');
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">Hoosha AI</div>
        <div className="social-links">
          <a href="#"><i className="fab fa-github"></i></a>
          <a href="#"><i className="fas fa-envelope"></i></a>
          <a href="#"><i className="fas fa-robot"></i></a>
        </div>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input 
            type="email" 
            placeholder="Join our Substack" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Subscribe</button>
        </form>
      </div>
      <div className="copyright">© 2026 Hoosha AI. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
