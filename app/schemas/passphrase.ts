import { z } from "zod";

// パスワード
const passphrase = z
.string()
.min(8, { message: "パスワードは8文字以上で入力してください" })
.regex(
  /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
  "パスワードは半角英数字混合で入力してください"
);
export default passphrase;

// パスワード(確認用)
export const passphraseConfirm = z
.string()
.min(8, { message: "パスワード(確認用)は8文字以上で入力してください" })
.regex(
  /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
  "確認用パスワードは半角英数字混合で入力してください"
);