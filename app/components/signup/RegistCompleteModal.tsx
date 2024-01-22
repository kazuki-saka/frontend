import { SerializeFrom } from "@remix-run/cloudflare";
import { useNavigate, Link } from "@remix-run/react";
import { loader as RegistLoader } from "~/routes/signup.complete";
import Modal from "~/components/Modal";

interface RegistCompleteModalProps {
  loaderData: SerializeFrom<typeof RegistLoader>;
}

export default function RegistCompleteModal({ ...props }: RegistCompleteModalProps) {
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
      <p>本登録完了</p>
    </>
  );
}

const _Body = () => {
  return (
    <div className={ "wrap" }>
      <h3 className={ "text-24ptr md:text-28ptr font-semibold" }>登録メールを送信しました</h3>
      <p>
        本登録の手続きが完了しました！<br/>
        本登録した内容をメールで送りましたので、そちらを参照して<br/>
        下記のTOPボタンからサインインしてみましょう<br/>        
      </p>
      <div className={ "flex flex-col md:flex-row gap-4" }>
        <Link to={ "/signup" } className={ "button button--secondary" }>TOP</Link>
      </div>
    </div>
  );
}