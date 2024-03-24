import { z } from "zod";

// 投稿（画像）
const reportimg = z
.string()
.min(1, { message: "画像が投稿されていません" });
export default reportimg;