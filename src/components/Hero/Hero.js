import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/feature/BASINTAP.jpg";

const Hero = () => (
  <section className="collection-hero" aria-labelledby="hero-title">
    <div className="collection-hero-copy">
      <p className="collection-eyebrow">LUXURRY · BATHROOM & KITCHEN</p>
      <h1 id="hero-title">Thoughtful details.<br />Beautiful everyday living.</h1>
      <p>Explore bathroom fittings and kitchen essentials that bring your space together.</p>
      <Link className="collection-button" to="/shop">Explore the collection <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="collection-hero-image">
      <img src={heroImage} alt="Bathroom basin tap from the Luxurry collection" width="900" height="900" fetchPriority="high" />
      <span>Designed for your everyday.</span>
    </div>
  </section>
);
export default Hero;
