import { z } from "zod";

// お名前
const name = z
.string()
.min(1, { message: "お名前は1文字以上で入力してください" });
export default name;