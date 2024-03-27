import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import { reportcostom as ReportCostom } from "~/types/Report";
import { topic as topic } from "~/types/topic";
import Logo from "~/components/shared/Logo"; 
import ThumbPost from "~/components/shared/ThumbPost";
import PostCursor from "~/components/shared/PostCursor";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
    status: number;
    messages: { message: string };
    MarketReports: ReportCostom[];
    FishmanReports: ReportCostom[];
    topics: topic[];
}

type LoaderMarketApiResponse = {
  status: number;
  messages: { message: string };
  MarketReports: ReportCostom[];
}

type LoaderFishmanApiResponse = {
  status: number;
  messages: { message: string };
  FishmanReports: ReportCostom[];
}


/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  console.log("======pickup._index  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  console.log("session=", session);

  // 認証処理から利用者情報を取得
  const { user, likes, comments } = await guard({ request: request, context: context });
  
  // 利用者情報がない場合はエラー
  if (!user) {
    throw new Response(null, {
      status: 401,
      statusText: "認証に失敗しました。",
    });
  }

  // URLパラメータからrefを取得
  const ref = new URL(request.url).searchParams.get("ref");
  console.log("ref=", ref);

  const likeAry:string[] = session.get("home-user-like");
  const commentAry:string[] = session.get("home-user-comment");

  console.log("like=", likeAry);
  console.log("comment=", commentAry);

  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(session.get("signin-auth-user-signature")));
  formData.append("user[kind]", String(ref));
  console.log("user[signature]=", formData.get("user[signature]"));
  console.log("user[kind]=", formData.get("user[kind]"));

  //魚種にあった記事一覧API呼び出し（生産者）
  const apiResponseFishman = await fetch(`${ context.env.API_URL }/report/fishman.viewlist`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonDataFishman = await apiResponseFishman.json<LoaderFishmanApiResponse>();
  console.log("jsonData=", jsonDataFishman);

  // ステータス200以外の場合はエラー
  if (jsonDataFishman.status !== 200) {
    throw new Response(null, {
      status: jsonDataFishman.status,
      statusText: jsonDataFishman.messages.message,
    });
  }

  //魚種にあった記事一覧API呼び出し（市場関係者）
  const apiResponseMarket = await fetch(`${ context.env.API_URL }/report/market.viewlist`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonDataMarket = await apiResponseMarket.json<LoaderMarketApiResponse>();
  console.log("jsonData=", jsonDataMarket);

  // ステータス200以外の場合はエラー
  if (jsonDataMarket.status !== 200) {
    throw new Response(null, {
      status: jsonDataMarket.status,
      statusText: jsonDataMarket.messages.message,
    });
  }

  //セッションに魚種を保存
  //session.set("home-fishkind", ref);
  session.set("home-report-kind", ref);

  //自分がほしいねした記事にフラグを立てる
  if (likeAry != null){
    likeAry.forEach(tmpid => {
      let lIndex : number;
  
      lIndex = jsonDataMarket.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonDataMarket.MarketReports[lIndex].like_flg = true;
      }
  
      lIndex = jsonDataFishman.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonDataFishman.FishmanReports[lIndex].like_flg = true;
      }
    });      
  }

  //自分がコメントした記事にフラグを立てる
  if (commentAry != null){
    commentAry.forEach(tmpid => {
      let lIndex : number;
      
      console.log("comment.id=", tmpid);
      lIndex = jsonDataMarket.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("market comment on");
        jsonDataMarket.MarketReports[lIndex].comment_flg = true;
      }
  
      lIndex = jsonDataFishman.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("fishman comment on");
        jsonDataFishman.FishmanReports[lIndex].comment_flg = true;
      }
    });  
  }

  console.log("market");
  jsonDataMarket.MarketReports.forEach(tmp => {
    console.log("id=", tmp.id);
    console.log("comment_flg=", tmp.comment_flg);
  });

  return json(
    {
      user,
      market:  jsonDataMarket.MarketReports,
      fishman: jsonDataFishman.FishmanReports,
      ref: ref,
      uploads_url: context.env.UPLOADS_URL
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    });  
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { user, market, fishman, ref, uploads_url } = loaderData;
  
  if (ref) {
    return (
      <>
        <section className={ "container" }>
          <div className={ "wrap" }>
            <h1 className={ "flex flex-col justify-center items-center py-8 gap-2 md:gap-4" }>
              <Logo className={ "w-[120px] md:w-[240px] h-auto" }/>
              <p className={ "text-black/80 text-12ptr md:text-12ptr lg:text-16ptr xl:text-20ptr font-notoserifjp font-medium" }>ふくいの魚つながるアプリ</p>
            </h1>
          </div>
        </section>
        
        <section className={ "mb-8 relative" }>
          <figure className={ "block relative w-full pt-[66.7%] md:pt-[30.0%]" }>
            { (Number(ref) === 1) &&
            <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 2) &&
            <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 3) &&
            <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 4) &&
            <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-28 flex justify-center items-center" }>
            <span className={ "text-white text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>
              { (Number(ref) === 1) && "ふくいサーモン" }
              { (Number(ref) === 2) && "若狭ふぐ" }
              { (Number(ref) === 3) && "敦賀真鯛" }
              { (Number(ref) === 4) && "若狭まはた" }
            </span>
          </div>
        </section>
        
        <section className={ "container mb-12" }>
          <div className={ "wrap mb-8" }>
            <h2 className={ "text-20ptr md:text-28ptr font-semibold whitespace-nowrap" }>生産者の声</h2>
          </div>
          <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
            { fishman && fishman.map((repo) => (
            <ThumbPost 
              key={ repo.id }
              to={ `/home/reportview/?ref=view&id=${ repo.id }` }
              nickname={ repo.nickname }
              isLiked={ repo.like_flg }
              likeCount={ repo.like_cnt }
              isCommented={ repo.comment_flg }
              commentCount={ repo.comment_cnt }
              title={ repo.title }
              uploadsUrl={ uploads_url }
              imgPath={ repo.imgPath }
            />
            )) }
            { !fishman || fishman.length === 0 &&
            <p>記事はありません</p>
            }
          </div>
        </section>
        
        <section className={ "container" }>
          <div className={ "wrap mb-8" }>
            <h2 className={ "text-20ptr md:text-28ptr font-semibold whitespace-nowrap" }>福井市中央卸売市場からのお知らせ</h2>
          </div>
          <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
            { market && market.map((repo) => (
            <ThumbPost 
              key={ repo.id }
              to={ `/home/reportview/?ref=view&id=${ repo.id }` }
              nickname={ repo.nickname }
              isLiked={ repo.like_flg }
              likeCount={ repo.like_cnt }
              isCommented={ repo.comment_flg }
              commentCount={ repo.comment_cnt }
              title={ repo.title }
              uploadsUrl={ uploads_url }
              imgPath={ repo.imgPath }
            />
            ))}
            { !market || market.length === 0 &&
            <p>記事はありません</p>
            }
          </div>
        </section>

        { /** 生産者の場合のみ投稿ボタン表示 */}
        { Number(user.section) === 3 &&
          <PostCursor/>
        }
      </>
    );
  }
  
  return (
    <>
      <section className={ "container" }>
        <div className={ "wrap" }>
          <h1 className={ "flex flex-col justify-center items-center py-8 gap-2 md:gap-4" }>
            <Logo className={ "w-[120px] md:w-[240px] h-auto" }/>
            <p className={ "text-black/80 text-12ptr md:text-12ptr lg:text-16ptr xl:text-20ptr font-notoserifjp font-medium" }>ふくいの魚つながるアプリ</p>
          </h1>
        </div>
      </section>
      
      <section className={ "mb-4 relative" }>
        <Link to={ "/home/pickup?ref=1" } className={ "block relative" }>
          <figure className={ "block relative w-full pt-[50.0%] md:pt-[30.0%] bg-black" }>
            <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-16 md:h-20 xl:h-28 flex justify-center items-center" }>
            <span className={ "text-white text-24ptr md:text-32ptr lg:text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>ふくいサーモン</span>
          </div>
        </Link>
        <Link to={ "/home/pickup?ref=2" } className={ "block relative" }>
          <figure className={ "block relative w-full pt-[50.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-16 md:h-20 xl:h-28 flex justify-center items-center" }>
            <span className={ "text-white text-24ptr md:text-32ptr lg:text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>若狭ふぐ</span>
          </div>
        </Link>
        <Link to={ "/home/pickup?ref=3" } className={ "block relative" }>
          <figure className={ "block relative w-full pt-[50.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-16 md:h-20 xl:h-28 flex justify-center items-center" }>
            <span className={ "text-white text-24ptr md:text-32ptr lg:text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>敦賀真鯛</span>
          </div>
        </Link>
        <Link to={ "/home/pickup?ref=4" } className={ "block relative" }>
          <figure className={ "block relative w-full pt-[50.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-16 md:h-20 xl:h-28 flex justify-center items-center" }>
            <span className={ "text-white text-24ptr md:text-32ptr lg:text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>若狭まはた</span>
          </div>
        </Link>
      </section>
    </>
  );

}