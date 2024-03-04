import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function NameInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("inquiry.rejistname");
  return (
    <fieldset>
      <label>お名前</label>
      <input 
        type={ "text" } 
        placeholder={ "福井 太郎" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};