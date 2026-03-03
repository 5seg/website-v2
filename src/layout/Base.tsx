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
    <html>
      <head>
        <title>{props.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={props.desc} />
        <link rel="stylesheet" href="/public/kiso.css" />
        <link rel="stylesheet" href="/index.css" />
        {importCardStyle && <link rel="stylesheet" href="/public/card.css" />}
        {importRecentStyle && (
          <link rel="stylesheet" href="/public/recent.css" />
        )}
      </head>
      <body>{props.children}</body>
    </html>
  );
}
