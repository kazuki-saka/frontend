import { SerializeFrom } from "@remix-run/cloudflare";
import { useEffect, useRef, InputHTMLAttributes } from "react";
import AuthCodeInput, { AuthCodeRef } from "react-auth-code-input";
import { action } from "~/routes/signup.preflight";

interface AuthcodeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  actionData: SerializeFrom<typeof action>;
  setAuthcode: React.Dispatch<React.SetStateAction<string | undefined>>;
  error: string;
}
export default function AuthcodeInput ({ ...props }: AuthcodeInputProps) {
  // Props
  const { actionData, setAuthcode, error } = props;
  // Refs
  const AuthInputRef = useRef<AuthCodeRef>(null);
  // Effects
  useEffect(() => {
    if (AuthInputRef.current && actionData) {
      AuthInputRef.current.clear();
    }
  }, [actionData]);
  
  return (
    <fieldset>
      <div className={ "authcode-wrap py-20" }>
        <AuthCodeInput 
          length={ 4 }
          allowedCharacters={ "numeric" }
          containerClassName={ "authcode-container" }
          inputClassName={ `authcode-input ${ error ? "border-error text-error" : "" }` }
          placeholder={ "0" }
          onChange={ (d) => setAuthcode(d) }
          ref={ AuthInputRef }
          //className={ error.error && "border-error bg-error-100 text-error" }
        />
        { error &&
        <p className={ "text-error text-center font-semibold mt-4" }>認証コードが一致しません。</p>
        }
      </div>
    </fieldset>
  );
};