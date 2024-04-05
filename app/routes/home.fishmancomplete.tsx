import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import BrandImage from "~/components/signup/BrandImage";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "生産者登録完了 | FUKUI BRAND FISH" },
    { name: "description", content: "福井の海で育まれた新鮮な魚介類「FUKUI BRAND FISH」をご紹介します。私たちが厳選した海の恵みを、豊富な種類と鮮度抜群でお届けします。福井の海の味をご家庭でお楽しみいただけるよう、品質にこだわった海産物を提供しています。" },
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
        <BrandImage src="/assets/images/brand/kaki.webp" alt="カキ" className={ "hidden lg:block" } key={ 7 }/>
        <BrandImage src="/assets/images/brand/saba.webp" alt="サバ" key={ 8 }/>
      </div>
      <div className={ "container flex flex-col justify-center items-center gap-16 min-h-screen" }>
        <div>
          <h2 className={ "text-24ptr md:text-36ptr lg:text-48ptr xl:text-56ptr text-white text-center font-medium whitespace-nowrap mb-4" }>FUKUI BRAND FISHにようこそ</h2>
          <p className={ "text-16ptr md:text-20ptr lg:text-24ptr text-white text-center whitespace-nowrap" }>アカウント登録が完了しました。</p>
        </div>
        <div className={ "w-full px-[20%]" }>
          <Link to={ "/home" } className={ "button button--secondary" }>サイトトップに戻る</Link>
        </div>
        
      </div>
    </div>
  );
}