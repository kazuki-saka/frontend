import { Session, SessionData } from "@remix-run/cloudflare";
import { getSession } from "~/services/session.server";

interface AuthenticateProps {
  session: Session<SessionData, SessionData>;
}
const authenticate = async ({ ...props }: AuthenticateProps) => {
  // Props
  const { session } = props;
  // セッションから認証署名を取得
  const signature = session.get("signin-auth-user-signature");
  // 認証署名がなければエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "認証に失敗しました。再度サインインしてください。",
    });
  }
  return signature;
}
export default authenticate;