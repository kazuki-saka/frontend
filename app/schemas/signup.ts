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

// パスワード(確認用)
const passphraseConfirm = z
.string()
.min(8, { message: "パスワード(確認用)は8文字以上で入力してください" })
.regex(
  /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
  "確認用パスワードは半角英数字混合で入力してください"
);

// 利用者区分
const section = z
.string()
.min(1, { message: "利用者区分を選択してください" });

// 店舗名・屋号
const viewname = z
.string()
.min(1, { message: "店舗名・屋号は1文字以上で入力してください" });

// お名前
const name = z
.string()
.min(1, { message: "お名前は1文字以上で入力してください" });

// 電話番号
const phonenumber = z
.string()
.min(10, { message: "10文字以上12文字以下の半角数字(ハイフンなし)を入力してください" })
.max(12, { message: "10文字以上12文字以下の半角数字(ハイフンなし)を入力してください" });

/**
 * 仮登録フォームのスキーマ
 */
export const preflightSchema = withZod(
  z.object({
    preflight: z
      .object({
        email: email,
      })
  })
);

/**
 * 利用者登録フォームのスキーマ
 */
export const userSchema_step1 = withZod(
  z.object({
    user: z
      .object({
        passphrase: passphrase,
        passphraseConfirm: passphraseConfirm,
      })
      .refine((data) => data.passphrase === data.passphraseConfirm, {
        message: "パスワードが一致しません",
        path: ["passwordConfirm"],
      }),
  })
);
export const userSchema_step2 = withZod(
  z.object({
    user: z
      .object({
        section: section
      })
  })
);
export const userSchema_step3 = withZod(
  z.object({
    user: z
      .object({
        viewname: viewname,
        personal: z
          .object({
            name: name,
            phonenumber: phonenumber
          }),
      }),
  })
);
export const userSchema_step4 = withZod(
  z.object({
    user: z
      .object({
        username: email,
        passphrase: passphrase,
        section: section,
        viewname: viewname,
        personal: z
          .object({
            name: name,
            phonenumber: phonenumber,
          }),
      }),
  })
);

