import { SerializeFrom } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { userFormValidator_step4 } from "~/validators/signupFormValidator";
import { Preflight } from "~/types/Preflight";
import { SignupUserFormData } from "~/types/SignupUserFormData";
import {sections} from "~/components/form/Sections"

interface UserFormStep4Props {
  preflight: SerializeFrom<Preflight>;
  signupUserFormData: SignupUserFormData;
}
export default function UserFormStep4({ ...props }: UserFormStep4Props) {

  return (
    <ValidatedForm
      validator={ userFormValidator_step4 } 
      method={ "POST" }
      action={ `?token=${ props.preflight.token }&step=4` }
    >
      <input type={ "hidden" } name={ "step" } value={ 4 }/>
      <label>(4/4)</label>
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP4: この登録内容で登録しますか？</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>登録内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>メールアドレス(ユーザー名)</td>
              <td>{props.preflight.email}</td>
            </tr>
            <tr>
              <td>パスワード</td>
              <td>{props.signupUserFormData.password}</td>
            </tr>
            <tr>
              <td>利用者区分</td>
              <td>{props.signupUserFormData.section}：{sections[props.signupUserFormData.section - 1].name}</td>
            </tr>
            <tr>
              <td>お名前</td>
              <td>{props.signupUserFormData.name}</td>
            </tr>
            <tr>
              <td>ご連絡先</td>
              <td>{props.signupUserFormData.phonenumber}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={ "flex gap-2 md:gap-8" }>
        <Link to={ `/signup/user?token=${ props.preflight.token }&step=3` } className={ "button button--primary" }>
          前へ
        </Link>
        <button 
          type={ "submit" }
          className={ "button button--primary" }
          //disabled={ navigation.state === "submitting" }
        >
          登録
        </button>
      </div>
    </ValidatedForm>
  );
}