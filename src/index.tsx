import { Elysia, file } from "elysia";
import { html, Html } from "@elysiajs/html";
import { Base } from "./layout/Base";
import { join } from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Hero } from "./components/Hero";
import { RecentPosts } from "./components/RecentPosts";
import { Articles } from "./components/Articles";

const api = new Elysia({ prefix: "/api" }).get("/", {
  ok: true,
  message: "Hello",
});

const app = new Elysia()
  .use(staticPlugin())
  .use(api)
  .use(html())
  .get("/", async () => {
    const hero = await Hero();
    const recent = await RecentPosts();
    return (
      <Base title="5segments" desc="空に浮かぶ月を、君と見られる日が来るまで。">
        {hero + recent}
      </Base>
    );
  })
  .get("/articles", async ({ request }) => {
    const page = new URL(request.url).searchParams.get("page") ?? "1";
    const articles = await Articles(page);
    return (
      <Base title="5seg's blog" desc="記事一覧">
        {articles}
      </Base>
    );
  })
  .get("/articles/:id", async ({ params }) => {
    const id = params.id;
    return params.id;
  })
  .get("/index.css", () => file(join(__dirname, "index.css")))
  .onError(({ code }) => {
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
  .listen(9555);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
