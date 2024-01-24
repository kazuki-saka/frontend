import { SerializeFrom } from "@remix-run/cloudflare";
import { useNavigate, useNavigation } from "@remix-run/react";
import { loader as signupLoader, action as signupAction } from "~/routes/signup._index";
import { signinSchema } from "~/schemas/signin";
import { ValidatedForm, useField, useFieldArray } from "remix-validated-form";
import Modal from "~/components/Modal";
import UsernameInput from "~/components/signup/form/UsernameInput";
import PassphraseInput from "~/components/signup/form/PassphraseInput";
import Submitting from "~/components/signup/form/Submitting";

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
  // Navigate
  const navigation = useNavigation();
  
  // Props
  const { actionData } = props;
  //const { error } = actionData!;
  
  return (
    <>
      <ValidatedForm
        validator={ signinSchema } 
        method={ "POST" }
      >
        <UsernameInput name={ "user[username]" }/>
        <PassphraseInput name={ "user[passphrase]" }/>
        { actionData && actionData.error && <p className={ "text-error text-center font-semibold" }>{ actionData.error }</p> }
        <input type={ "hidden" } name={ "form" } value={ "signin" } placeholder={ "" }/>
        <button type={ "submit" } className={ "button button--primary" }>サインイン</button>
      </ValidatedForm>
      { /* ローディング */ }
      <Submitting state={ navigation.state } />
    </>
  );
};