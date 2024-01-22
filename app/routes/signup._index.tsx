import { json, redirect, MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import PreflightFormModal from "~/components/signup/PreflightFormModal";
import SigninFormModal from "~/components/signup/SigninFormModal";
import PreflightCompleteModal from "~/components/signup/PreflightCompleteModal";

/*
  サインイン前のトップ画面
  仮登録画面とサイン画面の呼び出しを行う
*/

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "サインイン | ふくいお魚つながるアプリ" },
    { name: "description", content: "ふくいお魚つながるアプリ" },
  ];
};

/**
 * Loader
 */
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("======signup._index  LOADER======");
  // URLパラメータからrefを取得
  const ref = new URL(request.url).searchParams.get("ref");
  // JSON形式で返却
  return json({
    ref: ref
  });
}

type PreflightActionResponse = {
  status?: number;
};

/**
 * Action
 */
export async function action({ request }: ActionFunctionArgs) {
  console.log("======signup._index  ACTION======");
  // フォームデータを取得
  const formData = await request.formData();
  
  // メールアドレス認証フォーム
  if (formData.get("form") === "preflight") {
    console.log("formData.email=", formData.get("preflight[email]"));

    // APIへデータを送信(php spark serve --host 0.0.0.0)
    //const response = await fetch("http://localhost:8080/api/signup/create.preflight", { method: "POST", body: formData });
    const response = await fetch("http://localhost:8080/UserTempController/Add", { method: "POST", body: formData });

    // JSONデータを受信
    const jsonData = await response.json<PreflightActionResponse>();    
    console.log("jsonData=", jsonData);

    // ステータスが200以外の場合はエラー
    if (jsonData.status !== 200) {
      return redirect("/signup?ref=error");
    }
    
    return redirect("/signup?ref=complete");
  }
  
  // サインインフォーム
  if (formData.get("form") === "signin") {

    console.log("formData=", formData);
    //console.log("formData.email=", formData.get("signin[email]"));
    const response = await fetch("http://localhost:8080/SignInController", { method: "POST", body: formData });

    // JSONデータを受信
    const jsonData = await response.json<PreflightActionResponse>();    
    console.log("jsonData=", jsonData);
    
  }
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // ACTION
  const actionData = useActionData<typeof action>();
  
  return (
    <article className={ "bg-signup" }>
      <div className={ "container" }>
        <div className={ "absolute bottom-20 left-0 w-full px-4 md:px-20" }>
          <div className={ "flex flex-col md:flex-row gap-4" }>
            <Link to={ "/signup?ref=preflight" } className={ "button button--primary rounded-full" }>新規登録</Link>
            <Link to={ "/signup?ref=signin" } className={ "button button--secondary rounded-full" }>サインイン</Link>
          </div>
        </div>
      </div>
      { /* 仮登録フォームモーダル */ }
      <PreflightFormModal 
        loaderData={ loaderData! }
        actionData={ actionData! }
      />
      { /* 仮登録完了モーダル */ }
      <PreflightCompleteModal 
        loaderData={ loaderData! }
      />
      { /* サインインフォームモーダル */ }
      <SigninFormModal 
        loaderData={ loaderData! }
        actionData={ actionData! }
      />
    </article>
  );
}