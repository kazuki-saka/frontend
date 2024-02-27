import { Link, Form } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/cloudflare";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReportView as ReportViewFormData } from "~/types/Report";
import { loader as ReportViewLoader, action as ReportViewAction } from "~/routes/home.reportview";


export function Wrap({ ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeIn" }}
      { ...props }
    >
      { props.children }
    </motion.div>
  );
}

interface ReprtViewFormProps {
  loaderData: SerializeFrom<typeof ReportViewLoader>;
}

export function View({ ...props }: ReprtViewFormProps){
  const loader = props.loaderData;
  if (loader.comments == null){
    return;
  }
  return (
    <Form
      method={ "POST" }
      action={ `?ref=view` }
      className={ "confirm-form" }
    >
      <p>タイトル</p>
      { loader.report.title }
      <p>本文</p>
      <p>{ loader.report.detail_modify }</p>
      <p>ほしいね数：{ loader.likenum }</p>
      <p>この記事に対するコメント</p>
      { loader.comments.map((come) => (
        <li key={come.num}>
          <p>ニックネーム：{come.nickname} </p>
          <p>コメント日時{come.updatedDate.toString()}</p>
          <p>{come.comment}</p>
        </li>
      ))}
      
      <p><Link to={ `/home/reportview?ref=comment&id=${loader.report.id}` } className={ "button button--primary rounded-full" }>コメント</Link></p>
      <button 
            type={ "submit" }
            className={ "button button--primary" }
            name={ "likeid" }
            value={ loader.report.id }
      >
      ほしいね</button>

    </Form>
  );
}

