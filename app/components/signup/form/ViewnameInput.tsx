import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function ViewnameInput ({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const error = useField("user.viewname");
  return (
    <fieldset>
      <label>店舗名・屋号</label>
      <input 
        type={ "text" } 
        placeholder={ "福井商店" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};