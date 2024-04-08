import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import { reportcostom as ReportCostom } from "~/types/Report";
import ThumbPost from "~/components/shared/ThumbPost";

/*-----------------------------------------------
  自分が投稿した記事一覧画面   
------------------------------------------------*/

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  rejistreports: ReportCostom[];
}
  

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======postlist  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  
  // 認証署名取得
  const signature = session.get("signin-auth-user-signature");
  
  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
    status: 401,
    statusText: "署名の検証に失敗しました。",
    });
  }
  // 認証情報取得
  const { user, likes, comments } = await guard({ request: request, context: context });  
  
  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(session.get("signin-auth-user-signature")));

  //自分がしたほしいね情報を取得
  const apiResponse = await fetch(`${ context.env.API_URL }/mernu/Rejistlist`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonDataLikes = await apiResponse.json<LoaderApiResponse>();
  if (jsonDataLikes.status !== 200) {
    throw new Response(null, {
      status: jsonDataLikes.status,
      statusText: jsonDataLikes.messages.message,
    });
  }
  console.log("jsonDataLikes.rejistreports=", jsonDataLikes.rejistreports);
  
  return json({
    rejistreport: jsonDataLikes.rejistreports,
    uploads_url: context.env.UPLOADS_URL,
    likes: likes,
    comments: comments
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
  
export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  const { rejistreport } = loaderData;
  const { uploads_url } = loaderData;
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
      
      <div className={ "container flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
        <h2 className={ "text-28ptr font-semibold" }>今までの投稿一覧</h2>
      </div>

      <div className={ "container grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
        { rejistreport.map((repo) => (
          <ThumbPost 
            key={ repo.id }
            to={ `/home/reportview/?ref=view&id=${ repo.id }` }
            title={ repo.title }
            nickname={ repo.nickname }
            uploadsUrl={ uploads_url }
            imgPath={ repo.imgPath }
            isLiked={ likes.indexOf(String(repo.id)) == -1 ? false:true }
            isCommented={ comments.indexOf(String(repo.id)) == -1 ? false:true}
            likeCount={ repo.like_cnt }
            commentCount={ repo.comment_cnt }
          />
        )) }
      </div>
    </>
  );
  
}