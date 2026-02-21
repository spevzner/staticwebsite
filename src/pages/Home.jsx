import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1>Welcome</h1>
      <p style={{ marginBottom: "2rem" }}>Choose a page to get started:</p>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <Link to="/about" style={{ fontSize: "1.2rem" }}>About</Link>
        <Link to="/contact" style={{ fontSize: "1.2rem" }}>Contact</Link>
      </nav>
    </main>
  );
}
