import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const s = {
  wrap: { display: "flex", minHeight: "calc(100vh - 62px)" },
  sidebar: {
    width: "220px", flexShrink: 0,
    borderRight: "1px solid #e2e8f0", background: "#f8fafc",
    padding: "1.5rem 1rem", display: "flex", flexDirection: "column",
  },
  main: { flex: 1, padding: "2rem 2.5rem", maxWidth: "680px" },
  pageBtn: {
    display: "block", width: "100%", textAlign: "left",
    padding: "0.5rem 0.75rem", borderRadius: "6px", border: "none",
    background: "none", cursor: "pointer", fontSize: "0.9rem",
    color: "#374151", marginBottom: "0.25rem",
  },
  pageBtnActive: { background: "#3770b2", color: "#fff" },
  addBtn: {
    marginTop: "auto", padding: "0.5rem 1rem", background: "#fff",
    color: "#3770b2", border: "1.5px solid #3770b2", borderRadius: "6px",
    fontWeight: "600", fontSize: "0.85rem", cursor: "pointer",
  },
  label: {
    display: "block", fontSize: "0.78rem", fontWeight: "700",
    color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em",
    marginTop: "1.25rem", marginBottom: "0.4rem",
  },
  input: {
    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "0.95rem", boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "0.95rem", boxSizing: "border-box",
    fontFamily: "inherit", lineHeight: "1.6", resize: "vertical",
  },
  saveBtn: {
    marginTop: "1.75rem", padding: "0.65rem 2rem", background: "#3770b2",
    color: "#fff", border: "none", borderRadius: "6px",
    fontWeight: "700", fontSize: "0.95rem", cursor: "pointer",
  },
  deleteBtn: {
    marginTop: "1.75rem", marginLeft: "0.75rem", padding: "0.65rem 1.25rem",
    background: "#fff", color: "#dc2626", border: "1.5px solid #dc2626",
    borderRadius: "6px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
  },
  status: { marginTop: "0.75rem", fontSize: "0.85rem" },
  imagePreview: {
    maxWidth: "100%", maxHeight: "160px", display: "block",
    borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid #e2e8f0",
  },
  removeImgBtn: {
    padding: "0.35rem 0.75rem", background: "#fff", color: "#dc2626",
    border: "1.5px solid #dc2626", borderRadius: "6px",
    fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", marginBottom: "0.5rem",
  },
};

