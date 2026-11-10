import React from "react";
export default function Contact() {
  return (
    <main id="main-content" className="section-wrap story-page">
      <p className="eyebrow">CONTACT LUXURRY</p>
      <h1>
        Let’s talk
        <br />
        <em>about your space.</em>
      </h1>
      <p className="page-lead">
        Need product details, availability or help choosing? Get in touch with
        the Classic Group team.
      </p>
      <div className="contact-cards">
        <section>
          <span>01 / CALL US</span>
          <h2>A conversation starts here.</h2>
          <a href="tel:+8801711542678">+880 1711 542678 ↗</a>
          <a href="tel:+8801763547691">+880 1763 547691 ↗</a>
        </section>
        <section>
          <span>02 / WRITE TO US</span>
          <h2>Tell us what you have in mind.</h2>
          <a href="mailto:hrtamim7@gmail.com">hrtamim7@gmail.com ↗</a>
          <p>Include a product name or code so we can help you more easily.</p>
        </section>
      </div>
    </main>
  );
}
