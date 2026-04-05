import { Elysia, file, NotFoundError } from "elysia";
import { html, Html } from "@elysiajs/html";
import { Base } from "./layout/Base";
import { join } from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Hero } from "./components/Hero";
import { RecentPosts } from "./components/RecentPosts";
import { Articles } from "./components/Articles";
import { Article } from "./components/Article";

const api = new Elysia({ prefix: "/api" }).get("/", {
  ok: true,
  message: "Hello",
});

const indexNow_key = Bun.env.INDEXNOW_KEY!;

const app = new Elysia()
  .use(staticPlugin())
  .use(api)
  .use(html())
  .onError(({ code }) => {
    console.log(code);
    if (code === "NOT_FOUND") {
      return (
        <Base title="404 - 5segments" desc="Nothing">
          <>
            <h1>404 Not Found</h1>
            <p>Are you lost?</p>
            <div class="button">
              <a href="/">Home</a>
            </div>
          </>
        </Base>
      );
    } else {
      return (
        <Base title="oops! - 5segments" desc="Sorry :(">
          <>
            <h1>An internal error occured.</h1>
            <p>Error: {code}</p>
            <div class="button">
              <a href="/">Home</a>
            </div>
          </>
        </Base>
      );
    }
  })
  .get("/", async () => {
    const hero = await Hero();
    const recent = await RecentPosts();
    return (
      <Base title="5segments" desc="空に浮かぶ月を、君と見られる日が来るまで。">
        {hero + recent}
      </Base>
    );
  })
  .get("/articles", async () => {
    const articles = await Articles("1");
    return (
      <Base title="5seg's blog" desc="記事一覧">
        {articles}
      </Base>
    );
  })
  .get("/articles/page/:number", async ({ params }) => {
    const page = params.number;
    const articles = await Articles(page);
    return (
      <Base title="5seg's blog" desc="記事一覧">
        {articles}
      </Base>
    );
  })
  .get("/articles/:id", async ({ params }) => {
    const id = params.id;
    const title = await (async (): Promise<string> => {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/articles/${id}?fields[0]=title`,
      );
      if (res.ok) {
        const json = await res.json();
        return json.data.title;
      } else {
        throw new NotFoundError("Cannot find article");
      }
    })();
    const article = await Article(id);
    return (
      <Base title={`${title} - 5seg's blog`} desc="5seg's blog">
        {article}
      </Base>
    );
  })
  .get("/index.css", () => file(join(__dirname, "index.css")))
  .get("/favicon.ico", () => file(join(__dirname, "favicon.ico")))
  .get(`${indexNow_key}.txt`, () => indexNow_key)
  .listen(9555);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

const shutdown = async () => {
  if (app.server) await app.server.stop();
  console.log("Goodbye");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
