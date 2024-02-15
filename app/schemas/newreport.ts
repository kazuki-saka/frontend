import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import reporttitle from "./reporttitle";
import reportdetail from "./reportdetail";



/**
 * 投稿時のスキーマ
 */
 export const ReportSchema_step1 = withZod(
    z.object({
      title: reporttitle,
      detail: reportdetail
    })
  );
  
/**
 * 投稿確認時のスキーマ
 */
export const ReportSchema_step2 = withZod(
  z.object({
    user: z
      .object({
        title: reporttitle,
        detail: reportdetail
      }),
  })
);
