import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function ViewnameInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("user.viewname");
  return (
    <fieldset>
      <label>ニックネーム（コメント時に表示される名前）</label>
      <input 
        type={ "text" } 
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};