import React from "react";
import { Link } from "react-router-dom";
export default function About() {
  return (
    <main id="main-content" className="section-wrap story-page">
      <p className="eyebrow">OUR STORY · CLASSIC GROUP</p>
      <h1>
        The everyday,
        <br />
        <em>elevated.</em>
      </h1>
      <div className="story-body">
        <h2>
          A home comes together
          <br />
          in the details.
        </h2>
        <div>
          <p>
            Luxurry brings together bathroom fittings and kitchen essentials
            under Classic Group. Our collection helps you explore the pieces
            that shape the spaces you use every day.
          </p>
          <p>
            Whether you are choosing a basin, updating a tap or planning a
            kitchen, browse our range and speak with our team about your
            project, product specifications and availability.
          </p>
          <Link className="collection-button" to="/shop">
            Explore the collection ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
