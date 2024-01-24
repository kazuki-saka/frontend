import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "利用者登録完了 | ふくいお魚つながるアプリ" },
    { name: "description", content: "ふくいお魚つながるアプリ" },
  ];
};

export default function Page() {

  return (
    <div className={ "bg-black" }>
      <div className={ "wrap flex justify-center items-center gap-16 min-h-[100vh]" }>
        <div className={ "text-white" }>
          <h2 className={ "text-24ptr font-semibold mb-4" }>FUKUI BRAND FISHにようこそ</h2>
          <p>アカウント登録が完了しました。</p>
        </div>
        <Link to={ "/signup/?ref=signin" } className={ "button button--secondary" }>サインイン</Link>
      </div>
    </div>
  );
}