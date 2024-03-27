import { Link, Form } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/cloudflare";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import parse from "html-react-parser";
import { loader as ReportViewLoader, action as ReportViewAction } from "~/routes/home.reportview";
import { FaRegCommentAlt, FaCommentAlt, FaPaperPlane } from "react-icons/fa";
import { TbStar, TbStarFilled } from "react-icons/tb";

import { ValidatedForm } from "remix-validated-form";
import { CommentSchema } from "~/schemas/newcomment";
import { useRef, useCallback } from "react";
import TextareaAutosize from 'react-textarea-autosize';

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
    <div className={ "px-0 md:px-8 xl:px-12 py-0 md:py-8 xl:py-12 flex flex-col gap-4" }>
      <div className={ "bg-gray-300 w-full mb-8" }>
        <figure className={ "block relative w-full pt-[50.0%] md:pt-[50.0%]" }>
          <img src= { uploads_url + report?.filePath } alt={ report?.title } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
        </figure>
      </div>
      
      <div className={ "container mb-8" }>
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
      <div className={ "container break-words whitespace-break-spaces leading-loose" }>
        { parse(detail_modify.replace("/cmsb/uploads", uploads_url)) }
      </div>
            
      <div className={ "container flex justify-start items-center gap-4" }>
        <div className={ "flex justify-start items-center gap-2 " }>
          <Form
            method={ "POST" }
            action={ `?ref=view` }
            className={ `relative border-solid border-[1px] ${ likeflg ? "border-blue-550" : "border-gray-400" } rounded-full flex justify-center items-center w-14 h-14 px-0 py-0` }
          >
            <button 
              type={ "submit" }
              className={ "px-0 py-0 w-full h-full" }
              name={ "likeid" }
              value={ report!.id }
            >
              <AnimatePresence>
                <motion.span
                  layout 
                  initial={ { scale: 0 } }
                  animate={ { scale: 1 } }
                  exit={ { scale: 0 } }
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                  className={ "block" }
                  key={ String(likeflg) }
                >
                  {  likeflg && 
                  <TbStarFilled className={ "text-blue-550 text-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" }/>
                  }
                  { !likeflg && 
                  <TbStar className={ "text-gray-500 text-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" }/>
                  }
                </motion.span>
              </AnimatePresence>
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
  const { comments } = loader;
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
    <div id={ "comments" } className={ "container" }>
      <div className={ "flex flex-col gap-6 px-0 md:px-[10%] py-4 md:py-0 md:pt-[5%]" }>
        { comments && comments.map((come) => (
        <div key={ come.num }>
          <p className={ "text-gray-500 text-[86%] whitespace-nowrap leading-none" }>{ come.nickname }</p>
          {/*<p>コメント日時{come.updatedDate.toString()}</p>*/}
          <p className={ "break-words whitespace-pre-wrap text-[92%]" }>
            { come.comment }
          </p>
        </div>
        ))}
      </div>
            
      {/* コメントフォーム::大きめ画面の場合 */}
      <ValidatedForm
        validator={ CommentSchema } 
        method={ "POST" }
        className={ "confirm-form px-0 py-0 pt-8" }
        onSubmit={ clear }
      >
        <fieldset className={ "placeholder:text-[100%] md:px-[10%] px-0 py-0 pt-2" } >
          <label>コメント</label>
          <div className={ "flex justify-center items-center gap-4 w-full" }>
            <TextareaAutosize 
              className={ "bg-[#ededed] block flex-1 p-4 w-[90%] md:w-[94%]" }
              cols={32}
              name={"report[comment]"}
              placeholder={ "この記事に対してコメントを残す" }
              defaultValue={""}
              ref={ commentRef }
            />
            <button type={ "submit" } className={ "block w-[10%] md:w-[6%] h-9 " }>
              <FaPaperPlane className={ "w-full h-full text-gray-500" }/>
            </button>
          </div>
        </fieldset>
        <input type={ "hidden" } name={ "form" } value={ "CommentUpdate" } />
      </ValidatedForm>
      
      <div className={ "px-0 md:px-[10%] pt-8" }>
        <Link to={ "/home/inquiry" } className={ "button button--secondary" }>ご注文・お問い合わせ</Link>
      </div>

      {/* <p><Link to={ `/home/pickup?ref=${report!.fishkind}` }>一覧に戻る</Link></p> */}
    </div>
  );
}

