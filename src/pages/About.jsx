import content from "../content.json";

const page = content.pages.find(p => p.id === "about");

export default function About() {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>
      <h1>{page.title}</h1>
      {page.body.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </main>
  );
}
