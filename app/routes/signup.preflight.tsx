import { json, redirect, MetaFunction, LoaderFunctionArgs, ActionFunctionArgs, HeadersFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, useNavigation, useSubmit, Link, Form } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { getSession, commitSession, destroySession } from "~/services/session.server";
import { Preflight } from "~/types/Preflight";
import AuthcodeInput from "~/components/signup/form/AuthcodeInput";
import Submitting from "~/components/signup/form/Submitting";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "メールアドレス認証 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISH" },
  ];
};

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  preflight: Preflight;
};

type ActionApiResponse = {
  status: number;
  messages: { message: string };
  signature: string;
};


/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======signup.preflight  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  
  console.log("session=", session);

  // URLパラメータからsignatureを取得
  const signature = new URL(request.url).searchParams.get("signature");

  console.log("signature=", signature);

  // FormData作成
  const formData = new FormData();
  formData.append("preflight[signature]", String(signature));
  
  // APIへデータを送信
  const apiResponse = await fetch(`${ context.env.API_URL }/signup/load.preflight`, { method: "POST", body: formData });
  // APIからデータを受信
  const jsonData = await apiResponse.json<LoaderApiResponse>();

  console.log("jsonData=", jsonData);

  // ステータス200以外の場合はエラー
  if (jsonData.status !== 200) {
    throw new Response(null, {
      status: jsonData.status,
      statusText: jsonData.messages.message,
    });
  }
  
  // Preflight取得
  const preflight = jsonData.preflight;
  console.log("preflight=", preflight);
  
  return json({
    preflight: preflight,
    signature: signature,
    error: session.get("signup-auth-preflight-error"),
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * Action
 */
export async function action({ request, context }: ActionFunctionArgs) {

  console.log("======signup.preflight  ACTION======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // フォームデータを取得
  const formData = await request.formData();
  
  // APIへデータを送信
  const apiResponse = await fetch(`${ context.env.API_URL }/signup/auth.preflight`, { method: "POST", body: formData });
  // APIからデータを受信
  const jsonData = await apiResponse.json<ActionApiResponse>();
  // 403エラーの場合
  if (jsonData.status === 403) {
    return json({
      error: "403"
    }, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } 
  
  // 認証署名をセッションに保存
  session.set("signup-auth-preflight-signature", jsonData.signature);
  
  // 本登録画面へリダイレクト
  return redirect("/signup/user", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // ACTION
  const actionData = useActionData<typeof action>();
  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // States
  const [authcode, setAuthcode] = useState<string>();
  
  // Effects
  useEffect(() => {
    if (buttonRef && buttonRef.current && authcode && authcode.length === 4) {
      buttonRef.current.click();
    }
  }, [buttonRef, authcode]);
  
  // Navigate
  const navigation = useNavigation();
  
  return (
    <div>
      <div className={ "modal-head" }>
        <p>メールアドレス認証</p>
      </div>
      { /* フォーム */ }
      <Form
        //validator={ preflightFormValidator_authcode } 
        replace={ false }
        method={ "POST" }
        ref={ formRef }
      >
        <h3 className={ "text-24ptr md:text-28ptr font-semibold" }>認証コード確認</h3>
        <p>ご登録いただいたメールアドレスに届いた4桁の認証コードを入力してください。</p>
        <AuthcodeInput setAuthcode={ setAuthcode } error={ loaderData.error } actionData={ actionData! }/>
        <input type={ "hidden" } name={ "preflight[authcode]" } value={ authcode! }/>
        <input type={ "hidden" } name={ "preflight[signature]" } value={ loaderData.signature! }/>
        <div>
          <button 
            type={ `${ navigation.state === "idle" ? "submit" : "button" }` } 
            className={ "button button--primary hidden" }
            disabled={ navigation.state === "submitting" }
            ref={ buttonRef }
          >
            { navigation.state !== "submitting" ? "送信" : "お待ちください" }
          </button>
        </div>
        <div className={ "flex flex-col md:flex-row gap-4" }>
          <Link to={ "/signup?ref=preflight" } className={ "button button--secondary" }>認証メールを再送信</Link>
          <Link to={ "/signup" } className={ "button button--secondary" }>閉じる</Link>
        </div>
      </Form>
      { /* ローディング */ }
      <Submitting state={ navigation.state } />
    </div>
  );
}