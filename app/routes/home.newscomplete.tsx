import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "投稿完了 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISH" },
  ];
};

export default function Page() {

  return (
    <div className={ "bg-black" }>
      <div className={ "wrap flex justify-center items-center gap-16 min-h-[100vh]" }>
        <div className={ "text-white" }>
          <h2 className={ "text-24ptr font-semibold mb-4" }>FUKUI BRAND FISHにようこそ</h2>
          <p>投稿が完了しました。市場関係者による許可が下り次第、投稿が反映されます。</p>
        </div>
        <Link to={ "/signup/?ref=signin" } className={ "button button--secondary" }>サインイン</Link>
      </div>
    </div>
  );
}