import { minify } from "html-minifier-terser";
import { readdirSync, existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

const pf = performance;
let pf_start: number;
let start: number;
interface articlesT {
  id: number;
  documentId: string;
  updatedAt: Date;
}

interface pageT {
  loc: string;
  lastmod?: Date;
}

const pages: pageT[] = [];
const getURL = (path: string) => "https://5seg.top" + path;
pages.push({ loc: getURL("/") });
pages.push({ loc: getURL("/articles") });

const buildSitemap = () => {
  const tab = (size = 1) => " ".repeat(2 * size);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const page of pages) {
    xml += tab() + "<url>\n";
    xml += tab(2) + `<loc>${page.loc}</loc>\n`;
    if (page.lastmod) xml += tab(2) + `<lastmod>${page.lastmod}</lastmod>\n`;
  }
  xml += "</urlset>";
  return xml;
};

const log = (...data: any[]) => {
  console.log(`[${(pf.now() - pf_start).toFixed(5)}]`, ...data);
};

const resetTimer = () => (start = new Date().getTime());
const estimated = (epoch: number = start) => new Date().getTime() - epoch;

const awaitForServer_startUp = () =>
  new Promise<void>(async (_) => {
    while (1) {
      try {
        const res = await fetch("http://127.0.0.1:9555", {
          signal: AbortSignal.timeout(1000),
        });
        if (res.ok) break;
      } catch {}
    }
    _();
  });

const awaitForServer_stop = (proc: Bun.Subprocess<any>) =>
  new Promise<void>(async (_) => {
    while (!proc.killed) {
      await new Promise<void>((_) =>
        setTimeout(() => {
          _();
        }, 1000),
      );
    }
    _();
  });

const minifier = async (html: string) => {
  const minified = await minify(html, {
    removeAttributeQuotes: false, //prettier will fails parsing when enabled
    noNewlinesBeforeTagClose: true,
    collapseWhitespace: true,
    useShortDoctype: true,
    removeEmptyElements: true,
    removeRedundantAttributes: true,
    minifyCSS: {
      level: 0,
    },
  });
  return minified;
};

const build = async (endpoint: string) => {
  pf_start = pf.now();
  const buildTime_0 = new Date().getTime();
  log("🔄 Building");
  resetTimer();
  const proc = Bun.spawn(["bun", "dev"], { stdout: "ignore" });
  const resp = await fetch(
    endpoint +
      "/articles?fields[0]=documentId&fields[1]=updatedAt&pagination[pageSize]=9999",
  );
  const data = (await resp.json()).data as articlesT[];
  data.reverse().forEach((data) => {
    pages.push({
      loc: getURL(`/articles/${data.documentId}`),
      lastmod: data.updatedAt,
    });
  });
  const articles = data.map((x) => x.documentId);
  log(`✅ Found ${articles.length} articles`);
  await awaitForServer_startUp();
  log(`🕓 Server started (${estimated()}ms)`);

  const locations: string[] = [
    "/",
    "/articles",
    ...articles.map((x) => "/articles/" + x),
  ];

  if (existsSync("dist")) await rm("dist", { recursive: true });
  await mkdir("dist");

  const fetchPromises = locations.map(async (x) => {
    const res = await minifier(
      await (await fetch("http://127.0.0.1:9555" + x)).text(),
    );
    const filename = x;
    const path = "dist" + (filename.length > 1 ? filename : "/index") + ".html";
    await Bun.write(path, res);
    log("📥", path);
  });
  resetTimer();
  await Promise.all(fetchPromises).then(() =>
    log(`✅ Fetched ${fetchPromises.length} pages (${estimated()}ms)`),
  );

  const publicFiles = readdirSync("public");
  const copyPromises = publicFiles.map(async (x) => {
    const file = Bun.file("public/" + x);
    const canMinify = file.name && file.name.endsWith(".css");
    const minified = canMinify ? await minifier(await file.text()) : null;
    const path = "dist/public/" + x;
    await Bun.write(path, canMinify ? minified! : file);
    log("💾", path);
  });
  resetTimer();
  await Promise.all(copyPromises).then(() =>
    log(`✅ Copied ${copyPromises.length} public files (${estimated()}ms)`),
  );

  resetTimer();
  const cssFile = Bun.file("src/index.css");
  await Bun.write("dist/index.css", cssFile).then(() =>
    log(`✅ Copied index.css (${estimated()}ms)`),
  );
  resetTimer();
  const faviconFile = Bun.file("src/favicon.ico");
  await Bun.write("dist/favicon.ico", faviconFile).then(() =>
    log(`✅ Copied favicon.ico (${estimated()}ms)`),
  );
  resetTimer();
  const robotFile = Bun.file("src/robots.txt");
  await Bun.write("dist/robots.txt", robotFile).then(() =>
    log(`✅ Copied robots.txt (${estimated()}ms)`),
  );

  resetTimer();
  const xml = buildSitemap();
  await Bun.write("dist/sitemap.xml", xml).then(() =>
    log(`✅️ Built sitemap.xml (${estimated()}ms)`),
  );
  log(`✨ Done! (${estimated(buildTime_0)}ms)`);
  proc.kill();
  await awaitForServer_stop(proc);
  process.exit(0);
};

if (!process.env.API_ENDPOINT) {
  console.error("API_ENDPOINT is not defined at .env");
  process.exit(1);
}

build(process.env.API_ENDPOINT);
