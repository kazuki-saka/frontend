import { AppLoadContext } from "@remix-run/cloudflare";
import { getSession } from "~/services/session.server";
import { User, Account } from "~/types/User";
import { Like } from "~/types/Like";
import { Comment } from "~/types/Comment";

type ApiResponse = {
  status: number;
  messages: { message: string };
  user: Account;
  like: Like[];
  comment: Comment[];
};

export default async function ({ ...props }: {
  request: Request;
  context: AppLoadContext;
}) {
  // Props
  const { request, context } = props;
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // セッションから認証署名を取得
  const signature = session.get("signin-auth-user-signature");
  // 認証署名がなければエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "認証に失敗しました。再度サインインしてください。",
    });
  }
  
  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(signature));
  
  // APIへデータを送信
  const apiResponse = await fetch(`${ context.env.API_URL }/signin/guard.user`, { method: "POST", body: formData });
  // JSONデータに変換
  const jsonData = await apiResponse.json<ApiResponse>();
  // データ取得
  const { user, like, comment } = jsonData;
  console.log(signature);
  console.log(`${ context.env.API_URL }/signin/guard.user`);
  console.log({ user: user });
  console.log({ like: like });
  console.log({ comment: comment });
  
  return { user: user, likes: like, comments: comment };
}