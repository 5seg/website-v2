import { Html } from "@elysiajs/html";
import { join } from "node:path";

export async function Card(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <>
      <div class="card">{props.children}</div>
    </>
  );
}
