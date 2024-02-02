import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
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
    topics: {cnt: number, id:string, data:string};
    report: {cnt: number, id:string, nickname:string, updatetime:Date, title:string, detail:string};
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
    console.log("user[signature]=", formData.get("user[signature]"));


    //魚種にあったトピックスと記事一覧API呼び出し


    return signature;
}
  
  /**
 * Action
 */
export async function action({ request, context }: ActionFunctionArgs) {
    console.log("======pickup._index  ACTION======");


}

export default function Page() {


    { /* 投稿フォームモーダル */ }
    { /* コメントフォームモーダル */ }

}