import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

// メールアドレス/ユーザー名
const email = z
.string().email({ message: "正しいメールアドレスを入力してください" });

// パスワード
const passphrase = z
.string()
.min(8, { message: "パスワードは8文字以上で入力してください" })
.regex(
  /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
  "パスワードは半角英数字混合で入力してください"
);

/**
 * サインインフォームのスキーマ
 */
export const signinSchema = withZod(
  z.object({
    user: z
      .object({
        username: email,
        passphrase: passphrase,
      })
  })
);
