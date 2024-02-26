import { useNavigate, useNavigation } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/cloudflare";
import Modal from "~/components/Modal";
import { ValidatedForm } from "remix-validated-form";
import { CommentSchema } from "~/schemas/newcomment";
import CommentInput from "~/components/report/form/CommentInput";
import { loader as commentLoader, action as commentAction } from "~/routes/home.reportview";


interface CommentFormModalProps {
    loaderData: SerializeFrom<typeof commentLoader>;
    actionData: SerializeFrom<typeof commentAction>;
  }
  
export default function CommentFormModal({ ...props }: CommentFormModalProps){

    return (
      <Modal 
        isOpen={ (props.loaderData && props.loaderData.ref === "comment") as boolean } 
        height={30}
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
      <p>コメント入力欄</p>
      <a className={ "modal-cancel-button" } onClick={ () => navigate("/ReportView") }>キャンセル</a>
    </>
  );
};

const _Body = ({ ...props }: { actionData: SerializeFrom<typeof commentAction> }) => {
  
  // Navigate
  const navigation = useNavigation();
  
  // Props
  const { actionData } = props;
  
  return (
    <>
      <ValidatedForm
        validator={ CommentSchema } 
        method={ "POST" }
      >
        <CommentInput name={ "report[comment]" }/>
        <input type={ "hidden" } name={ "form" } value={ "CommentUpdate" } placeholder={ "" }/>
        <button type={ "submit" } className={ "button button--primary" }>上記の内容でコメント</button>
      </ValidatedForm>
    </>
  );
};