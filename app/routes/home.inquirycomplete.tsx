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
        <div className={ "text-white px-0 md:px-[10%] pt-8" }>
          <h2 className={ "text-22ptr font-semibold mb-4" }>問い合わせしました。</h2>
          <p>福井中央卸売市場から折り返しの連絡をお待ちください。</p>
        </div>
        <Link to={ "/home" } className={ "button button--secondary" }>サイトトップに戻る</Link>
      </div>
    </div>
  );
}