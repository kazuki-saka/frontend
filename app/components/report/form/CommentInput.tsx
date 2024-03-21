import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";
import { FaRegCommentAlt, FaCommentAlt, FaPaperPlane } from "react-icons/fa";

export default function CommentInput ({ ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  const error = useField("comment");
  return (
    <fieldset className={ "placeholder:text-[100%] md:px-[10%] px-0 py-0 pt-2" } >
      <label>コメント</label>
      <textarea 
        cols={32}
        rows={2}
        placeholder={ "この記事に対してコメントを残す" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
      <button type={ "submit" }>
        <FaPaperPlane  className={ " w-12 h-12" }/>
      </button>
    </fieldset>
  );
};