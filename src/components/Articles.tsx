import { Html } from "@elysiajs/html";
import { Card } from "./Card";
import { join } from "node:path";

interface articleListT {
  data: {
    id: number;
    documentId: string;
    title: string;
    publishedAt: Date;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      /** how many pages */
      pageCount: number;
      /** total articles */
      total: number;
    };
  };
}

const get = async (page: string) => {
  const builtURL = new URL(`${process.env.API_ENDPOINT}/articles`);
  builtURL.searchParams.append("fields[0]", "documentId");
  builtURL.searchParams.append("fields[1]", "title");
  builtURL.searchParams.append("fields[2]", "publishedAt");
  builtURL.searchParams.append("sort", "publishedAt:desc");
  builtURL.searchParams.append("pagination[page]", page);
  builtURL.searchParams.append("pagination[pageSize]", "25");
  const res = await fetch(builtURL);
  if (res.ok) {
    const data = (await res.json()) as articleListT;
    return data;
  } else return null;
};

export async function Articles(page: string = "1") {
  const style = await Bun.file(
    join(__dirname, "../assets/articles.css"),
  ).text();
  const articles = await get(page);
  return (
    <Card>
      <style>{style}</style>
      <h1>5seg's blog</h1>
      <div class="info font-mono">
        <p>{articles?.meta.pagination.total ?? 0} posts available.</p>
        <p class="text-gray-400">
          Page: {articles?.meta.pagination.page ?? "?"}/
          {articles?.meta.pagination.pageCount ?? "?"}
        </p>
      </div>
      <main>
        {articles ? (
          articles.data.map((post) => (
            <div class="article-pre">
              <a href={`/articles/${post.documentId}`}>
                <div class="article rounded-xl border border-red-800 p-4 text-start transition-colors hover:border-red-700">
                  <p class="font-mono text-gray-500">
                    {post.publishedAt.toString()}
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

      {articles && articles.meta.pagination.pageCount > 1 ? (
        <div class="pagination font-mono">
          {articles.meta.pagination.page > 1 ? (
            <a
              href={`/articles?page=${articles.meta.pagination.page - 1}`}
              rel="prev"
            >
              {"<"} Page {articles.meta.pagination.page - 1}
            </a>
          ) : (
            <div aria-hidden="true"></div>
          )}
          {articles.meta.pagination.page !==
          articles.meta.pagination.pageCount ? (
            <a
              href={`/articles?page=${articles.meta.pagination.page + 1}`}
              rel="next"
            >
              Page {articles.meta.pagination.page + 1} {">"}
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
