import { z } from "zod";

// 郵便番号
const postcode = z
.string()
.min(7, { message: "郵便番号は7文字以上で入力してください" });
export default postcode;