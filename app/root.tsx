import { type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { readUserSession } from "./utils/auth";

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
];

export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request)
  return {
    user
  }
}

export default function App() {
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
