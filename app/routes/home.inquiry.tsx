import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import shopname from "~/schemas/shopname";
import { AnimatePresence } from "framer-motion";
import authenticate from "~/services/authenticate.user.server";
import { getSession, commitSession } from "~/services/session.server";
import { Inquiry as InquiryFormData } from "~/types/Inquiry";
import { Wrap as UserFormWrap, Step1 as InquiryFormStep1 } from "~/components/report/InquiryForm";


export const meta: MetaFunction = () => {
  return [
    { title: "問い合わせページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  user: { shopname:string, rejistname: string};
};

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======inquiry  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  console.log("session=", session);
  
  // 認証処理から認証署名を取得
  const signature = await authenticate({ session: session });

  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }

  // URLパラメータからstepを取得
  const step = new URL(request.url).searchParams.get("step") || 1;
  // セッションから魚種を取得
  const kind = session.get("home-report-kind");
  console.log("step=", step);
  console.log("kind=", kind);

  if (Number(step) === 1) {
    // FormData作成
    const formData = new FormData();
    formData.append("user[signature]", String(signature));
    console.log("formData.user=", formData.get("user[signature]"));

    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/inquiry/view`, { method: "POST", body: formData });
    
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
    // セッションからフォームデータ取得
    const InquiryData = JSON.parse(session.get("inquiry-form-data") || "{}") as InquiryFormData;
    InquiryData.shopname = jsonData.user.shopname;
    InquiryData.rejistname = jsonData.user.rejistname;
    InquiryData.kind = kind;
    
    return json({
      step: step ? step : 1,
      inquirydata: InquiryData
    }, {
        headers: {
        "Set-Cookie": await commitSession(session),
        },
    });
  }


  // セッションからフォームデータ取得
  const InquiryData = JSON.parse(session.get("report-rejist-form-data") || "{}") as InquiryFormData;

  
  return json({
    step: step ? step : 1,
    inquirydata: InquiryData
  }, {
      headers: {
      "Set-Cookie": await commitSession(session),
      },
  });

}

export default function Page() {

  const loaderData = useLoaderData<typeof loader>();
  // Step取得
  const step = loaderData.step;
  // SignupUserFormData取得
  const inquirydata = loaderData.inquirydata;

  return(
    <article>
      <div className={ "modal-head" }>
        <p>問い合わせ</p>
      </div>

      <AnimatePresence initial={ false }>
        { /* フォーム1 */ }
        { Number(step) === 1 &&
        <UserFormWrap key={ "step1" }>
          <InquiryFormStep1 InquiryData={ inquirydata }/>
        </UserFormWrap>
        }
      </AnimatePresence>
    </article>
  );
}