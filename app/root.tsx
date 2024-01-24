import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { ReactNode } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import appCssBunbleHref from "~/styles/app.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: appCssBunbleHref },
];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

/*
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div className={ "w-full h-[100vh] flex justify-center items-center" }>
            <h1 className={ "text-60ptr font-bold" }>
              { error.status }  { error.statusText }
            </h1>
            <p>{ error.data }</p>
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
}
*/

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title>エラー</title>
        </head>
        <body>
          <div className={ "container error-container" }>
            <h1>{ error.status }</h1>
            <p>{ error.statusText }</p>
          </div>
        </body>
      </html>
    );
  } else if (error instanceof Error) {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title>エラー</title>
        </head>
        <body>
          <div className={ "container error-container" }>
            <h1>Error</h1>
            <p>{ error.message }</p>
            <p>The stack trace is:</p>
            <pre>{ error.stack }</pre>
          </div>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title>エラー</title>
        </head>
        <body>
          <div className={ "container error-container" }>
            <h1>Unknown Error</h1>
          </div>
        </body>
      </html>
    );
  }
}