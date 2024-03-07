import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import authenticate from "~/services/authenticate.user.server";
import { reportcostom as ReportCostom } from "~/types/Report";
import { topic as topic } from "~/types/topic";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
    status: number;
    messages: { message: string };
    MarketReports: ReportCostom[];
    FishmanReports: ReportCostom[];
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

  const likeAry:string[] = session.get("home-user-like");
  const commentAry:string[] = session.get("home-user-comment");

  console.log("like=", likeAry);
  console.log("comment=", commentAry);

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
  console.log("jsonData.MarketReports[0]=", jsonData.MarketReports[0]);
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

  //自分がほしいねした記事にフラグを立てる
  if (likeAry != null){
    likeAry.forEach(tmpid => {
      let lIndex : number;
  
      lIndex = jsonData.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonData.MarketReports[lIndex].like_flg = true;
      }
  
      lIndex = jsonData.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonData.FishmanReports[lIndex].like_flg = true;
      }
    });      
  }

  //自分がコメントした記事にフラグを立てる
  if (commentAry != null){
    commentAry.forEach(tmpid => {
      let lIndex : number;
      
      console.log("comment.id=", tmpid);
      lIndex = jsonData.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("market comment on");
        jsonData.MarketReports[lIndex].comment_flg = true;
      }
  
      lIndex = jsonData.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("fishman comment on");
        jsonData.FishmanReports[lIndex].comment_flg = true;
      }
    });  
  }

  console.log("market");
  jsonData.MarketReports.forEach(tmp => {
    console.log("id=", tmp.id);
    console.log("comment_flg=", tmp.comment_flg);
  });
  console.log("jsonData.MarketReports[0]=", jsonData.MarketReports[0]);

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
                    <Link to={`/home/reportview/?ref=view&kind=1&id=${topi.num}`}>{topi.title}</Link>
                  </li>
                ))}
              </ul>
            <p>生産者</p>
              <ul>
                {fishman.map((repo) => (
                  <li key={repo.id}>
                    <Link to={`/home/reportview/?ref=view&kind=2&id=${repo.id}`}>{repo.title}</Link>
                    <p>更新日時：{repo.updatedDate}</p>
                    <p>●ニックネーム：{repo.nickname}</p>
                    <p>
                      {repo.like_flg  ? "★ほしいね：" : "☆ほしいね："}
                      {repo.like_cnt}
                    </p>
                    <p>
                      {repo.comment_flg ? "■コメント：": "□コメント："}
                      {repo.comment_cnt}
                    </p>  
                  </li>
                ))}
              </ul>
            <p>福井中央卸売市場</p>
              <ul>
                {market.map((repo) => (
                  <li key={repo.id}>
                    <Link to={`/home/reportview/?ref=view&kind=2&id=${repo.id}`}>{repo.title}</Link>
                    <p>更新日時：{repo.updatedDate}</p>
                    <p>●ニックネーム：{repo.nickname}</p>
                    <p>
                      {repo.like_flg  ? "★ほしいね：" : "☆ほしいね："}
                      {repo.like_cnt}
                    </p>
                    <p>
                      {repo.comment_flg ? "■コメント：": "□コメント："}
                      {repo.comment_cnt}
                    </p>  
                  </li>
                ))}
              </ul>
            <p><Link to={ "/home/newspost" }>投稿</Link></p>
            <p><Link to={ "/home" }>トップに戻る</Link></p>
            <p><Link to={ "/signout" }>サインアウト</Link></p>
          </div>
        </div>
      </Form>
    </div>
  );

}