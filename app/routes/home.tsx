import { Outlet } from "@remix-run/react";
import Navbar from "~/components/shared/Navbar";
import PostCursor from "~/components/shared/PostCursor";

export default function Layout() {
  return (
    <div className={ "md:pl-[100px]" }>
      <Navbar/>
      <main className={ "home flex-1 overflow-x-hidden pb-32" }>
        <Outlet />
      </main>
    </div>
  );
}