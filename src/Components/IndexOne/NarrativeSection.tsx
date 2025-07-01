import React from "react";
import "./NarrativeSection.css";

const NarrativeSection = () => (
  <section className="narrative-section">
    <div className="narrative-content">
      <div className="narrative-text">
        <h2 className="narrative-gradient-text">
          The future of agriculture is real-time, AI-driven, and on-chain.
        </h2>
        <p>
          Decentragri is building a new layer of intelligence for farms. Our sensors gather field data continuously. AI interprets it instantly. And our blockchain-backed platform ensures every insight is tamper-proof and globally visible. All this—delivered straight to the user's mobile.
        </p>
        <a href="/about" className="narrative-learn-more-btn btn">Learn More</a>
      </div>
      <div className="narrative-image-wrap large">
        <img
          src="https://www.decentragri.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero2.b3107d6b.png&w=3840&q=75"
          alt="Decentragri AI Farm"
          className="narrative-image"
          loading="lazy"
        />
        <div className="narrative-image-overlay" />
      </div>
    </div>
    <svg className="narrative-svg" viewBox="0 0 1440 320"><path fill="#00c3ff" fillOpacity="0.08" d="M0,160L60,176C120,192,240,224,360,229.3C480,235,600,213,720,197.3C840,181,960,171,1080,176C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
  </section>
);

export default NarrativeSection;
