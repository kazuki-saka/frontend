import { z } from "zod";

// コメント
const Comment = z
.string()
.min(1, { message: "コメントは1文字以上で入力してください" });
export default Comment;