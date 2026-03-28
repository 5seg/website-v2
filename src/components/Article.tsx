import { Html } from "@elysiajs/html";
import { bundledLanguages } from "shiki";
import { join } from "node:path";
import { Card } from "./Card";
import { convert } from "../utils/convert";

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

export async function Article(id: string, fromRoot = false) {
  const res = await fetch(`${process.env.API_ENDPOINT}/articles/${id}`);
  if (!res.ok) return <div>Error: API Returned {res.status}</div>;
  const json = (await res.json()) as articleT;
  const html = await convert(json.data.content);
  const style = await Bun.file(join(__dirname, "../assets/article.css")).text();
  return (
    <Card>
      <style>{style}</style>
      <div class="article">
        <div class="article-pre">
          <h1>{json.data.title}</h1>
          <p class="font-mono text-gray-500">{json.data.publishedAt}</p>
        </div>
        <main class="article-main">{html}</main>
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
