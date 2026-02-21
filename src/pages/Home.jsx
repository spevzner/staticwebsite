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
  minHeight: "calc(100vh - 65px)",
  textAlign: "center",
  padding: "4rem 2rem",
};

const headlineStyle = {
  fontSize: "clamp(2.5rem, 6vw, 4rem)",
  fontWeight: "800",
  color: "#1a1a2e",
  marginBottom: "1.25rem",
};

const taglineStyle = {
  fontSize: "1.15rem",
  color: "#6b7280",
  maxWidth: "520px",
  marginBottom: "2.5rem",
  lineHeight: "1.7",
};

const btnPrimaryStyle = {
  padding: "0.8rem 2.2rem",
  background: "#3b82f6",
  color: "#ffffff",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "background 0.2s",
};

const btnSecondaryStyle = {
  padding: "0.8rem 2.2rem",
  background: "transparent",
  color: "#3b82f6",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "background 0.2s, color 0.2s",
};

export default function Home() {
  return (
    <main style={heroStyle}>
      {/* ↓ Change this headline */}
      <h1 style={headlineStyle}>Welcome to Learing English with Real American Tutors</h1>

      {/* ↓ Change this tagline */}
      <p style={taglineStyle}>
        A short description of what this site is about.
        A short description of what this site is about.
        A short description of what this site is about.
        A short description of what this site is about.
        A short description of what this site is about.
        A short description of what this site is about.
        A short description of what this site is about.
        Edit this text in <code>src/pages/Home.jsx</code>.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/about" style={btnPrimaryStyle}>About</Link>
        <Link to="/contact" style={btnSecondaryStyle}>Contact</Link>
      </div>
    </main>
  );
}
