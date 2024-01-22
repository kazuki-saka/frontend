import { SerializeFrom } from "@remix-run/cloudflare";
import { useNavigate  } from "@remix-run/react";
import { loader as signupLoader, action as signupAction } from "~/routes/signup._index";
import { userFormValidator_step1 } from "~/validators/signupFormValidator";
import { ValidatedForm, useField, useFieldArray } from "remix-validated-form";
import Modal from "~/components/Modal";
import EmailInput from "../form/EmailInput";
import PasswordInput from "../form/PasswordInput";

interface SigninFormModalProps {
  loaderData: SerializeFrom<typeof signupLoader>;
  actionData: SerializeFrom<typeof signupAction>;
}

export default function SigninFormModal({ ...props }: SigninFormModalProps) {
  return (
    <Modal 
      isOpen={ (props.loaderData && props.loaderData.ref === "signin") as boolean } 
      head={ _Head() }
      body={ _Body({ actionData: props.actionData }) }
    />
  );
}

const _Head = () => {
  // Navigate
  const navigate = useNavigate();
  return (
    <>
      <p>サインイン</p>
      <a className={ "modal-cancel-button" } onClick={ () => navigate("/signup") }>キャンセル</a>
    </>
  );
};

const _Body = ({ ...props }: { actionData: SerializeFrom<typeof signupAction> }) => {

  const navigate = useNavigate();
  
  return (
    <ValidatedForm
      replace
      validator={ userFormValidator_step1 } 
      method={ "POST" }
    >
      <EmailInput/>
      <PasswordInput/>
      <input type={ "hidden" } name={ "form" } value={ "signin" } placeholder={ "" }/>
      <button type={ "submit" } className={ "button button--primary" }>サインイン</button>
    </ValidatedForm>
  );
};