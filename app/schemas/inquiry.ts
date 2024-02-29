import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import reportdetail from "./reportdetail";
import shopname from "./shopname";
import name from "./name";
import postcode from "./postcode";
import address from "./address";


/**
 * 問い合わせ時のスキーマ
 */
 export const InquirySchema_step1 = withZod(
    z.object({
      inquiy: z
        .object({
          shopname: shopname,
          rejistname: name,
          postcode: postcode,
          address: address,
          detail: reportdetail
        }),
    })
  );
  
/**
 * 問い合わせ確認時のスキーマ
 */
export const InquirySchema_step2 = withZod(
  z.object({
    report: z
      .object({
        shopname: shopname,
        rejistname: name,
        postcode: postcode,
        address: address,
        detail: reportdetail
    }),
  })
);
