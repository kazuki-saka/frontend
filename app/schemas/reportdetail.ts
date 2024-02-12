import { z } from "zod";

// 投稿（本文）
const reportdetail = z
.string()
.min(1, { message: "本文は1文字以上で入力してください" });
export default reportdetail;