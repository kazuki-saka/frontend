import { z } from "zod";

// ニックネーム
const viewname = z
.string()
.min(1, { message: "ニックネームは1文字以上で入力してください" });
export default viewname;