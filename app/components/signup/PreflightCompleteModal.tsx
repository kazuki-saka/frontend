import { SerializeFrom } from "@remix-run/cloudflare";
import { useNavigate, Link } from "@remix-run/react";
import { loader as signupLoader } from "~/routes/signup._index";
import Modal from "~/components/Modal";

interface PreflightCompleteModalProps {
  loaderData: SerializeFrom<typeof signupLoader>;
}

export default function PreflightCompleteModal({ ...props }: PreflightCompleteModalProps) {
  return (
    <Modal 
      isOpen={ (props.loaderData && props.loaderData.ref === "complete") as boolean } 
      head={ _Head() }
      body={ _Body() }
    />
  );
}

const _Head = () => {
  return (
    <>
      <p>メールアドレス認証</p>
    </>
  );
}

const _Body = () => {
  return (
    <div className={ "wrap" }>
      <h3 className={ "text-24ptr md:text-28ptr font-semibold" }>認証メールを送信しました</h3>
      <p>
        仮登録が完了しました！<br/>
        記事の閲覧、コメントなどを行う場合、続けてメール認証を完了させましょう！<br/>
        お手元の確認用メールをご確認ください。
      </p>
      <div className={ "flex flex-col md:flex-row gap-4" }>
        <Link to={ "/signup?ref=preflight" } className={ "button button--primary" }>メールを再送信</Link>
        <Link to={ "/signup" } className={ "button button--secondary" }>閉じる</Link>
      </div>
    </div>
  );
}