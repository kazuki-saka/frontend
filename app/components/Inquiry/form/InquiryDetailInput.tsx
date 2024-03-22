import { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

export default function InquiryDetailInput ({ ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  const error = useField("inquiry.detail");
  return (
    <fieldset>
      <label>問い合わせ内容</label>
      <textarea 
        cols={32}
        rows={10}
        placeholder={ "問い合わせ内容をここに入力して下さい。" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...props }
      />
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};