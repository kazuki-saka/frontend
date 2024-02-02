import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <article className={ "pickup" }>
      <Outlet />
    </article>
  );
}