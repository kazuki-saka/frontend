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

type report = {id:string, title:string, detail_m:string, nickname:string, updatedDate:Date, like_cnt:number, comment_cnt:number };
type topic = {num:number, detail:string, updatedDate:string};

type LoaderApiResponse = {
    status: number;
    messages: { message: string };
    MarketReports: report[];
    FishmanReports: report[];
    topics: topic[];
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
  console.log("jsonData.MarketReports=", jsonData.MarketReports);
  console.log("jsonData.FishmanReports=", jsonData.FishmanReports);
  console.log("jsonData.topics=", jsonData.topics);
  // ステータス200以外の場合はエラー
  if (jsonData.status !== 200) {
    throw new Response(null, {
      status: jsonData.status,
      statusText: jsonData.messages.message,
    });
  }

  //セッションに魚種を保存
  session.set("home-report-kind", ref);

  return json(
    {
      market:  jsonData.MarketReports,
      fishman: jsonData.FishmanReports,
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
  const market = loaderData.market;
  const fishman = loaderData.fishman;

  return (
    <div>
      { /* フォーム */ }
      <Form>
        <div className={ "container" }>
          <div className={ "wrap" }>
            <p>トピックス</p>
              <ul>
                {topics.map((topi) => (
                  <li key={topi.num}>
                    <p>更新日時：{topi.updatedDate}</p>
                    <Link to={"pickup/${topi.num}"}>{topi.detail}</Link>
                  </li>
                ))}
              </ul>
            <p>生産者</p>
              <ul>
                {fishman.map((repo) => (
                  <li key={repo.id}>
                    <Link to={"pickup/${repo.id}"}>{repo.title}</Link>
                    <p>更新日時：{repo.updatedDate}</p>
                    <p>●ニックネーム：{repo.nickname}</p>
                    <p>★ほしいね：{repo.like_cnt}</p>  
                    <p>※コメント：{repo.comment_cnt}</p>  
                  </li>
                ))}
              </ul>
            <p>福井中央卸売市場</p>
              <ul>
                {market.map((repo) => (
                  <li key={repo.id}>
                    <Link to={"pickup/${repo.id}"}>{repo.title}</Link>
                    <p>更新日時：{repo.updatedDate}</p>
                    <p>●ニックネーム：{repo.nickname}</p>
                    <p>★ほしいね：{repo.like_cnt}</p>  
                    <p>※コメント：{repo.comment_cnt}</p>  
                  </li>
                ))}
              </ul>
            <p><Link to={ "/home/newspost" }>投稿</Link></p>
            <p><Link to={ "/signout" }>サインアウト</Link></p>
          </div>

        </div>
      </Form>
      { /* コメントフォームモーダル */ }
    </div>
  );

}