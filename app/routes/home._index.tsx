import type { LoaderFunctionArgs, MetaFunction  } from "@remix-run/cloudflare";
import { json, Link } from "@remix-run/react";
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
  like: {cnt: number, id:Array<string>};
  comment: {cnt: number, id:Array<string>};
};

type LoaderPrApiResponse = {
  status: number;
  messages: { message: string };
  prurl: string;
}

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======home._index  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  
  // 認証処理から認証署名を取得
  const signature = await authenticate({ session: session });
  
  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(signature));
  console.log("user[signature]=", formData.get("user[signature]"));
  
  // APIへデータを送信
  const apiResponse = await fetch(`${ context.env.API_URL }/signin/guard.user`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonData = await apiResponse.json<LoaderApiResponse>();
  console.log("jsonData=", jsonData);
  console.log("jsonData.Like=", jsonData.like);
  console.log("jsonData.comment=", jsonData.comment);

  // ステータス200以外の場合はエラー
  if (jsonData.status !== 200) {
    throw new Response(null, {
      status: jsonData.status,
      statusText: jsonData.messages.message,
    });
  }

  //いいねとコメントした記事IDのリストをセッションに保存
  if (jsonData.like.cnt !== 0){
    session.set("home-user-like", jsonData.like.id);
  }

  if (jsonData.comment.cnt !== 0){
    session.set("home-user-comment", jsonData.comment.id);
  }
  

  //PR動画・トピックス取得
  // APIへデータを送信
  const apiPrResponse = await fetch(`${ context.env.API_URL }/top/view`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonPrData = await apiPrResponse.json<LoaderPrApiResponse>();
  console.log("jsonPrData=", jsonPrData);
  
  // ステータス200以外の場合はエラー
  if (jsonPrData.status !== 200) {
    throw new Response(null, {
      status: jsonPrData.status,
      statusText: jsonPrData.messages.message,
    });
  }

  return json({
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {
  return (
    <div className={ "container" }>
      <div className={ "wrap" }>
        <h1 className={ "text-30ptr font-semibold" }>認証後トップページ</h1>
        <Link to={ "/home/pickup?ref=1" } className={ "button button--primary rounded-full" }>福井サーモン</Link>
        <Link to={ "/home/pickup?ref=2" } className={ "button button--secondary rounded-full" }>若狭フグ</Link>
        <Link to={ "/home/pickup?ref=3" } className={ "button button--secondary rounded-full" }>敦賀真鯛</Link>
        <Link to={ "/home/pickup?ref=4" } className={ "button button--secondary rounded-full" }>若狭まはた</Link>
        <p>PR動画を入れる予定</p>
        <Link to={ "/home/inquiry" } className={ "button button--secondary rounded-full" }>問い合わせ</Link>
        <p><Link to={ "/signout" }>サインアウト</Link></p>
      </div>
    </div>
  );
}
