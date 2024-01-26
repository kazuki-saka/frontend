import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import email from "~/schemas/email";
import passphrase, { passphraseConfirm } from "~/schemas/passphrase";
import section from "~/schemas/section";
import viewname from "~/schemas/viewname";
import name from "~/schemas/name";
import phonenumber from "~/schemas/phonenumber";

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
 * 利用者登録フォーム(STEP1)のスキーマ
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

/**
 * 利用者登録フォーム(STEP2)のスキーマ
 */
export const userSchema_step2 = withZod(
  z.object({
    user: z
      .object({
        section: section
      })
  })
);

/**
 * 利用者登録フォーム(STEP3)のスキーマ
 */
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

/**
 * 利用者登録フォーム(STEP4)のスキーマ
 */
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