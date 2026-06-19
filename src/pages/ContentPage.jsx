export default function ContentPage({ page }) {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>
      <h1>{page.title}</h1>
      {(page.body || "").split("\n\n").filter(Boolean).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </main>
  );
}
