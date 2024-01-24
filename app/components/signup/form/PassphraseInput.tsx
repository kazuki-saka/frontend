import { useState, InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface PassphraseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isConfirm?: boolean;
}
export default function PassphraseInput ({ ...props }: PassphraseInputProps) {
  // Props
  const { isConfirm, ...others } = props;
  // States
  const [isReveal, setIsReveal] = useState<boolean>(false);
  // Error
  const error = useField(isConfirm ? "user.passphraseConfirm" : "user.passphrase");
  return (
    <fieldset className={ "relative" }>
      <label>パスワード{ isConfirm ? "(確認用)" : "" }</label>
      <input 
        type={ isReveal ? "text" : "password" } 
        placeholder={ "8文字以上の英数字" }
        className={ error.error && "border-error bg-error-100 text-error" }
        { ...others }
      />
      <span 
        className={ "absolute right-4 top-12 cursor-pointer text-40ptr text-gray-400 font-semibold" }
        onClick={ () => setIsReveal(!isReveal) }
      >
        { !isReveal ?
        <IconEyeOff /> 
        :
        <IconEye />
        }
      </span>
      { error.error &&
      <p className={ "text-error font-semibold" }>{ error.error }</p>
      }
    </fieldset>
  );
};