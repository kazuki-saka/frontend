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
      <div className={ "wrap flex justify-center items-center gap-8 min-h-[100vh]" }>
        <div className={ "text-white px-0 ml-2 md:px-[10%] pt-8" }>
          <h2 className={ "text-22ptr font-semibold" }>問い合わせを受付ました。</h2>
          <p>福井中央卸売市場からの回答をお待ちください。</p>
        </div>
        <Link to={ "/home" } className={ "mr-2 button button--secondary" }>サイトトップに戻る</Link>
      </div>
    </div>
  );
}