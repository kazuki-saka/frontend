import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import authenticate from "~/services/authenticate.user.server";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
    status: number;
    messages: { message: string };
    report: {id:string, title:string, detail_m:string, nickname:string, updatedDate:Date };
    topics: {num:number, detail:string, updatedDate:string};
  }
  
/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
    console.log("======pickup._index  LOADER======");

    // セッション取得
    const session = await getSession(request.headers.get("Cookie"));
    console.log("session=", session);

    // 認証処理から認証署名を取得
    const signature = await authenticate({ session: session });

    // URLパラメータからrefを取得
    const ref = new URL(request.url).searchParams.get("ref");
    console.log("ref=", ref);

    // FormData作成
    const formData = new FormData();
    formData.append("user[signature]", String(signature));
    formData.append("user[kind]", String(ref));
    console.log("user[signature]=", formData.get("user[signature]"));
    console.log("user[kind]=", formData.get("user[kind]"));

    //魚種にあったトピックスと記事一覧API呼び出し
    const apiResponse = await fetch(`${ context.env.API_URL }/report/view`, { method: "POST", body: formData });
    // JSONデータを取得
    const jsonData = await apiResponse.json<LoaderApiResponse>();
    console.log("jsonData=", jsonData);
    console.log("jsonData.report=", jsonData.report);
    console.log("jsonData.topics=", jsonData.topics);
    // ステータス200以外の場合はエラー
    if (jsonData.status !== 200) {
      throw new Response(null, {
        status: jsonData.status,
        statusText: jsonData.messages.message,
      });
    }
  

    return json({jsonData});
  
}
  
  /**
 * Action
 */
export async function action({ request, context }: ActionFunctionArgs) {
    console.log("======pickup._index  ACTION======");


}

export default function Page() {

  console.log("======pickup._index  Page======");

  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  const topics = loaderData.jsonData.topics;
  const report = loaderData.jsonData.report;
 
  console.log("pickup-page.loader=", loaderData);
  console.log("topics=", topics);

  return (
    <div className={ "container" }>
      <div className={ "wrap" }>
        <p>トピックス</p>
          <ul>
            {<li key={topics.num}>{topics.detail} </li> }
          </ul>
        <p>生産者記事一覧</p>
      </div>

      { /* 投稿フォームモーダル */ }
      { /* コメントフォームモーダル */ }
    </div>
  );

}