import React from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link className="wordmark" to="/">
            Luxurry<span>THE EVERYDAY, ELEVATED</span>
          </Link>
          <p>
            Bathroom & kitchen collections
            <br />
            by Classic Group.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2>Explore</h2>
          <Link to="/shop">Collections</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div>
          <h2>Let’s talk</h2>
          <a href="tel:+8801711542678">+880 1711 542678</a>
          <a href="tel:+8801763547691">+880 1763 547691</a>
          <a href="mailto:hrtamim7@gmail.com">hrtamim7@gmail.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Classic Group. All rights reserved.
        </span>
        <span>Considered details. Everyday living.</span>
      </div>
    </footer>
  );
}
