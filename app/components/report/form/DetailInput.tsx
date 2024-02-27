import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function DetailInput ({ ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  const error = useField("report.title");
  return (
    <fieldset>
      <label>本文</label>
      <textarea 
        cols={100}
        rows={20}
        placeholder={ "記事内容をここに入力して下さい。" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};