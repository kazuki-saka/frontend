import { z } from "zod";

// 投稿（タイトル）
const reporttitle = z
.string()
.min(1, { message: "タイトルは1文字以上で入力してください" });
export default reporttitle;