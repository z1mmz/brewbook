export function isLexicalJson(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const parsed = JSON.parse(value);
    return parsed?.root?.children !== undefined;
  } catch {
    return false;
  }
}

export function plainTextToLexical(text) {
  return JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: text || "",
              type: "text",
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
}

export function normalizeDescription(desc) {
  if (!desc) return "";
  if (isLexicalJson(desc)) return desc;
  return plainTextToLexical(desc);
}

export function descriptionToPlainText(value) {
  if (!value || typeof value !== "string") return "";
  if (!isLexicalJson(value)) return value;
  try {
    const parsed = JSON.parse(value);
    const parts = [];
    const walk = (node) => {
      if (!node) return;
      if (typeof node.text === "string") parts.push(node.text);
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(parsed.root);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

export function markdownToHtml(markdown = "") {
  const escaped = markdown
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return escaped
    .split("\n")
    .map((line) => {
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("> ")) return `<blockquote>${line.slice(2)}</blockquote>`;
      if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
      return line ? `<p>${line}</p>` : "";
    })
    .join("")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}