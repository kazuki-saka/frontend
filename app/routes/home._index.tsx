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
};

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

  // ステータス200以外の場合はエラー
  if (jsonData.status !== 200) {
    throw new Response(null, {
      status: jsonData.status,
      statusText: jsonData.messages.message,
    });
  }

  //PR動画取得



  //トピックス取得
  
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
        <p><Link to={ "/signout" }>サインアウト</Link></p>
      </div>
    </div>
  );
}
