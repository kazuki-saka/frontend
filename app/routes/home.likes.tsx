import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import { ReporltLike } from "~/types/Report";
import ThumbPost from "~/components/shared/ThumbPost";

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  likereports: ReporltLike[];
}
  

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======likes  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
  const signature = await guard({ request: request, context: context });
  console.log("signature=", signature);

  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
    status: 401,
    statusText: "署名の検証に失敗しました。",
    });
  }

  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(session.get("signin-auth-user-signature")));

  //自分がしたいいね情報を取得
  const apiResponse = await fetch(`${ context.env.API_URL }/mernu/likelist`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonDataLikes = await apiResponse.json<LoaderApiResponse>();
  if (jsonDataLikes.status !== 200) {
    throw new Response(null, {
      status: jsonDataLikes.status,
      statusText: jsonDataLikes.messages.message,
    });
  }
  console.log("jsonDataLikes.likereports=", jsonDataLikes.likereports);
  
  return json({
    likereport: jsonDataLikes.likereports
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
  
export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  const { likereport } = loaderData;

  return (
    <>
      <section className={ "container" }>
        <div className={ "wrap" }>
          <Logo/>
        </div>
      </section>

      <div className={ "wrap flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
        <h2 className={ "text-28ptr font-semibold" }>あなたがいいねした記事一覧</h2>
      </div>

      <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
        { likereport.map((repo) => (
          <ThumbPost 
            key={ repo.reportid }
            to={ `/home/reportview/?ref=view&id=${ repo.reportid }` }
            title={ repo.title }
            nickname={ repo.nickname }
          />
        )) }
      </div>
    </>
  );
  
}