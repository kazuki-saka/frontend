import { json, MetaFunction, LoaderFunctionArgs, ActionFunctionArgs, redirect, HeadersFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Link, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { getSession, commitSession, destroySession } from "~/session.server";
import { Preflight } from "~/types/Preflight";
import { SignupUserFormData } from "~/types/SignupUserFormData";
import UserFormWrap from "~/components/signup/UserFormWrap";
import UserFormStep1 from "~/components/signup/UserFormStep1";
import UserFormStep2 from "~/components/signup/UserFormStep2";
import UserFormStep3 from "~/components/signup/UserFormStep3";
import UserFormStep4 from "~/components/signup/UserFormStep4";
import RegistCompleteModal from "~/components/signup/RegistCompleteModal";

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

type ApiResponse = {
  status: number;
  preflight: Preflight;
};

type PRegistActionResponse = {
  status?: number;
};

/**
 * Loader
 */
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("======signup_user_LOADER======");
  // URLパラメータからtokenを取得
  const token = new URL(request.url).searchParams.get("token");
  // URLパラメータからstepを取得
  const step = new URL(request.url).searchParams.get("step");
  // FormData作成
  const formData = new FormData();
  formData.append("preflight[token]", String(token));
  
  console.log("token=", token);
  console.log("step=", step);

  // APIへデータを送信
  //const apiResponse = await fetch("http://localhost:8080/api/signup/load.preflight", { method: "POST", body: formData });
  const apiResponse = await fetch("http://localhost:8080/UserRegistController", { method: "POST", body: formData });

  // APIからデータを受信
  const jsonData = await apiResponse.json<ApiResponse>();
  console.log("jsonData=", jsonData);

  if (jsonData.status === 2){
    return redirect("/signup?ref=error");
  }
  // ステータスが404の場合はNotFound表示
  if (jsonData.status === 404) {
    console.log("status 404");
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  
  // Preflight取得
  const preflight = jsonData.preflight;
  console.log("preflight=", preflight);

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  //session.unset("signup-user-form-data");
  //session.unset("signup-user-form-direction");
  //await destroySession(session);
  
  console.log("session=", session);

  // セッションからフォームデータ取得
  const signupUserFormData = JSON.parse(session.get("signup-user-form-data") || "{}") as SignupUserFormData;
  
  console.log("signupUserFormData=", signupUserFormData);

  return json({
    step: step ? step : 1,
    preflight: preflight,
    signupUserFormData: signupUserFormData,
  });
}

/**
 * Action
 */
export async function action({ request }: ActionFunctionArgs) {
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
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      password: String(formData.get("user[password]")) // パスワード追加
    }

    console.log("_signupUserFormData=", _signupUserFormData);

    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    console.log("session2=", session);
    console.log("session.signup-user-form-data=", session.get("signup-user-form-data"));

    
    // STEP2へリダイレクト
    return redirect(`/signup/user?token=${ formData.get("token") }&step=2`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  // STEP2
  if (Number(formData.get("step")) === 2) {
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      section: Number(formData.get("user[section]")), // 利用者区分追加
    }
    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    // STEP3へリダイレクト
    return redirect(`/signup/user?token=${ formData.get("token") }&step=3`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  // STEP3
  if (Number(formData.get("step")) === 3) {
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData,
      name: String(formData.get("user[name]")), // 名前追加
      phonenumber: String(formData.get("user[phonenumber]")) // 連絡先追加
    }
    // セッションに保存
    session.set("signup-user-form-data", JSON.stringify(_signupUserFormData));
    // STEP4へリダイレクト
    return redirect(`/signup/user?token=${ formData.get("token") }&step=4`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // STEP4
  if (Number(formData.get("step")) === 4){
    console.log("-----------step4----------");
    // フォームデータ再構築
    const _signupUserFormData = {
      ...signupUserFormData
    }

    // FormData作成
    const formData = new FormData();
    const token = new URL(request.url).searchParams.get("token");

    formData.append("complete[token]", String(token));
    formData.append("complete[pass]", signupUserFormData.password);
    formData.append("complete[section]", String(signupUserFormData.section));
    formData.append("complete[name]", signupUserFormData.name);
    formData.append("complete[tel]", signupUserFormData.phonenumber);

    console.log("formData.complete[token]=", formData.get("complete[token]"));
    console.log("formData.complete[pass]=", formData.get("complete[pass]"));
    console.log("formData.complete[section]=", formData.get("complete[section]"));
    console.log("formData.complete[name]=", formData.get("complete[name]"));
    console.log("formData.complete[tel]=", formData.get("complete[tel]"));

    const response = await fetch("http://localhost:8080/UserRegistController/Add", { method: "POST", body: formData });
    // JSONデータを受信
    const jsonData = await response.json<PRegistActionResponse>();    
    console.log("jsonData=", jsonData);
    if (jsonData.status !== 200) {
      return redirect("/signup?ref=error");
    }

    return redirect("/signup/complete");
  }
}

export default function Page() {
  console.log("======signup_user_Page======");
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  console.log("loaderData=", loaderData);
  // Preflight取得
  const preflight = loaderData.preflight;
  console.log("preflight=", preflight);
  // Step取得
  const step = loaderData.step;
  console.log("step=", step);
  // SignupUserFormData取得
  const signupUserFormData = loaderData.signupUserFormData;
  console.log("signupUserFormData=", signupUserFormData);
  
  // ACTION
  const actionData = useActionData<typeof action>();
  
  return (
    <article>
      <div className={ "modal-head" }>
        <p>新規登録</p>
      </div>
      
      <AnimatePresence initial={ false }>
        { /* フォーム1 */ }
        { Number(step) === 1 &&
        <UserFormWrap key={ "step1" }>
          <UserFormStep1 preflight={ preflight }/>
        </UserFormWrap>
        }
        { /* フォーム2 */ }
        { Number(step) === 2 &&
        <UserFormWrap key={ "step2" }>
          <UserFormStep2 preflight={ preflight } signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
        { /* フォーム3 */ }
        { Number(step) === 3 &&
        <UserFormWrap key={ "step3" }>
          <UserFormStep3 preflight={ preflight } signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
        { /* フォーム4 */ }
        { Number(step) === 4 &&
        <UserFormWrap key={ "step4" }>
          <UserFormStep4 preflight={ preflight } signupUserFormData={ signupUserFormData }/>
        </UserFormWrap>
        }
      </AnimatePresence>
    </article>
  );
}