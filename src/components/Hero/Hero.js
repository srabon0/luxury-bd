import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/feature/BASINTAP.jpg";
export default function Hero() {
  return (
    <section className="renew-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">LUXURRY · BATHROOM & KITCHEN</p>
        <h1 id="hero-title">
          Made for living.
          <br />
          <em>Chosen by you.</em>
        </h1>
        <p>
          Bring your space together with bathroom fittings and kitchen
          essentials, thoughtfully selected for everyday living.
        </p>
        <div className="hero-actions">
          <Link className="collection-button" to="/shop">
            Discover the collection <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" to="/contact">
            Talk to our team
          </Link>
        </div>
        <span className="hero-caption">
          THE ART OF EVERYDAY DETAILS — CLASSIC GROUP
        </span>
      </div>
      <div className="hero-art">
        <img
          src={heroImage}
          alt="Luxurry basin and tap collection"
          width="972"
          height="972"
          fetchPriority="high"
        />
        <div className="hero-art-label">
          <span>IN FOCUS</span>
          <strong>The bathroom collection</strong>
          <Link to="/shop?search=basin" aria-label="Explore bathroom basins">
            ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
