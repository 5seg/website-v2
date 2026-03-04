const server = Bun.serve({
  async fetch(req) {
    const name = (() => {
      let pathname = new URL(req.url).pathname;
      if (pathname.length === 1) pathname = "index.html";
      if (!pathname.includes(".")) pathname = pathname + ".html";
      return pathname;
    })();
    const path = "dist/" + name;
    const file = Bun.file(path);
    return new Response(file);
  },
});

console.log("Ready at", server.url.origin);
