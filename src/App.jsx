import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2.5rem",
  borderBottom: "1px solid #e5e7eb",
  background: "#ffffff",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoStyle = {
  fontWeight: "700",
  fontSize: "1.2rem",
  color: "#1a1a2e",
};

const navLinksStyle = {
  display: "flex",
  gap: "2rem",
};

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>My Website</Link>
        <div style={navLinksStyle}>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
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
