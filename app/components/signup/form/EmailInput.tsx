import { SerializeFrom } from "@remix-run/cloudflare";
import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";
import { action } from "~/routes/signup._index";

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
  actionData: SerializeFrom<typeof action>;
}
export default function EmailInput ({ ...props }: EmailInputProps) {
  const error = useField("preflight.email");
  return (
    <fieldset>
      <label>メールアドレス</label>
      <input 
        type={ "email" } 
        placeholder={ "mail@example.com" }
        className={ (error.error || (props.actionData && props.actionData.error)) && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
      { props.actionData && props.actionData.error &&
      <p className={ "text-error font-semibold" }>{ props.actionData.error }</p>
      }
    </fieldset>
  );
};