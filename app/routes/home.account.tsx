import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import sections from "~/components/signup/form/sections";
  

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======Account  LOADER======");

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

  console.log("user=", signature.user);
  
  return json({
    account: signature.user
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
  
export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  const { account } = loaderData;

  return (
    <>
      <section className={ "container" }>
        <div className={ "wrap" }>
          <Logo/>
        </div>
      </section>

      <div className={ "wrap" }>
        <div className={ "wrap flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
          <h2 className={ "text-28ptr font-semibold" }>アカウント情報</h2>
        </div>

        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>メールアドレス(ユーザー名)</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ account.username }</p>
        </fieldset>
              
        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>利用者区分</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ sections.filter((section) => section.value === account.section)[0].name }</p>
        </fieldset>
        
        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>店舗名・屋号</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ account.shopname }</p>
        </fieldset>
        
        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>お名前</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ account.rejistname }</p>
        </fieldset>
        
        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>ニックネーム</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ account.nickname }</p>
        </fieldset>

        <p>
          <Link to={ "/signout" } className={ "button button--secondary rounded-full" }>サインアウト</Link>
        </p>

      </div>
    </>
  );
  
}