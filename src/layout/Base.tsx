import { Html } from "@elysiajs/html";

export async function Base(props: {
  title: string;
  desc: string;
  children: JSX.Element;
}) {
  let importCardStyle = false;
  let importRecentStyle = false;
  // console.log(await props.children.toString());
  if (props.children.toString().includes('<div class="card"')) {
    console.log("Card detected");
    importCardStyle = true;
  }
  if (props.children.toString().includes('<div class="recent-articles"')) {
    console.log("Recent detected");
    importRecentStyle = true;
  }
  return (
    <html
      style="background: #381d24;color: #dfcfd2;text-align: center;"
      lang="ja"
    >
      <head>
        <title>{props.title}</title>
        <link rel="stylesheet" href="/index.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={props.desc} />
        <link rel="stylesheet" href="/public/kiso.css" />
        {importCardStyle && <link rel="stylesheet" href="/public/card.css" />}
        {importRecentStyle && (
          <link rel="stylesheet" href="/public/recent.css" />
        )}
        <script
          defer
          src="https://u.5seg.top/script.js"
          data-website-id="7b088d5c-069e-4582-b4ec-5122486702b7"
        ></script>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
