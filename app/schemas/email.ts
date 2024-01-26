import { z } from "zod";

// メールアドレス/ユーザー名
const email = z
.string().email({ message: "正しいメールアドレスを入力してください" });
export default email;