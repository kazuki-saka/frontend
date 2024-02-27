import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function CommentInput ({ ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  const error = useField("comment");
  return (
    <fieldset>
      <label>コメント</label>
      <textarea 
        cols={100}
        rows={20}
        placeholder={ "記事に対してのコメントをここに入力して下さい。" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};