import { SerializeFrom } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { userFormValidator_step2 } from "~/validators/signupFormValidator";
import { Preflight } from "~/types/Preflight";
import { SignupUserFormData } from "~/types/SignupUserFormData";
import SectionRadioGroup from "~/components/form/SectionRadioGroup";
import { useState } from "react";

interface UserFormStep2Props {
  preflight: SerializeFrom<Preflight>;
  signupUserFormData: SignupUserFormData;
}
export default function UserFormStep2({ ...props }: UserFormStep2Props) {
  
  const [section, setSection] = useState<number>(props.signupUserFormData.section);
  
  return (
    <ValidatedForm
      validator={ userFormValidator_step2 } 
      method={ "POST" }
      action={ `?token=${ props.preflight.token }&step=2` }
    >
      <label>(2/4)</label>
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP2: 利用者区分を設定してください</h2>
      <SectionRadioGroup name={ "user[section]" } defaultValue={ props.signupUserFormData.section } setSection={ setSection }/>
      <input type={ "hidden" } name={ "step" } value={ 2 }/>
      <input type={ "hidden" } name={ "token" } value={ props.preflight.token }/>
      { Number(section) === 3 &&
      <p className={ "-mt-6 ml-2 text-gray-600" }>※生産者登録の場合、運営側で確認後に本登録となります</p>
      }
      <div className={ "flex gap-2 md:gap-8" }>
        <Link to={ `/signup/user?token=${ props.preflight.token }&step=1` } className={ "button button--secondary" }>
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