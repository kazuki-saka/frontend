import { z } from "zod";

// 電話番号
const phonenumber = z
.string()
.min(10, { message: "10文字以上12文字以下の半角数字(ハイフンなし)を入力してください" })
.max(12, { message: "10文字以上12文字以下の半角数字(ハイフンなし)を入力してください" });
export default phonenumber;