// ─────────────────────────────────────────────
// CONTACT PAGE  —  edit the content below freely
// ─────────────────────────────────────────────

export default function Contact() {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>
      <h1>Contact</h1>

      <p>
        Get in touch with us using the details below.
      </p>

      {/* Add, remove, or change any contact details here */}
      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
        <li>Email: <a href="mailto:you@example.com">you@example.com</a></li>
        <li>Phone: +1 (555) 000-0000</li>
        <li>Location: Your City, Country</li>
      </ul>

      <p>
        Additional notes or instructions can go here.
      </p>
    </main>
  );
}
