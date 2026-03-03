import { Html } from "@elysiajs/html";
import { Marked } from "marked";
import markedShiki from "marked-shiki";
import { bundledLanguages, createHighlighter } from "shiki";
import { join } from "node:path";
import { Card } from "./Card";
import { gfmHeadingId } from "marked-gfm-heading-id";

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
    .use({
      breaks:
        new Date(json.data.updatedAt) > new Date("2026-03-02T03:32:21.679Z"),
    })
    .use(gfmHeadingId())
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
  const style = await Bun.file(join(__dirname, "../assets/article.css")).text();
  return (
    <Card>
      <style>{style}</style>
      <div class="article">
        <div class="article-pre">
          <h1>{json.data.title}</h1>
          <p class="font-mono text-gray-500">{json.data.publishedAt}</p>
        </div>
        <div class="article-main">{html}</div>
      </div>
      <hr class="hr1" />
      {fromRoot ? (
        <a href="/">トップページへ ↩️</a>
      ) : (
        <a href="/articles">記事一覧 ↩️</a>
      )}
      <hr class="hr2" />
    </Card>
  );
}
