import { SerializeFrom } from "@remix-run/cloudflare";
import { ValidatedForm } from "remix-validated-form";
import { userFormValidator_step1 } from "~/validators/signupFormValidator";
import { Preflight } from "~/types/Preflight";
import PasswordInput from "~/components/form/PasswordInput";

interface UserFormStep1Props {
  preflight: SerializeFrom<Preflight>;
}
export default function UserFormStep1({ ...props }: UserFormStep1Props) {
  return (
    <ValidatedForm
      validator={ userFormValidator_step1 } 
      method={ "POST" }
      action={ `?token=${ props.preflight.token }&step=1` }
    >
      <label>(1/4)</label>
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP1: パスワードを設定してください</h2>
      <fieldset>
        <label>メールアドレス(ユーザー名)</label>
        <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ props.preflight.email }</p>
      </fieldset>
      <PasswordInput name={ "user[password]" }/>
      <PasswordInput name={ "user[passwordConfirm]" } isConfirm/>
      <input type={ "hidden" } name={ "step" } value={ 1 }/>
      <input type={ "hidden" } name={ "token" } value={ props.preflight.token }/>
      <div className={ "" }>
        <button 
          type={ "submit" }
          className={ "button button--primary" }
          //disabled={ navigation.state === "submitting" }
        >
          次へ
        </button>
      </div>
    </ValidatedForm>
  );
}