import { Html } from "@elysiajs/html";
import { Card } from "./Card";
import { join } from "node:path";
import { articleListT } from "../types/article";

const get = async () => {
  const url = new URL(`${process.env.API_ENDPOINT}/articles`);
  url.searchParams.append("limit", "5");
  const res = await fetch(url);
  if (res.ok) {
    const data = (await res.json()) as articleListT;
    return data;
  } else return null;
};

export async function RecentPosts() {
  const articles = await get();
  return (
    <Card>
      <>
        <h2>最近の記事</h2>
        {articles ? (
          articles.data.map((article) => (
            <div class="recent-articles">
              <a href={`/articles/${article.slug}?ref=top`}>
                <p>{article.createdAt}</p>
                <h3>{article.title}</h3>
              </a>
            </div>
          ))
        ) : (
          <p>No articles...</p>
        )}
        {articles && <a href="/articles">全記事のリストを見る</a>}
      </>
    </Card>
  );
}
