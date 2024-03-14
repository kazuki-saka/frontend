import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import BrandImage from "~/components/signup/BrandImage";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "利用者登録完了 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISH" },
    { name: "preload", content: "/assets/images/brand/karei.webp" },
    { name: "preload", content: "/assets/images/brand/kani.webp" },
    { name: "preload", content: "/assets/images/brand/sarmon.webp" },
    { name: "preload", content: "/assets/images/brand/fugu.webp" },
    { name: "preload", content: "/assets/images/brand/madai.webp" },
    { name: "preload", content: "/assets/images/brand/guji.webp" },
    { name: "preload", content: "/assets/images/brand/mahata.webp" },
    { name: "preload", content: "/assets/images/brand/kaki.webp" },
    { name: "preload", content: "/assets/images/brand/saba.webp" },
  ];
};

export default function Page() {

  return (
    <div className={ "relative z-10 min-h-screen" }>
      <div className="absolute top-0 left-0 w-full h-full max-h-screen overflow-hidden -z-10 grid grid-cols-2 lg:grid-cols-3">
        <BrandImage src="/assets/images/brand/karei.webp" alt="カレイ" key={ 0 }/>
        <BrandImage src="/assets/images/brand/kani.webp" alt="カニ"  key={ 1 }/>
        <BrandImage src="/assets/images/brand/sarmon.webp" alt="サーモン" key={ 2 }/>
        <BrandImage src="/assets/images/brand/fugu.webp" alt="フグ" key={ 3 }/>
        <BrandImage src="/assets/images/brand/madai.webp" alt="マダイ" key={ 4 }/>
        <BrandImage src="/assets/images/brand/guji.webp" alt="グジ" key={ 5 }/>
        <BrandImage src="/assets/images/brand/mahata.webp" alt="マハタ" key={ 6 }/>
        <BrandImage src="/assets/images/brand/kaki.webp" alt="カキ" key={ 7 }/>
        <BrandImage src="/assets/images/brand/saba.webp" alt="サバ" key={ 8 }/>
      </div>
      <div className={ "container flex flex-col justify-center items-center gap-16 min-h-screen" }>
        <div>
          <h2 className={ "text-56ptr text-white font-medium whitespace-nowrap mb-4" }>FUKUI BRAND FISHにようこそ</h2>
          <p className={ "text-24ptr text-white text-center whitespace-nowrap" }>アカウント登録が完了しました。</p>
        </div>
        <div className={ "w-full px-[20%]" }>
          <Link to={ "/signup/?ref=signin" } className={ "button button--secondary" }>サインイン</Link>
        </div>
        
      </div>
    </div>
  );
}