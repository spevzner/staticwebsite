import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import content from "./content.json";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";
import ContentPage from "./pages/ContentPage.jsx";

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

const FIXED_IDS = new Set(["home", "about", "contact"]);
const extraPages = content.pages.filter((p) => !FIXED_IDS.has(p.id));

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        {/* ↓ Change the site name here */}
        <Link to="/" style={logoStyle}>English with Americans</Link>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link to="/about" style={navLinkStyle}>About</Link>
          <Link to="/contact" style={navLinkStyle}>Contact</Link>
          {extraPages.map((p) => (
            <Link key={p.id} to={p.slug} style={navLinkStyle}>{p.title}</Link>
          ))}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        {extraPages.map((p) => (
          <Route key={p.id} path={p.slug} element={<ContentPage page={p} />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
