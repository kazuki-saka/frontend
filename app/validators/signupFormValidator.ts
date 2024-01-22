import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

/**
 * 仮登録フォームのバリデーション
 */
export const preflightFormValidator = withZod(
  z.object({
    preflight: z
      .object({
        email: z
          .string()
          .email({ message: "正しいメールアドレスを入力してください" }),
      })
  })
);


export const userFormValidator_step1 = withZod(
    z.object({
      user: z
        .object({
          password: z
            .string()
            .min(8, { message: "パスワードは8文字以上で入力してください" })
            .regex(
              /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
              "パスワードは半角英数字混合で入力してください"
            ),
          passwordConfirm: z
            .string()
            .min(8, { message: "パスワード(確認用)は8文字以上で入力してください" })
            .regex(
              /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
              "確認用パスワードは半角英数字混合で入力してください"
            ),
        })
        .refine((data) => data.password === data.passwordConfirm, {
          message: "パスワードが一致しません",
          path: ["passwordConfirm"],
        }),
    })
);
export const userFormValidator_step2 = withZod(
  z.object({
    user: z
      .object({
        section: z
          .string()
          .min(1, { message: "利用者区分を選択してください" }),
      })
  })
);
export const userFormValidator_step3 = withZod(
  z.object({
    user: z
      .object({
        name: z
          .string()
          .min(1, { message: "お名前は1文字以上で入力してください" }),
      })
  })
);

export const userFormValidator_step4 = withZod(z.object({}));

