import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import reporttitle from "./reporttitle";
import reportdetail from "./reportdetail";
import reportimg from "./postimgpath";



/**
 * 投稿時のスキーマ(画像投稿)
 */
export const ReportSchema_step1Img = withZod(
  z.object({
    report: z
      .object({
        imgpath: reportimg
      }),
  })
);

/**
 * 投稿時のスキーマ
 */
 export const ReportSchema_step1 = withZod(
  z.object({
    report: z
      .object({
        title: reporttitle,
        detail: reportdetail,
      }),
  })
);
  
/**
 * 投稿確認時のスキーマ
 */
export const ReportSchema_step2 = withZod(
  z.object({
    report: z
      .object({
        title: reporttitle,
        detail: reportdetail
      }),
  })
);
