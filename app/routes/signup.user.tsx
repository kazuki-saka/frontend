import { json, redirect, MetaFunction, LoaderFunctionArgs, ActionFunctionArgs, HeadersFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { getSession, commitSession, destroySession } from "~/session.server";
import { Preflight, User as SignupUserFormData } from "~/types/signup";
import { userSchema_step1, userSchema_step2, userSchema_step3, userSchema_step4 } from "~/schemas/signup";
import { Wrap as UserFormWrap, Step1 as UserFormStep1, Step2 as UserFormStep2, Step3 as UserFormStep3, Step4 as UserFormStep4 } from "~/components/signup/UserForm";

/*
  本登録画面の処理
  STEP1～4で本登録を行う
*/

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "利用者登録 | ふくいお魚つながるアプリ" },
    { name: "description", content: "ふくいお魚つながるアプリ" },
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
  console.log("======signup_user_LOADER======");
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // セッションから認証署名を取得
  const signature = session.get("signup-auth-preflight-signature");
  // セッションからフォームデータ取得
  const signupUserFormData = JSON.parse(session.get("signup-user-form-data") || "{}") as SignupUserFormData;
  
  // URLパラメータからstepを取得
  const step = new URL(request.url).searchParams.get("step") || 1;
  // STEP1
  if (Number(step) === 1) {
    // FormData作成
    const formData = new FormData();
    formData.append("preflight[signature]", String(signature));
    // APIへデータを送信
    //const apiResponse = await fetch("http://localhost:8080/api/signup/load.preflight", { method: "POST", body: formData });
    //const apiResponse = await fetch("http://localhost:8080/UserRegistController", { method: "POST", body: formData });
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

    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      username: preflight.email // ユーザー名追加
    }
    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));

    return json({
      step: step ? step : 1,
      preflight: preflight,
      signupUserFormData: _signupUserFormData,
    }, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  // 確認画面のとき
  if (Number(step) === 4) {
    return json({
      step: 4,
      signupUserFormData: signupUserFormData,
    }, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json({
    step: step ? step : 1,
    signupUserFormData: signupUserFormData,
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
  console.log("======signup_user_ACTION======");
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // リクエストからフォームデータ取得
  const formData = await request.formData();

  // セッションからフォームデータ取得
  const signupUserFormData = JSON.parse(session.get("signup-user-form-data") || "{}") as SignupUserFormData;
  console.log("signupUserFormData=", signupUserFormData);
  console.log("step=", formData.get("step"));
  
  // STEP1
  if (Number(formData.get("step")) === 1) {
    // バリデーション
    const userValidate_step1 = await userSchema_step1.validate(formData);
    // バリデーションエラー
    if (userValidate_step1.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }
    
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      passphrase: String(formData.get("user[passphrase]")) // パスワード追加
    }

    console.log("_signupUserFormData=", _signupUserFormData);

    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    console.log("session2=", session);
    console.log("session.signup-user-form-data=", session.get("signup-user-form-data"));

    
    // STEP2へリダイレクト
    return redirect(`/signup/user?step=2`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  // STEP2
  if (Number(formData.get("step")) === 2) {
    // バリデーション
    const userValidate_step2 = await userSchema_step2.validate(formData);
    // バリデーションエラー
    if (userValidate_step2.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }
    
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      section: Number(formData.get("user[section]")), // 利用者区分追加
    }
    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    
    // STEP3へリダイレクト
    return redirect(`/signup/user?step=3`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  // STEP3
  if (Number(formData.get("step")) === 3) {
    // バリデーション
    const userValidate_step3 = await userSchema_step3.validate(formData);
    // バリデーションエラー
    if (userValidate_step3.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }
    
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      viewname: String(formData.get("user[viewname]")), // 店舗名・屋号追加
      personal: {
        name: String(formData.get("user[personal][name]")), // 名前追加
        phonenumber: String(formData.get("user[personal][phonenumber]")) // 連絡先追加
      }
    }
    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    
    // STEP4へリダイレクト
    return redirect(`/signup/user?step=4`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // STEP4(Confirm)
  if (Number(formData.get("step")) === 4) {
    // セッションからフォームデータ取得
    const signupUserFormData = await JSON.parse(await session.get("signup-user-form-data")) as SignupUserFormData;

    // フォームデータ生成
    const formData = new FormData();
    formData.append("user[username]", String(signupUserFormData.username));
    formData.append("user[passphrase]", String(signupUserFormData.passphrase));
    formData.append("user[section]", String(signupUserFormData.section));
    formData.append("user[viewname]", String(signupUserFormData.viewname));
    formData.append("user[personal][name]", String(signupUserFormData.personal.name));
    formData.append("user[personal][phonenumber]", String(signupUserFormData.personal.phonenumber));
    
    // バリデーション
    const userValidate_step4 = await userSchema_step4.validate(formData);
    // バリデーションエラー
    if (userValidate_step4.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }

    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/signup/create.user`, { method: "POST", body: formData });
    // APIからデータを受信
    const jsonData = await apiResponse.json<ActionApiResponse>();
    // ステータス200の場合はエラー

    //formData.append("complete[token]", String(token));
    //formData.append("complete[pass]", signupUserFormData.password);
    //formData.append("complete[section]", String(signupUserFormData.section));
    //formData.append("complete[name]", signupUserFormData.name);
    //formData.append("complete[tel]", signupUserFormData.phonenumber);

    //console.log("formData.complete[token]=", formData.get("complete[token]"));
    //console.log("formData.complete[pass]=", formData.get("complete[pass]"));
    //console.log("formData.complete[section]=", formData.get("complete[section]"));
    //console.log("formData.complete[name]=", formData.get("complete[name]"));
    //console.log("formData.complete[tel]=", formData.get("complete[tel]"));

    //const response = await fetch("http://localhost:8080/UserRegistController/Add", { method: "POST", body: formData });
    // JSONデータを受信
    //const jsonData = await response.json<PRegistActionResponse>();    
    console.log("jsonData=", jsonData);
    if (jsonData.status !== 200) {
      throw new Response(null, {
        status: jsonData.status,
        statusText: jsonData.messages.message,
      });
    }

    // 利用者登録完了画面へリダイレクト
    return redirect("/signup/complete", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export default function Page() {
  console.log("======signup_user_Page======");
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  console.log("loaderData=", loaderData);
  // Step取得
  const step = loaderData.step;
  console.log("step=", step);
  // SignupUserFormData取得
  const signupUserFormData = loaderData.signupUserFormData;
  console.log("signupUserFormData=", signupUserFormData);
  
  
  return (
    <article>
      <div className={ "modal-head" }>
        <p>新規登録</p>
      </div>
      
      <AnimatePresence initial={ false }>
        { /* フォーム1 */ }
        { Number(step) === 1 &&
        <UserFormWrap key={ "step1" }>
          <UserFormStep1 signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
        { /* フォーム2 */ }
        { Number(step) === 2 &&
        <UserFormWrap key={ "step2" }>
          <UserFormStep2 signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
        { /* フォーム3 */ }
        { Number(step) === 3 &&
        <UserFormWrap key={ "step3" }>
          <UserFormStep3 signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
        { /* フォーム4 */ }
        { Number(step) === 4 &&
        <UserFormWrap key={ "step4" }>
          <UserFormStep4 signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
      </AnimatePresence>
    </article>
  );
}