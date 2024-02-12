import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import title from "~/schemas/reporttitle";
import detail from "~/schemas/reportdetail";

/**
 * 登校時のスキーマ
 */
export const reportrejist = withZod(
    z.object({
      user: z
        .object({
          reporttitle: title,
          reportdetail: detail
        }),
    })
  );
  