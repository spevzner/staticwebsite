import content from "../content.json";
import renderBody, { PAGE_WIDTH, WIDE_WIDTH } from "./renderBody";

const page = content.pages.find(p => p.id === "about");

export default function About() {
  return (
    <main style={{ maxWidth: `${WIDE_WIDTH}px`, margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: `${PAGE_WIDTH}px`, margin: "0 auto" }}>
        <h1>{page.title}</h1>
        {page.image && (
          <img src={page.image} alt="" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
        )}
      </div>
      {renderBody(page.body)}
    </main>
  );
}
