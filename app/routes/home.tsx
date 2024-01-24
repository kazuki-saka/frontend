import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <article className={ "home" }>
      <Outlet />
    </article>
  );
}