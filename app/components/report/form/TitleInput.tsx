import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function TitleInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("report.title");
  return (
    <fieldset>
      <label>タイトル</label>
      <input 
        type={ "text" } 
        placeholder={ "記事のタイトルを入力して下さい" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};