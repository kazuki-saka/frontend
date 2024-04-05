import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function DetailInput ({ ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  const error = useField("report.detail");
  return (
    <fieldset>
      <label>本文</label>
      <textarea 
        cols={32}
        rows={20}
        placeholder={ "記事内容をここに入力して下さい。\nYoutube動画をUPしたい場合はここに共有リンクを張り付けて下さい。" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};