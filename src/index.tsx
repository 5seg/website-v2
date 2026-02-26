import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";

const api = new Elysia({ prefix: "/api" }).get("/", {
  ok: true,
  message: "Hello",
});

const app = new Elysia()
  .use(api)
  .use(html())
  .get("/", () => (
    <html>
      <head>
        <title>Hello, Elysia!</title>
      </head>
      <body>
        <h1>Hello, Elysia!</h1>
      </body>
    </html>
  ))
  .listen(9555);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
