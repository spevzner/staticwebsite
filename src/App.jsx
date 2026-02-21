import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2.5rem",
  background: "linear-gradient(135deg, #3770b2 0%, #2a5298 100%)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoStyle = {
  fontWeight: "800",
  fontSize: "1.3rem",
  color: "#ffffff",
  letterSpacing: "0.01em",
};

const navLinkStyle = {
  color: "rgba(255,255,255,0.9)",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "color 0.2s",
};

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        {/* ↓ Change the site name here */}
        <Link to="/" style={logoStyle}>English with Americans</Link>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link to="/about" style={navLinkStyle}>About</Link>
          <Link to="/contact" style={navLinkStyle}>Contact</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
