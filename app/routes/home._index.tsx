import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

export default function Page() {
  return (
    <div className={ "container" }>
      <div className={ "wrap" }>
        <h1 className={ "text-30ptr font-semibold" }>認証後トップページ</h1>
        <p><Link to={ "/signout" }>サインアウト</Link></p>
      </div>
    </div>
  );
}
