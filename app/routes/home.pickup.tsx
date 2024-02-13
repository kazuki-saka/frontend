import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
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

  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }
  
  // URLパラメータからrefを取得
  const ref = new URL(request.url).searchParams.get("ref");
  console.log("ref=", ref);

  const like = session.get("home-user-like");
  const comment = session.get("home-user-comment");

  console.log("like=", like);
  console.log("comment=", comment);

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

  //セッションに魚種を保存
  session.set("home-user-kind", ref);

  return json(
    {
      report:  jsonData.report,
      topics:  jsonData.topics
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    });  
}

export default function Page() {

  console.log("======pickup  Page======");

  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  const topics = loaderData.topics;
  const report = loaderData.report;
  
  return (
    <div>
      { /* フォーム */ }
      <Form>
        <div className={ "container" }>
          <div className={ "wrap" }>
            <p>トピックス</p>
              <ul>
                {<li key={topics.num}>
                  <Link to={"pickup/${topics.num}"}>{topics.detail}</Link>
                </li> }
              </ul>
            <p>生産者</p>
            <ul>
                {<li key={report.id}>{report.title} </li> }
              </ul>
            <p>福井中央卸売市場</p>
            <p><Link to={ "/home/newspost" }>投稿</Link></p>
            <p><Link to={ "/signout" }>サインアウト</Link></p>
          </div>

        </div>
      </Form>
      { /* コメントフォームモーダル */ }
    </div>
  );

}