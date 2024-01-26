import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import email from "~/schemas/email";
import passphrase from "~/schemas/passphrase";

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
