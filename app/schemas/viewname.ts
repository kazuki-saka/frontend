import { z } from "zod";

// 店舗名・屋号
const viewname = z
.string()
.min(1, { message: "店舗名・屋号は1文字以上で入力してください" });
export default viewname;