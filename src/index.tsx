import { Elysia, file } from "elysia";
import { html, Html } from "@elysiajs/html";
import { Base } from "./layout/Base";
import { join } from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Hero } from "./components/Hero";
import { RecentPosts } from "./components/RecentPosts";

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
      <Base title="Hello, Elysia!" desc="yay! it works!">
        {hero + recent}
      </Base>
    );
  })
  .get("/index.css", () => file(join(__dirname, "index.css")))
  .listen(9555);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
