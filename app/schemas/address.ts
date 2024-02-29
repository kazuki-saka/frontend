import { z } from "zod";

// 住所
const address = z
.string()
.min(1, { message: "住所が未入力です" });
export default address;