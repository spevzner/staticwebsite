import content from "../content.json";

const page = content.pages.find(p => p.id === "contact");

export default function Contact() {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>
      <h1>{page.title}</h1>
      {page.image && (
        <img src={page.image} alt="" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
      )}
      <p>{page.intro}</p>
      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
        <li>Email: <a href={`mailto:${page.email}`}>{page.email}</a></li>
        <li>Phone: {page.phone}</li>
        <li>Location: {page.location}</li>
      </ul>
      {page.note && <p>{page.note}</p>}
    </main>
  );
}
