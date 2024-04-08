import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import shopname from "~/schemas/shopname";
import { AnimatePresence } from "framer-motion";
import authenticate from "~/services/authenticate.user.server";
import { getSession, commitSession } from "~/services/session.server";
import { Inquiry as InquiryFormData } from "~/types/Inquiry";
import { Wrap as UserFormWrap, Step1 as InquiryFormStep1, Step2 as InquiryFormStep2  } from "~/components/Inquiry/InquiryForm";
import { InquirySchema_step1, InquirySchema_step2} from "~/schemas/inquiry";

/*-----------------------------------------------
  問い合わせ画面  
  STEP1～2で問い合わせを行う
------------------------------------------------*/

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

type ActionApiResponse = {
  status: number;
  messages: { message: string };
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
  const kind = session.get("home-fishkind");
  console.log("step=", step);
  console.log("kind=", kind);

  // セッションからフォームデータ取得
  const InquiryData = JSON.parse(session.get("inquiry-form-data") || "{}") as InquiryFormData;

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
    InquiryData.shopname = jsonData.user.shopname;
    InquiryData.rejistname = jsonData.user.rejistname;
    InquiryData.kind = kind;    
  }

  return json({
    step: step ? step : 1,
    inquirydata: InquiryData
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

  console.log("======inquiry  Action======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
  const signature = await authenticate({ session: session });

  // リクエストからフォームデータ取得
  const formData = await request.formData();

  // セッションからフォームデータ取得
  const InquiryData = JSON.parse(session.get("inquiry-form-data") || "{}") as InquiryFormData;
  console.log("InquiryData=", InquiryData);
  console.log("step=", formData.get("step"));

  if (Number(formData.get("step")) === 1) {
    const Schema_step1 = await InquirySchema_step1.validate(formData);
    // バリデーションエラー
    if (Schema_step1.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }

    // セッションに保存
    InquiryData.shopname = String(formData.get("inquiry[shopname]"));
    InquiryData.rejistname = String(formData.get("inquiry[rejistname]"));
    InquiryData.postcode = String(formData.get("inquiry[postcode]"));
    InquiryData.address = String(formData.get("inquiry[address]"));
    InquiryData.kind = String(session.get("home-fishkind"));
    InquiryData.detail = String(formData.get("inquiry[detail]"));

    session.set("inquiry-form-data", JSON.stringify(InquiryData));

    // STEP2へリダイレクト
    return redirect(`/home/inquiry?step=2`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  if (Number(formData.get("step")) === 2) {

    // フォームデータ生成
    const PostFormData = new FormData();
    PostFormData.append("inquiry[signature]", String(signature));
    PostFormData.append("inquiry[shopname]", String(InquiryData.shopname));
    PostFormData.append("inquiry[rejistname]", String(InquiryData.rejistname));
    PostFormData.append("inquiry[postcode]", String(InquiryData.postcode));
    PostFormData.append("inquiry[address]", String(InquiryData.address));
    PostFormData.append("inquiry[kind]", String(InquiryData.kind));
    PostFormData.append("inquiry[detail]", String(InquiryData.detail));

    // バリデーション
    const ReportValidate_step2 = await InquirySchema_step2.validate(PostFormData);
    // バリデーションエラー
    if (ReportValidate_step2.error) {
      throw new Response(null, {
        status: 422,
        statusText: "データが不足しています。",
      });
    }

    console.log("inquiry[kind]=", PostFormData.get("inquiry[kind]"));
    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/inquiry/send`, { method: "POST", body: PostFormData });

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

    //セッション内の問い合わせ内容をクリアする
    InquiryData.shopname = "";
    InquiryData.rejistname = "";
    InquiryData.postcode = "";
    InquiryData.address = "";
    InquiryData.detail = "";
    InquiryData.kind = "";
    session.set("inquiry-form-data", JSON.stringify(InquiryData));
  }

  // 問い合わせ完了画面へリダイレクト
  return redirect("/home/inquirycomplete", {
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
        { /* フォーム2 */ }
        { Number(step) === 2 &&
        <UserFormWrap key={ "step2" }>
          <InquiryFormStep2 InquiryData={ inquirydata }/>
        </UserFormWrap>
        }
      </AnimatePresence>
    </article>
  );
}