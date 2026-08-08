import { Html } from "@elysiajs/html";
import { Card } from "./Card";
import { join } from "node:path";
import { articleListT } from "../types/article";

const contentPerPage = 10;

const get = async (page: number) => {
  const builtURL = new URL(`${process.env.API_ENDPOINT}/articles`);
  const offset = (page - 1) * contentPerPage;
  builtURL.searchParams.append("sort", "publishedAt:desc");
  builtURL.searchParams.append("offset", `${offset}`);
  builtURL.searchParams.append("limit", `${contentPerPage}`);
  const res = await fetch(builtURL);
  if (res.ok) {
    const data = (await res.json()) as articleListT;
    return data;
  } else return null;
};

export async function Articles(page: number = 1) {
  const style = await Bun.file(
    join(__dirname, "../assets/articles.css"),
  ).text();
  const articles = await get(page);
  const pageCount = Math.ceil(articles?.meta.total! / contentPerPage);
  console.log(articles);
  return (
    <Card>
      <style>{style}</style>
      <h1>5seg's blog</h1>
      <div class="info font-mono">
        <p>{articles?.meta.total ?? 0} posts available.</p>
        <p class="text-gray-400">
          Page: {page ?? "?"}/{pageCount ?? "?"}
        </p>
      </div>
      <main>
        {articles ? (
          articles.data.map((post) => (
            <div class="article-pre">
              <a href={`/articles/${post.slug}`}>
                <div class="article rounded-xl border border-red-800 p-4 text-start transition-colors hover:border-red-700">
                  <p class="font-mono text-gray-500">
                    {post.createdAt.toString()}
                  </p>
                  <h3>{post.title}</h3>
                </div>
              </a>
            </div>
          ))
        ) : (
          <p>No articles...</p>
        )}
      </main>

      {articles && pageCount > 1 ? (
        <div class="pagination font-mono">
          {page > 1 ? (
            <a href={`/articles/page/${page - 1}`} rel="prev">
              {"<"} Page {page - 1}
            </a>
          ) : (
            <div aria-hidden="true"></div>
          )}
          {page !== pageCount ? (
            <a href={`/articles/page/${page + 1}`} rel="next">
              Page {page + 1} {">"}
            </a>
          ) : (
            <div aria-hidden="true"></div>
          )}
        </div>
      ) : (
        <></>
      )}
      <hr class="hr1" />
      <a href="/">戻る ↩️ </a>
      <hr class="hr2" />
    </Card>
  );
}
