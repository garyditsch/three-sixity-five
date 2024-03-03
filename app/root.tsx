import type { LinksFunction } from "@remix-run/node";
import rdtStylesheet from "remix-development-tools/index.css";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },

  ...(process.env.NODE_ENV === "development" ? [{ rel: "stylesheet", href: rdtStylesheet }] : []),
];

function App() {
  return (
    <html lang="en">
      <head className="h-screen">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen grid grid-rows-layout">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

let AppExport = App;
// This imports the dev tools only if you're in development
if(process.env.NODE_ENV === 'development') { 
  const { withDevTools } = await import("remix-development-tools"); 
  AppExport = withDevTools(AppExport);
}

export default AppExport;
