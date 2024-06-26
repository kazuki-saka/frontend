import type { LoaderFunctionArgs, MetaFunction  } from "@remix-run/cloudflare";
import { json, useLoaderData, Link, LinkProps } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import ThumbPost from "~/components/shared/ThumbPost";
import { reportcostom as ReportCostom } from "~/types/Report";

/*-----------------------------------------------
  サインイン後のトップ画面  
------------------------------------------------*/

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  topics: ReportCostom[];
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  console.log("======home._index  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // 認証処理から認証署名を取得
  const { user, likes, comments } = await guard({ request: request, context: context });
  // 利用者情報をセッションに保存
  if (user) {
    //session.set("signin-auth-user", user);
  }
  console.log("user=", user);

  // いいねリストをセッションに保存
  if (likes && likes.length > 0) {
    //console.log("likes=", likes);
    session.set("home-user-like", likes);
  }

  // コメントリストをセッションに保存
  if (comments && comments.length > 0) {
    session.set("home-user-comment", comments);
  }

  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(session.get("signin-auth-user-signature")));

  //トピックス情報を取得
  const apiResponse = await fetch(`${ context.env.API_URL }/top/view`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonDataTopics = await apiResponse.json<LoaderApiResponse>();
  // ステータス200以外の場合はエラー
  if (jsonDataTopics.status !== 200) {
    throw new Response(null, {
      status: jsonDataTopics.status,
      statusText: jsonDataTopics.messages.message,
    });
  }
  
  session.set("home-pickup-fishman-index", 0);
  

  return json({
    user, likes, comments,topics: jsonDataTopics.topics, uploads_url: context.env.UPLOADS_URL,
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { user } = loaderData;
  const { uploads_url } = loaderData;
  const { topics } = loaderData;
  const { likes } = loaderData;
  const { comments } = loaderData;
  
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
      <section className={ "container mb-12" }>
        <div className={ "wrap grid grid-cols-2 gap-1 md:gap-4" }>
          <Link to={ "/home/pickup?ref=1" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-22ptr md:text-40ptr font-semibold whitespace-nowrap drop-shadow-sm" }>ふくいサーモン</span>
          </Link>
          <Link to={ "/home/pickup?ref=2" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-22ptr md:text-40ptr font-semibold whitespace-nowrap drop-shadow-sm" }>若狭ふぐ</span>
          </Link>
          <Link to={ "/home/pickup?ref=3" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-22ptr md:text-40ptr font-semibold whitespace-nowrap drop-shadow-sm" }>敦賀真鯛</span>
          </Link>
          <Link to={ "/home/pickup?ref=4" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-22ptr md:text-40ptr font-semibold whitespace-nowrap drop-shadow-sm" }>若狭まはた</span>
          </Link>
        </div>
        
      </section>
      <section className={ "container" }>
        { user.section == 3 &&
          <div className={ "wrap" }>
            <Link to={ "/home/postlist" } className={ " button button--primary" }>
              あなたの投稿一覧
            </Link>
            <br></br>
            <br></br>
          </div>
        }
        <div className={ "wrap flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
          <h2 className={ "text-26ptr font-semibold" }>新着情報</h2>
        </div>
        <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
          { topics && topics.map((repo) => (
              <ThumbPost 
                key={ repo.id }
                to={ `/home/reportview/?ref=view&id=${ repo.id }` }
                nickname={ repo.nickname }
                isLiked={ likes.indexOf(String(repo.id)) == -1 ? false:true }
                likeCount={ repo.like_cnt }
                isCommented={ comments.indexOf(String(repo.id)) == -1 ? false:true }
                commentCount={ repo.comment_cnt }
                title={ repo.title }
                uploadsUrl={ uploads_url }
                imgPath={ repo.imgPath }
              />
            )) }
        </div>
      </section>
    </>
  );
}