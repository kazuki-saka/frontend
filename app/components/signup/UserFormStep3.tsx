import { SerializeFrom } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { userFormValidator_step3 } from "~/validators/signupFormValidator";
import { Preflight } from "~/types/Preflight";
import { SignupUserFormData } from "~/types/SignupUserFormData";
import NameInput from "~/components/form/NameInput";
import PhonenumberInput from "~/components/form/PhonenumberInput";

interface UserFormStep3Props {
  preflight: SerializeFrom<Preflight>;
  signupUserFormData: SignupUserFormData;
}
export default function UserFormStep3({ ...props }: UserFormStep3Props) {
  return (
    <ValidatedForm
      validator={ userFormValidator_step3 } 
      method={ "POST" }
      action={ `?token=${ props.preflight.token }&step=3` }
    >
      <label>(3/4)</label>
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP3: 登録情報を設定してください</h2>
      <NameInput name={ "user[name]" } defaultValue={ props.signupUserFormData.name }/>
      <PhonenumberInput name={ "user[phonenumber]" } defaultValue={ props.signupUserFormData.phonenumber }/>
      <input type={ "hidden" } name={ "step" } value={ 3 }/>
      <input type={ "hidden" } name={ "token" } value={ props.preflight.token }/>
      <div className={ "flex gap-2 md:gap-8" }>
        <Link to={ `/signup/user?token=${ props.preflight.token }&step=2` } className={ "button button--secondary" }>
          前へ
        </Link>
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