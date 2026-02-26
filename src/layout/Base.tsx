import { Html } from "@elysiajs/html";

export function Base(props: {
  title: string;
  desc: string;
  children: JSX.Element;
}) {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={props.desc} />
        <link rel="stylesheet" href="/public/kiso.css" />
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