function slugify(str) {
  return "/" + str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const FIXED_IDS = ["home", "about", "contact"];

function ImageField({ page, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const r = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (r.ok) {
        const { url } = await r.json();
        onChange({ ...page, image: url });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <label style={s.label}>Featured Image (shown above the text)</label>
      {page.image && (
        <>
          <img src={page.image} alt="" style={s.imagePreview} />
          <button
            type="button"
            style={s.removeImgBtn}
            onClick={() => onChange({ ...page, image: "" })}
          >
            Remove Image
          </button>
        </>
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {uploading && <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Uploading…</p>}
    </>
  );
}

function HeroEditor({ page, onChange }) {
  const set = (key) => (e) => onChange({ ...page, [key]: e.target.value });
  return (
    <>
      <label style={s.label}>Headline</label>
      <input style={s.input} value={page.headline || ""} onChange={set("headline")} />
      <label style={s.label}>Tagline</label>
      <textarea style={s.textarea} rows={3} value={page.tagline || ""} onChange={set("tagline")} />
      <label style={s.label}>Primary Button Label</label>
      <input style={s.input} value={page.ctaPrimary || ""} onChange={set("ctaPrimary")} />
      <label style={s.label}>Secondary Button Label</label>
      <input style={s.input} value={page.ctaSecondary || ""} onChange={set("ctaSecondary")} />
      <ImageField page={page} onChange={onChange} />
    </>
  );
}

function ContactEditor({ page, onChange }) {
  const set = (key) => (e) => onChange({ ...page, [key]: e.target.value });
  return (
    <>
      <label style={s.label}>Title</label>
      <input style={s.input} value={page.title || ""} onChange={set("title")} />
      <label style={s.label}>Intro Text</label>
      <textarea style={s.textarea} rows={2} value={page.intro || ""} onChange={set("intro")} />
      <label style={s.label}>Email</label>
      <input style={s.input} value={page.email || ""} onChange={set("email")} />
      <label style={s.label}>Phone</label>
      <input style={s.input} value={page.phone || ""} onChange={set("phone")} />
      <label style={s.label}>Location</label>
      <input style={s.input} value={page.location || ""} onChange={set("location")} />
      <label style={s.label}>Note (optional)</label>
      <textarea style={s.textarea} rows={2} value={page.note || ""} onChange={set("note")} />
      <ImageField page={page} onChange={onChange} />
    </>
  );
}

function ContentEditor({ page, onChange, isNew }) {
  const set = (key) => (e) => onChange({ ...page, [key]: e.target.value });
  const bodyRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const insertAtCursor = (snippet) => {
    const body = page.body || "";
    const pos = bodyRef.current ? bodyRef.current.selectionStart : body.length;
    const before = body.slice(0, pos);
    const after = body.slice(pos);
    const lead = before && !before.endsWith("\n\n") ? "\n\n" : "";
    const trail = after && !after.startsWith("\n\n") ? "\n\n" : "";
    onChange({ ...page, body: `${before}${lead}${snippet}${trail}${after}` });
  };

  const insertImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const r = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (r.ok) {
        const { url } = await r.json();
        insertAtCursor(`![](${url})`);
      }
    } finally {
      setUploading(false);
    }
  };

  const insertTable = () => {
    insertAtCursor(
      "| Column 1 | Column 2 |\n| --- | --- |\n| Row 1 | Row 1 |\n| Row 2 | Row 2 |"
    );
  };

  const insertColumns = () => {
    insertAtCursor(
      ":::columns\nLeft column text goes here.\n:::\nRight column text goes here.\n:::end"
    );
  };

  return (
    <>
      <label style={s.label}>Title</label>
      <input
        style={s.input}
        value={page.title || ""}
        onChange={(e) => {
          const updates = { ...page, title: e.target.value };
          if (isNew) updates.slug = slugify(e.target.value);
          onChange(updates);
        }}
      />
      {isNew && (
        <>
          <label style={s.label}>URL Slug</label>
          <input style={s.input} value={page.slug || ""} onChange={set("slug")} placeholder="/my-page" />
        </>
      )}
      <label style={s.label}>Body — separate paragraphs with a blank line</label>
      <textarea ref={bodyRef} style={s.textarea} rows={10} value={page.body || ""} onChange={set("body")} />
      <label style={s.label}>Insert Image at Cursor</label>
      <input type="file" accept="image/*" onChange={insertImage} disabled={uploading} />
      {uploading && <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Uploading…</p>}
      <label style={s.label}>Insert Table at Cursor</label>
      <button type="button" style={{ ...s.addBtn, marginTop: 0 }} onClick={insertTable}>+ Table</button>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "-0.25rem" }}>
        Edit the inserted <code>| cell | cell |</code> rows directly in the body text to change columns/rows.
      </p>
      <label style={s.label}>Insert Two Columns at Cursor</label>
      <button type="button" style={{ ...s.addBtn, marginTop: 0 }} onClick={insertColumns}>+ Two Columns</button>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "-0.25rem" }}>
        Replace the placeholder text on each side of the <code>:::</code> divider. You can place the cursor
        inside either side and use Insert Image / Insert Table to add pictures or tables within a column.
      </p>
      <ImageField page={page} onChange={onChange} />
    </>
  );
}

