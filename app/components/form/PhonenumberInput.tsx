import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function PhonenumberInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("user.phonenumber");
  return (
    <fieldset>
      <label>ご連絡先(電話番号)</label>
      <input 
        type={ "number" } 
        placeholder={ "ハイフンなし半角数字" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};