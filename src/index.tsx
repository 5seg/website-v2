import { Elysia, file } from "elysia";
import { html, Html } from "@elysiajs/html";
import { Base } from "./layout/Base";
import { join } from "node:path";

const api = new Elysia({ prefix: "/api" }).get("/", {
  ok: true,
  message: "Hello",
});

const app = new Elysia()
  .use(api)
  .use(html())
  .get("/", () => (
    <Base title="Hello, Elysia!" desc="yay! it works!">
      <h1>Hello, Elysia!</h1>
    </Base>
  ))
  .get("/index.css", () => file(join(__dirname, "index.css")))
  .listen(9555);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
