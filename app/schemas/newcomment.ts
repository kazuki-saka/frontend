import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import comment from "./comment";

/**
 * コメント
 */
 export const CommentSchema = withZod(
    z.object({
      report: z
        .object({
          comment: comment
        }),
    })
  );
  
