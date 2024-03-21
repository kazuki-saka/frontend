import { Link, Form } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/cloudflare";
import { motion, HTMLMotionProps } from "framer-motion";
import parse from "html-react-parser";
import { loader as ReportViewLoader, action as ReportViewAction } from "~/routes/home.reportview";
import { FaRegCommentAlt, FaCommentAlt, FaPaperPlane } from "react-icons/fa";
import { TbStar, TbStarFilled } from "react-icons/tb";

import { ValidatedForm } from "remix-validated-form";
import { CommentSchema } from "~/schemas/newcomment";
import { useRef, useCallback } from "react";
import CommentInput from "./form/CommentInput"

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

/** 記事部分を分離 */
export function Post({ ...props }: ReprtViewFormProps) {
  // LOADER
  const loader = props.loaderData;
  // Payloads
  const { likenum, likeflg, comments, commentflg, report, uploads_url } = loader;
  const { title, nickname, detail_modify } = report as { title: string, nickname: string, detail_modify: string }; /** 型定義してください */

  return (
    <div className={ "px-0 md:px-[10%] py-0 md:py-[5%] flex flex-col gap-4" }>
      
      <div className={ "bg-gray-300 w-full min-h-[300px] md:min-h-[600px]" }>
        <img src= { uploads_url + report?.filePath } alt={ report?.title }></img>
      </div>
      
      <div>
        <h2 className={ "text-28ptr md:text-36ptr font-semibold" }>{ title }</h2>
        <p className={ "text-gray-500" }>{ nickname }</p>
        <div className={ "flex justify-start items-center gap-4" }>
          <div className={ "flex justify-start items-center gap-2" }>
            { likeflg && <TbStarFilled className={ "text-[#003371]" }/> }
            { !likeflg && <TbStar className={ "text-gray-500" }/> }
            <span className={ likeflg ? "text-[#003371]" : "text-gray-500" }>{ likenum || 0 }</span>
          </div>
          <div className={ "flex justify-start items-center gap-2" }>
            { commentflg && <FaCommentAlt className={ "text-[#003371]" }/> }
            { !commentflg && <FaRegCommentAlt className={ "text-gray-500" }/> }
            <span className={ commentflg ? "text-[#003371]" : "text-gray-500" }>{ Number(comments!.length) }</span>
          </div>
        </div>
      </div>
      
      {/* 本文エリア */}
      <div className={ "break-words whitespace-pre" }>
        { parse(detail_modify.replace("/cmsb/uploads", uploads_url)) }
      </div>
            
      <div className={ "flex justify-start items-center gap-4" }>
        <div className={ "flex justify-start items-center gap-2 " }>
          <Form
            method={ "POST" }
            action={ `?ref=view` }
            className={ "border-solid border-[1px] border-gray-400 rounded-full flex justify-center items-center p-3" }
          >
            <button 
              type={ "submit" }
              className={ "px-0 py-0" }
              name={ "likeid" }
              value={ report!.id }
            >
              {  likeflg && <TbStarFilled className={ "text-[#003371] text-[140%]" }/> }
              { !likeflg && <TbStar className={ "text-gray-500 text-[140%]" }/> }
            </button>
          </Form>
          <span className={ likeflg ? "text-[#003371]" : "text-gray-500" }>{ likenum || 0 }</span>
        </div>
        <div className={ "flex justify-start items-center gap-2" }>
          {  commentflg && <FaCommentAlt className={ "text-[#003371]" }/> }
          {  !commentflg && <FaRegCommentAlt className={ "text-gray-500 text-[120%]" }/> }
          <span className={ commentflg ? "text-[#003371]" : "text-gray-500" }>{ Number(comments!.length) }</span>
        </div>
      </div>
    </div>
  );
}

/** コメント部分を分離 */
export function Comments({ ...props }: ReprtViewFormProps) {
  // LOADER
  const loader = props.loaderData;
  // Payloads
  const { likenum, comments, report } = loader;
  // Refs
  const commentRef = useRef<HTMLTextAreaElement>(null);
  // Callbacks
  const clear = useCallback(() => {
    if (commentRef && commentRef.current) {
      commentRef.current.value = "";
      commentRef.current.blur();  //フォーカスが外れる
    }
  }, [commentRef]);
  
  return (
    <div id={ "comments" }>
      <div className={ "flex flex-col gap-4 px-0 md:px-[10%] py-4 md:py-0 md:pt-[5%]" }>
        { comments && comments.map((come) => (
        <div key={ come.num }>
          <p className={ "text-gray-500 text-[86%] whitespace-nowrap leading-none" }>{ come.nickname }</p>
          {/*<p>コメント日時{come.updatedDate.toString()}</p>*/}
          <p className={ "break-words whitespace-pre text-[92%]" }>
            { come.comment }
          </p>
        </div>
        ))}
      </div>
            
      {/* コメントフォーム::大きめ画面の場合 */}
      <ValidatedForm
        validator={ CommentSchema } 
        method={ "POST" }
        className={ /* "confirm-form px-0 py-0 md:px-[10%] mt-4 hidden md:block" */ "confirm-form px-0 py-0 pt-8" }
        onSubmit={ clear }
      >
        <CommentInput name={ "report[comment]" } className={ "bg-[#ededed] md:px-[0%] " }  />
        <input type={ "hidden" } name={ "form" } value={ "CommentUpdate" } />
      </ValidatedForm>
      
      <div className={ "px-0 md:px-[10%] pt-8" }>
      <Link to={ "/home/inquiry" } className={ "button button--primary" }>ご注文・お問い合わせ</Link>
      </div>

      {/* <p><Link to={ `/home/pickup?ref=${report!.fishkind}` }>一覧に戻る</Link></p> */}
    </div>
  );
}

