import { createCookieSessionStorage } from "@remix-run/cloudflare";

const {
  getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60*60*24,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? true : false
  },
})
export { getSession, commitSession, destroySession };