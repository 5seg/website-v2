import { markdown } from "bun";
import { bundledLanguages, createHighlighter } from "shiki";

let langs: string[] = [];

const isHighlightable = (lang: string) =>
  Object.keys(bundledLanguages).find((k) => k === lang);

const renderCallbacks: markdown.RenderCallbacks = {
  heading: (children, { level }) => `<h${level}>${children}</h${level}>`,
  paragraph: (children) => {
    const replaced = children.replace(
      /(?<!=["'])(https?:\/\/[^\s<>"']+)/g,
      (url) => `<a href="${url}">${url}</a>`,
    );
    return `<p>${replaced}</p>`;
  },
  strong: (children) => `<strong>${children}</strong>`,
  emphasis: (children) => `<em>${children}</em>`,
  codespan: (children) => `<code>${children}</code>`,
  code: (children, meta) => {
    const lang = meta?.language ?? "text";
    if (!langs.includes(lang)) langs.push(lang);
    return `<pre><code class="shiki ${lang}">${Bun.escapeHTML(children)}</code></pre>`;
  },
  link: (children, { href, title }) => {
    console.log(href);
    return title
      ? `<a href="${href}" title="${title}">${children}</a>`
      : `<a href="${href}">${children}</a>`;
  },
  image: (children, { src, title }) =>
    title
      ? `<img src="${src}" alt="${children}" title="${title}" />`
      : `<img src="${src}" alt="${children}" />`,
  list: (children, { ordered, start }) =>
    ordered ? `<ol start="${start}">${children}</ol>` : `<ul>${children}</ul>`,
  listItem: (children) => `<li>${children}</li>`,
  blockquote: (children) => `<blockquote>${children}</blockquote>`,
  hr: () => `<hr />`,
  strikethrough: (children) => `<del>${children}</del>`,
  table: (children) => `<table>${children}</table>`,
  thead: (children) => `<thead>${children}</thead>`,
  tbody: (children) => `<tbody>${children}</tbody>`,
  tr: (children) => `<tr>${children}</tr>`,
  th: (children) => `<th>${children}</th>`,
  td: (children) => `<td>${children}</td>`,
};

const highlight = async (html: string, l: string[]) => {
  const langs = l.map((lang) => (isHighlightable(lang) ? lang : "text"));
  const hightlighter = await createHighlighter({
    themes: ["dark-plus"],
    langs: langs,
  });
  let lang: string;
  const rewriter = new HTMLRewriter().on("code.shiki", {
    element(elem) {
      lang = elem.getAttribute("class")!.split(" ")[1]!;
    },
    text(text) {
      const code = text.text
        .replaceAll("&quot;", '"')
        .replaceAll("&amp;", "&")
        .replaceAll("&#x27;", "`")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
      if (code.length > 0) {
        text.replace(
          (() =>
            hightlighter.codeToHtml(code, {
              theme: "dark-plus",
              lang: isHighlightable(lang) ? lang : "text",
            }))(),
          { html: true },
        );
      }
    },
  });
  return rewriter.transform(html);
};

export const convert = async (md: string) => {
  const html = Bun.markdown.render(md, renderCallbacks);
  const highlighted = await highlight(html, langs);
  return highlighted;
};
