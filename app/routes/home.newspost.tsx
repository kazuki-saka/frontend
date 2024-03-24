import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import { AnimatePresence } from "framer-motion";
import { Wrap as ReportFormWrap, ImgStep1 as ReportImgFormStep1, ReportStep1 as ReportFormStep1, Step2 as ReportFormStep2 } from "~/components/report/NewReportForm";
import { Report as ReportUserFormData } from "~/types/Report";
import { ReportSchema_step1, ReportSchema_step2} from "~/schemas/newreport";
import FishKindAry from "~/components/FishKind";

export const meta: MetaFunction = () => {
  return [
    { title: "投稿ページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type ActionApiResponse = {
  status: number;
  messages: { message: string };
};

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======newspost  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証署名取得
  const signature = session.get("signin-auth-user-signature");
  console.log("signature=", signature);
  
  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }

  // 認証情報取得
  const { user, likes, comments } = await guard({ request: request, context: context });  
  
  // URLパラメータからstepを取得
  const step = new URL(request.url).searchParams.get("step") || 1;
  // セッションから魚種を取得
  const kind = session.get("home-report-kind");
  const imgpath = session.get("report-rejist-form-imgpath");
  console.log("step=", step);
  console.log("kind=", kind);
  console.log("imgpath=", imgpath);

  // セッションからフォームデータ取得
  const ReportUserData = JSON.parse(session.get("report-rejist-form-data") || "{}") as ReportUserFormData;
  ReportUserData.kind = FishKindAry[kind - 1].name;
  //ReportUserData.imgpath = imgpath;
  console.log("ReportUserData=", ReportUserData);
  console.log("ReportUserData.imgpath=", ReportUserData.imgpath);

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

  console.log("======newspost  Action======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
/*
  const signature = await guard({ request: request, context: context });
  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }
*/

  // リクエストからフォームデータ取得
  const formData = await request.formData();
  const ref = formData.get("report[ref]");

  // セッションからフォームデータ取得
  const reportUserData = JSON.parse(session.get("report-rejist-form-data") || "{}") as ReportUserFormData;
  console.log("reportUserData=", reportUserData);
  console.log("step=", formData.get("step"));
  console.log("ref=", ref);

  if (ref === "image"){
    // セッションに保存
    /*
    const imgpath = String(formData.get("report[imgpath]"));
    console.log("imgpath=", imgpath);
    session.set("report-rejist-form-imgpath", imgpath);
    return json({
        headers: {
          "Set-Cookie": await commitSession(session),
        },
    });
    */

    const imgpath = String(formData.get("report[imgpath]"));
    console.log("imgpath=", imgpath);
    reportUserData.imgpath = imgpath;
    session.set("report-rejist-form-data", JSON.stringify(reportUserData));

    return redirect(`/home/newspost?step=1`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
      
  }

  if (Number(formData.get("step")) === 1) {
    const Schema_step1 = await ReportSchema_step1.validate(formData);
    // バリデーションエラー
    if (Schema_step1.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }

    console.log("title=", formData.get("report[title]"));
    console.log("detail=", formData.get("report[detail]"));
    console.log("imgpath=", formData.get("report[imgpath]"));

    // セッションに保存
    reportUserData.title = String(formData.get("report[title]"));
    reportUserData.detail = String(formData.get("report[detail]"));
    reportUserData.imgpath = String(formData.get("report[imgpath]"));
    session.set("report-rejist-form-data", JSON.stringify(reportUserData));

    // STEP2へリダイレクト
    return redirect(`/home/newspost?step=2`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  if (Number(formData.get("step")) === 2) {

    // フォームデータ生成
    const PostFormData = new FormData();
    PostFormData.append("user[signature]", String(session.get("signin-auth-user-signature")));
    PostFormData.append("report[title]", String(reportUserData.title));
    PostFormData.append("report[kind]", String(session.get("home-report-kind")));
    PostFormData.append("report[detail]", String(reportUserData.detail));
    PostFormData.append("report[imgpath]", String(reportUserData.imgpath));

    // バリデーション
    const ReportValidate_step2 = await ReportSchema_step2.validate(PostFormData);
    // バリデーションエラー
    if (ReportValidate_step2.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }

    console.log("user[signature]=", PostFormData.get("user[signature]"));
    console.log("report[title]=", PostFormData.get("report[title]"));
    console.log("report[kind]=", PostFormData.get("report[kind]"));
    console.log("report[detail]=", PostFormData.get("report[detail]"));
    console.log("report[imgpath]=", PostFormData.get("report[imgpath]"));

    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/report/add`, { method: "POST", body: PostFormData });

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

    //セッション内の投稿内容をクリアする
    reportUserData.title = "";
    reportUserData.detail = "";
    reportUserData.imgpath = "";
    session.set("report-rejist-form-data", JSON.stringify(reportUserData));
  }

  // 投稿完了画面へリダイレクト
  return redirect("/home/newscomplete", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {

    console.log("======pickup._index  Page======");

    // LOADER
    const loaderData = useLoaderData<typeof loader>();
    // Step取得
    const step = loaderData.step;
    const ReportUserData = loaderData.reportdata;
 
    return (
      <article>
        <div className={ "modal-head" }>
          <p>新規記事登録</p>
        </div>
      
        <AnimatePresence initial={ false }>
          { /* フォーム1 */ }
          { Number(step) === 1 &&
            
            <ReportFormWrap key={ "step1" }>
              <ReportImgFormStep1 ReportFormData={ ReportUserData }/>
              <ReportFormStep1 ReportFormData={ ReportUserData }/>
            </ReportFormWrap>
          }
          { /* フォーム2 */ }
          { Number(step) === 2 &&
            <ReportFormWrap key={ "step2" }>
              <ReportFormStep2 ReportFormData={ ReportUserData }/>
            </ReportFormWrap>
          }
        </AnimatePresence>
      </article>
    );
}