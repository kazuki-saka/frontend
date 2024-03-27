import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import sectionary from "~/components/report/form/sections";
  

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
          <h1 className={ "flex flex-col justify-center items-center py-8 gap-2 md:gap-4" }>
            <Logo className={ "w-[120px] md:w-[240px] h-auto" }/>
            <p className={ "text-black/80 text-12ptr md:text-12ptr lg:text-16ptr xl:text-20ptr font-notoserifjp font-medium" }>ふくいの魚つながるアプリ</p>
          </h1>
        </div>
      </section>

      <div className={ "container" }>
        <div className={ "wrap flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
          <h2 className={ "text-28ptr font-semibold" }>アカウント情報</h2>
        </div>

        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>メールアドレス(ユーザー名)</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ account.username }</p>
        </fieldset>
              
        <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>利用者区分</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ sectionary[Number(account.section) - 1].name }</p>
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

        <br></br>
        <p>
          <Link to={ "/signout" } className={ "button button--secondary rounded-full" }>サインアウト</Link>
        </p>
        <br></br>

        { /** 市場関係者の場合のみ生産者登録ボタン表示 */}
        { Number(account.section) === 4 &&
          <Link to={ "/home/fishmanuser" } >
            生産者の登録
          </Link>
        }
      </div>
    </>
  );
  
}