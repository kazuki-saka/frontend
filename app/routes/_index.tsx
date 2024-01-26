import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISH" },
  ];
};

export default function Page() {
  return (
    <article className={ "container" }>
      <div className={ "wrap" }>
        <h1 className={ "text-30ptr font-semibold" }>トップページ</h1>
        <p><Link to={ "/signup" }>サインアップ</Link></p>
      </div>
    </article>
  );
}
