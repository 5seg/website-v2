import { Html } from "@elysiajs/html";
import { Marked } from "marked";
import markedShiki from "marked-shiki";
import { bundledLanguages, createHighlighter } from "shiki";

interface articleT {
  data: {
    id: number;
    documentId: string;
    title: string;
    content: string;
    /** Date as str */
    createdAt: string;
    /** Date as str */
    updatedAt: string;
    /** Date as str */
    publishedAt: string;
  };
  meta: {};
}

const isParsable = (lang: string) =>
  Object.keys(bundledLanguages).includes(lang);

const extractLang = (str: string) => {
  const regex = /```(\w+)\n/g;
  let languages = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (isParsable(match[1])) languages.push(match[1]);
  }

  return languages;
};

export async function Article(id: string, fromRoot = false) {
  const res = await fetch(`${process.env.API_ENDPOINT}/articles/${id}`);
  if (!res.ok) return <div>Error: API Returned {res.status}</div>;
  const json = (await res.json()) as articleT;
  const highlighter = await createHighlighter({
    langs: extractLang(json.data.content),
    themes: ["dark-plus"],
  });
  const html = await new Marked()
    .use(
      markedShiki({
        highlight(code, l) {
          const lang = isParsable(l) ? l : "text";
          return highlighter.codeToHtml(code, {
            lang,
            theme: "dark-plus",
          });
        },
      }),
    )
    .parse(json.data.content);
  return <div>{id}</div>;
}
