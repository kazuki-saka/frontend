import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Page() {
  return (
    <article className={ "container" }>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            className={ " text-32ptr" }
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
      </ul>
    </article>
  );
}
