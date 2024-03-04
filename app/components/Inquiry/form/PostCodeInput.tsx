import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function PostCodeInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("inquiry.postcode");
  return (
    <fieldset>
      <label>郵便番号（ハイフン無し）</label>
      <input 
        type={ "text" } 
        placeholder={ "1234567" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};