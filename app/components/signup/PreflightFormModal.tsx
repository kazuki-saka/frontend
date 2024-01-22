import { SerializeFrom } from "@remix-run/cloudflare";
import { useNavigate, useNavigation } from "@remix-run/react";
import { loader as signupLoader, action as signupAction } from "~/routes/signup._index";
import { ValidatedForm } from "remix-validated-form";
import { preflightFormValidator } from "~/validators/signupFormValidator";
import Modal from "~/components/Modal";
import EmailInput from "~/components/form/EmailInput";

interface PreflightFormModalProps {
  loaderData: SerializeFrom<typeof signupLoader>;
  actionData: SerializeFrom<typeof signupAction>;
}

export default function PreflightFormModal({ ...props }: PreflightFormModalProps) {
  return (
    <Modal 
      isOpen={ (props.loaderData && props.loaderData.ref === "preflight") as boolean } 
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
      <p>メールアドレス認証</p>
      <a className={ "modal-cancel-button" } onClick={ () => navigate("/signup") }>キャンセル</a>
    </>
  );
};

const _Body = ({ ...props }: { actionData: SerializeFrom<typeof signupAction> }) => {
  // Navigate
  const navigation = useNavigation();
  
  return (
    <>
      { /* フォーム */ }
      <ValidatedForm
        replace
        validator={ preflightFormValidator } 
        method={ "POST" }
      >
        <EmailInput name={ "preflight[email]"}/>
        <input type={ "hidden" } name={ "form" } value={ "preflight" } placeholder={ "" }/>
        <button 
          type={ `${ navigation.state === "idle" ? "submit" : "button" }` } 
          className={ "button button--primary" }
          disabled={ navigation.state === "submitting" }
        >
          { navigation.state !== "submitting" ? "メールを送信" : "お待ちください" }
        </button>
      </ValidatedForm>
      { /* ローディング */ }
      { navigation.state === "submitting" &&
      <div className={ "loading absolute top-0 left-0 w-full h-full z-10 bg-white bg-opacity-50 select-none" }>
        <div className={ "flex justify-center items-center w-full h-full" }>
          <p className={ "text-36ptr md:text-40ptr text-gray-600 font-bold" }>送信しています...</p>
        </div>
      </div>
      }
    </>
  );
};