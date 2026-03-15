import { Html } from "@elysiajs/html";
import { Card } from "./Card";

export function Hero() {
  return (
    <main>
      <h1>5segments</h1>
      <img
        src="/public/avatar.avif"
        style="border-radius:9999%;"
        alt="avatar"
      />
      <p class="text-xl font-bold mt-2">Student / Web Developer</p>
      <Card>
        <>
          <p>プログラミング初学者です。</p>
          <p>JavaScript(TypeScript)を主に書きます。</p>
        </>
      </Card>
    </main>
  );
}
