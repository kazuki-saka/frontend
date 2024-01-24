import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function UsernameInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("user.username");
  return (
    <fieldset>
      <label>メールアドレス</label>
      <input 
        type={ "email" } 
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