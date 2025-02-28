import React from 'react';
import Styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={Styles.footer}>
      <div className={Styles.container}>
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <nav>
          <ul className={Styles.footerLinks}>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
