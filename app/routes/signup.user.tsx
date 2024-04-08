import { json, redirect, MetaFunction, LoaderFunctionArgs, ActionFunctionArgs, HeadersFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { getSession, commitSession, destroySession } from "~/services/session.server";
import { Preflight } from "~/types/Preflight";
import { User as SignupUserFormData } from "~/types/User";
import { userSchema_step1, userSchema_step2, userSchema_step3, userSchema_step4 } from "~/schemas/signup";
import { Wrap as UserFormWrap, Step1 as UserFormStep1, Step2 as UserFormStep2, Step3 as UserFormStep3, Step4 as UserFormStep4 } from "~/components/signup/UserForm";

/*-----------------------------------------------
  本登録画面の処理
  STEP1～4で本登録を行う
------------------------------------------------*/

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "利用者登録 | FUKUI BRAND FISH" },
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
  console.log("======signup_user_LOADER======");
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // セッションから認証署名を取得
  const signature = session.get("signup-auth-preflight-signature");
  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }
  
  // セッションからフォームデータ取得
  const signupUserFormData = JSON.parse(session.get("signup-user-form-data") || "{}") as SignupUserFormData;
  
  // URLパラメータからstepを取得
  const step = new URL(request.url).searchParams.get("step") || 1;

  console.log("step=", step);
  
  // STEP1
  if (Number(step) === 1) {
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

    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      username: preflight.email // ユーザー名追加
    }
    // フォームデータをセッションに保存
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
      shopname: String(formData.get("user[shopname]")), // 店舗名・屋号追加
      viewname: String(formData.get("user[viewname]")), // ニックネーム追加
      personal: {
        name: String(formData.get("user[personal][name]")), // 名前追加
        //phonenumber: String(formData.get("user[personal][phonenumber]")) // 連絡先追加
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
    formData.append("user[shopname]", String(signupUserFormData.shopname));
    formData.append("user[viewname]", String(signupUserFormData.viewname));
    formData.append("user[personal][name]", String(signupUserFormData.personal.name));
    //formData.append("user[personal][phonenumber]", String(signupUserFormData.personal.phonenumber));
    
    console.log("user[username]=", formData.get("user[username]"));
    console.log("user[passphrase]=", formData.get("user[passphrase]"));
    console.log("user[section]=", formData.get("user[section]"));
    console.log("user[shopname]=", formData.get("user[shopname]"));
    console.log("user[viewname]=", formData.get("user[viewname]"));
    console.log("user[personal][name]=", formData.get("user[personal][name]"));
    //console.log("user[personal][phonenumber]=", formData.get("user[personal][phonenumber]"));

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
  // Step取得
  const step = loaderData.step;
  // SignupUserFormData取得
  const signupUserFormData = loaderData.signupUserFormData;
  
  
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