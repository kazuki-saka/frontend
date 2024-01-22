import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function EmailInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("preflight.email");
  return (
    <fieldset>
      <label>メールアドレス</label>
      <input 
        type={ "text" } 
        placeholder={ "mail@example.com" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};