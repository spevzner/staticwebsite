const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const SEPARATOR_ROW = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;

// Width a single column of text/images has always rendered at (matches the featured image).
// The wide page container is sized so two columns + the gap fit inside it, with room to spare —
// box-sizing: border-box means the page's own horizontal padding eats into max-width, so that
// padding (matches the "3rem 2rem" used on the page <main>) plus a safety margin is added back in.
export const PAGE_WIDTH = 640;
const COLUMN_GAP = 32; // 2rem
const PAGE_PADDING = 64; // 2rem left + 2rem right
const SAFETY_MARGIN = 32;
export const WIDE_WIDTH = PAGE_WIDTH * 2 + COLUMN_GAP + PAGE_PADDING + SAFETY_MARGIN;

const narrowStyle = { maxWidth: `${PAGE_WIDTH}px`, margin: "0 auto" };
const tableStyle = { width: "100%", borderCollapse: "collapse", margin: "1.5rem 0" };
const thStyle = { textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: "2px solid #3770b2", color: "#1f2024" };
const tdStyle = { padding: "0.5rem 0.75rem", borderBottom: "1px solid #e2e8f0", color: "#374151" };
const columnsWrapStyle = { display: "flex", gap: `${COLUMN_GAP}px`, margin: "1.5rem 0", flexWrap: "wrap" };
const columnStyle = { flex: `1 1 ${PAGE_WIDTH}px`, minWidth: 0, maxWidth: `${PAGE_WIDTH}px` };

function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function parseTable(para) {
  const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2 || !lines[0].includes("|") || !SEPARATOR_ROW.test(lines[1])) return null;
  return { header: splitRow(lines[0]), rows: lines.slice(2).map(splitRow) };
}

// Renders one blank-line-delimited block: an image, a table, or a plain paragraph.
function renderBlock(para, key) {
  const trimmed = para.trim();

  const imgMatch = trimmed.match(IMAGE_LINE);
  if (imgMatch) {
    const [, alt, src] = imgMatch;
    return (
      <img
        key={key}
        src={src}
        alt={alt}
        style={{ maxWidth: "100%", borderRadius: "8px", margin: "1.5rem 0", display: "block" }}
      />
    );
  }

  const table = parseTable(trimmed);
  if (table) {
    return (
      <table key={key} style={tableStyle}>
        <thead>
          <tr>
            {table.header.map((cell, hi) => <th key={hi} style={thStyle}>{cell}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => <td key={ci} style={tdStyle}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <p key={key}>{para}</p>;
}

// Renders a run of text as a sequence of blank-line-delimited blocks.
function renderBlocks(text, keyPrefix) {
  return text.split("\n\n").filter(Boolean).map((para, i) => renderBlock(para, `${keyPrefix}-${i}`));
}

// Splits raw body text into plain-text runs and :::columns ... ::: ... :::end fenced blocks.
function splitColumnBlocks(text) {
  const lines = text.split("\n");
  const nodes = [];
  let buffer = [];
  const flush = () => {
    if (buffer.length) {
      nodes.push({ type: "text", content: buffer.join("\n") });
      buffer = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() === ":::columns") {
      flush();
      i++;
      const left = [];
      while (i < lines.length && lines[i].trim() !== ":::") left.push(lines[i++]);
      i++; // skip ':::'
      const right = [];
      while (i < lines.length && lines[i].trim() !== ":::end") right.push(lines[i++]);
      i++; // skip ':::end'
      nodes.push({ type: "columns", left: left.join("\n"), right: right.join("\n") });
    } else {
      buffer.push(lines[i]);
      i++;
    }
  }
  flush();
  return nodes;
}

export default function renderBody(body) {
  const nodes = splitColumnBlocks(body || "");
  const out = [];
  let key = 0;

  for (const node of nodes) {
    if (node.type === "text") {
      const k = key++;
      out.push(
        <div key={`t${k}`} style={narrowStyle}>
          {renderBlocks(node.content, `t${k}`)}
        </div>
      );
    } else {
      const k = key++;
      out.push(
        <div key={`c${k}`} style={columnsWrapStyle}>
          <div style={columnStyle}>{renderBlocks(node.left, `l${k}`)}</div>
          <div style={columnStyle}>{renderBlocks(node.right, `r${k}`)}</div>
        </div>
      );
    }
  }

  return out;
}
