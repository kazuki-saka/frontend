import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "問い合わせ完了 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISH" },
  ];
};

export default function Page() {

  return (
    <div className={ "bg-black" }>
      <div className={ "wrap flex justify-center items-center gap-16 min-h-[100vh]" }>
        <div className={ "text-white" }>
          <h2 className={ "text-24ptr font-semibold mb-4" }>問い合わせしました。</h2>
          <p>市場に問い合わせしました。</p>
          <p>市場から折り返しの連絡をお待ちください。</p>
        </div>
        <Link to={ "/home" } className={ "button button--secondary" }>サイトトップに戻る</Link>
      </div>
    </div>
  );
}