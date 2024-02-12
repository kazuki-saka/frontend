import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import authenticate from "~/services/authenticate.user.server";
import {reportrejist} from "~/schemas/reportrejist";
import { AnimatePresence } from "framer-motion";
import { Wrap as UserFormWrap, Step1 as UserFormStep1, Step2 as UserFormStep2 } from "~/components/report/NewReportForm";
import { Report as ReportUserFormData } from "~/types/Report";
import { ReportSchema_step1 as ReportSchema_step1} from "~/schemas/newreport";
import fishkind from "~/components/report/form/FishKind";

export const meta: MetaFunction = () => {
  return [
    { title: "投稿ページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};


/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

    console.log("======newspost._index  LOADER======");

    // セッション取得
    const session = await getSession(request.headers.get("Cookie"));
    console.log("session=", session);
    // 認証処理から認証署名を取得
    const signature = await authenticate({ session: session });
    console.log("signature=", signature);
    
    // 認証署名がない場合はエラー
    if (!signature) {
      throw new Response(null, {
        status: 401,
        statusText: "署名の検証に失敗しました。",
      });
    }

    // URLパラメータからstepと魚種を取得
    const step = new URL(request.url).searchParams.get("step") || 1;
    const kind = session.get("home-user-kind");
    console.log("step=", step);
    console.log("kind=", kind);

    // セッションからフォームデータ取得
    const ReportUserData = JSON.parse(session.get("signup-user-form-data") || "{}") as ReportUserFormData;
    ReportUserData.kind = fishkind[kind].name;
    
    // FormData作成
    const formData = new FormData();
    formData.append("user[signature]", String(signature));

    return json({
      step: step ? step : 1,
      reportdata: ReportUserData
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

    console.log("======newspost._index  Action======");

    // セッション取得
    const session = await getSession(request.headers.get("Cookie"));
    console.log("session=", session);

    // 認証処理から認証署名を取得
    const signature = await authenticate({ session: session });

    // リクエストからフォームデータ取得
    const formData = await request.formData();

    // セッションからフォームデータ取得
    const reportUserData = JSON.parse(session.get("signup-user-form-data") || "{}") as ReportUserFormData;
    console.log("signupUserFormData=", reportUserData);
    console.log("step=", formData.get("step"));

    if (Number(formData.get("step")) === 1) {
      const Schema_step1 = await ReportSchema_step1.validate(formData);
      // バリデーションエラー
      if (Schema_step1.error) {
        throw new Response(null, {
          status: 422,
          statusText: "データが不足しています。",
        });
      }

      // STEP2へリダイレクト
      return redirect(`/newspost?step=2`, {
        headers: {
          "Set-Cookie": await commitSession(session),
      },
    });

    }
    return signature;
}

export default function Page() {

    console.log("======pickup._index  Page======");

    // LOADER
    const loaderData = useLoaderData<typeof loader>();
    // Step取得
    const step = loaderData.step;
    const ReportUserData = loaderData.reportdata;
    console.log("step=", step);
 
    return (
      <article>
        <div className={ "modal-head" }>
          <p>新規記事登録</p>
        </div>
      
      <AnimatePresence initial={ false }>
        { /* フォーム1 */ }
        { Number(step) === 1 &&
        <UserFormWrap key={ "step1" }>
          <UserFormStep1 ReportFormData={ ReportUserData }/>
        </UserFormWrap>
        }
        { /* フォーム2 */ }
        { Number(step) === 2 &&
        <UserFormWrap key={ "step2" }>
          <UserFormStep2 ReportFormData={ ReportUserData }/>
        </UserFormWrap>
        }
      </AnimatePresence>
    </article>
    );
}