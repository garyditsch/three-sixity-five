import { type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { readUserSession } from "./utils/auth";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request)
  console.log('USER IN ROOT', user);
  return {
    user
  }
}

export default function App() {
  const user = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head className="h-screen">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen grid grid-rows-layout">
        <Outlet context={user} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
