import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function AdressInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("inquiry.address");
  return (
    <fieldset>
      <label>住所</label>
      <input 
        type={ "text" } 
        placeholder={ "商品を届ける住所を記入して下さい" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};