import { z } from "zod";

// 利用者区分
const section = z
.string()
.min(1, { message: "利用者区分を選択してください" });
export default section;