import { Link } from "react-router-dom";

// ─────────────────────────────────────────────
// HOME PAGE  —  edit headline, tagline, and
//              button labels below freely
// ─────────────────────────────────────────────

const heroStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 62px)",
  textAlign: "center",
  padding: "4rem 2rem",
  background: "linear-gradient(135deg, #3770b2 0%, #1a3a6b 100%)",
};

const headlineStyle = {
  fontSize: "clamp(2rem, 5vw, 3.5rem)",
  fontWeight: "800",
  color: "#ffffff",
  marginBottom: "1.25rem",
  maxWidth: "800px",
  lineHeight: "1.2",
};

const taglineStyle = {
  fontSize: "1.1rem",
  color: "rgba(255,255,255,0.85)",
  maxWidth: "560px",
  marginBottom: "2.5rem",
  lineHeight: "1.8",
};

const btnGoldStyle = {
  padding: "0.85rem 2.4rem",
  background: "#ffb606",
  color: "#1f2024",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "1rem",
  letterSpacing: "0.02em",
  boxShadow: "0 4px 14px rgba(255,182,6,0.35)",
};

const btnOutlineStyle = {
  padding: "0.85rem 2.4rem",
  background: "transparent",
  color: "#ffffff",
  border: "2px solid rgba(255,255,255,0.7)",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "1rem",
  letterSpacing: "0.02em",
};

export default function Home() {
  return (
    <main style={heroStyle}>
      {/* ↓ Change this headline */}
      <h1 style={headlineStyle}>
        Learning English with Real American Tutors
      </h1>

      {/* ↓ Change this tagline */}
      <p style={taglineStyle}>
        Practice real conversational English with native American tutors.
        Flexible scheduling, personalized lessons, and proven results.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/about" style={btnGoldStyle}>Learn More</Link>
        <Link to="/contact" style={btnOutlineStyle}>Contact Us</Link>
      </div>
    </main>
  );
}