export default function Admin() {
  const [content, setContent] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState({ msg: "", ok: true });
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setSelectedId(data.pages[0]?.id ?? null);
        setDraft(data.pages[0] ? { ...data.pages[0] } : null);
      })
      .catch(() => setApiAvailable(false));
  }, []);

  const select = (page) => {
    setSelectedId(page.id);
    setDraft({ ...page });
    setIsNew(false);
    setStatus({ msg: "", ok: true });
  };

  const handleAdd = () => {
    const blank = { id: `page-${Date.now()}`, slug: "/new-page", title: "New Page", body: "" };
    setSelectedId(blank.id);
    setDraft(blank);
    setIsNew(true);
    setStatus({ msg: "", ok: true });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${draft.title}"?`)) return;
    const updated = { ...content, pages: content.pages.filter((p) => p.id !== draft.id) };
    await save(updated);
    setSelectedId(updated.pages[0]?.id ?? null);
    setDraft(updated.pages[0] ? { ...updated.pages[0] } : null);
    setIsNew(false);
  };

  const save = async (updatedContent) => {
    try {
      const r = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent, null, 2),
      });
      if (r.ok) {
        setContent(updatedContent);
        setStatus({ msg: "Saved! Changes hot-reload in the browser.", ok: true });
        return true;
      }
    } catch {}
    setStatus({ msg: "Save failed — is the dev server running?", ok: false });
    return false;
  };

  const handleSave = async () => {
    const pages = isNew
      ? [...content.pages, draft]
      : content.pages.map((p) => (p.id === draft.id ? draft : p));
    const ok = await save({ ...content, pages });
    if (ok && isNew) setIsNew(false);
  };

  if (!apiAvailable) {
    return (
      <main style={{ padding: "3rem 2.5rem" }}>
        <h1>Admin</h1>
        <p style={{ color: "#dc2626" }}>
          The CMS API is only available in development (<code>npm run dev</code>).
        </p>
        <Link to="/">← Back to site</Link>
      </main>
    );
  }

  if (!content) return <p style={{ padding: "2rem" }}>Loading…</p>;

  const pageLabel = (p) => p.title || p.headline || p.id;

  const renderEditor = () => {
    if (!draft) return null;
    if (draft.id === "home") return <HeroEditor page={draft} onChange={setDraft} />;
    if (draft.id === "contact") return <ContactEditor page={draft} onChange={setDraft} />;
    return <ContentEditor page={draft} onChange={setDraft} isNew={isNew} />;
  };

  const canDelete = draft && !FIXED_IDS.includes(draft.id) && !isNew;

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <Link to="/" style={{ fontSize: "0.8rem", color: "#6b7280", textDecoration: "none" }}>
          ← Back to site
        </Link>
        <p style={{ fontWeight: "700", margin: "1.25rem 0 0.5rem", fontSize: "0.78rem", color: "#374151", letterSpacing: "0.05em" }}>
          PAGES
        </p>
        {content.pages.map((p) => (
          <button
            key={p.id}
            style={{ ...s.pageBtn, ...(selectedId === p.id ? s.pageBtnActive : {}) }}
            onClick={() => select(p)}
          >
            {pageLabel(p)}
          </button>
        ))}
        <button style={s.addBtn} onClick={handleAdd}>+ Add Page</button>
      </aside>

      <main style={s.main}>
        <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.3rem", color: "#1f2024" }}>
          {isNew ? "New Page" : pageLabel(draft ?? {})}
        </h2>
        {!isNew && draft && !FIXED_IDS.includes(draft.id) && (
          <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#6b7280" }}>
            URL: <code>{draft.slug}</code>
          </p>
        )}
        {renderEditor()}
        <div>
          <button style={s.saveBtn} onClick={handleSave}>Save</button>
          {canDelete && (
            <button style={s.deleteBtn} onClick={handleDelete}>Delete Page</button>
          )}
        </div>
        {status.msg && (
          <p style={{ ...s.status, color: status.ok ? "#16a34a" : "#dc2626" }}>{status.msg}</p>
        )}
      </main>
    </div>
  );
}
