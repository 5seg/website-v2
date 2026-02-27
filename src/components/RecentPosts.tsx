import { Html } from "@elysiajs/html";
import { Card } from "./Card";

interface articleListT {
  data: {
    id: number;
    documentId: string;
    title: string;
    publishedAt: Date;
  }[];
}

const get = async () => {
  const url = new URL(`${process.env.API_ENDPOINT}/articles`);
  url.searchParams.append("fields[0]", "documentId");
  url.searchParams.append("fields[1]", "title");
  url.searchParams.append("fields[2]", "publishedAt");
  url.searchParams.append("sort", "publishedAt:desc");
  url.searchParams.append("pagination[limit]", "5");
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
            <a href={`/articles/${article.documentId}`}>
              <p>{article.publishedAt.toDateString()}</p>
              <h3>{article.title}</h3>
            </a>
          ))
        ) : (
          <p>No articles...</p>
        )}
      </>
    </Card>
  );
}
