import { useNavigation, Link, Form } from "@remix-run/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Report as ReportFormData } from "~/types/Report";
import { ValidatedForm } from "remix-validated-form";
import { ReportSchema_step1 } from "~/schemas/newreport";
import TitleInput from "~/components/report/form/TitleInput";
import DetailInput from "~/components/report/form/DetailInput";



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

interface Step1Props {
    ReportFormData: ReportFormData;
}
  
export function Step1({ ...props }: Step1Props) {

    return (
        <ValidatedForm
          validator={ ReportSchema_step1 } 
          method={ "POST" }
          action={ `?step=1` }
        >
        <div className={ "container" }>
          <div className={ "wrap" }>
          <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>新規記事投稿</h2>
          <fieldset>
          <label>魚種</label>
          <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ props.ReportFormData.kind }</p>
          </fieldset>
            <TitleInput name={"report[title]"} />
            <DetailInput name={"report[detail]"} />
            <button 
                type={ "submit" }
                className={ "button button--primary" }
            >投稿確認画面へ</button>
          </div>
    
        </div>
      </ValidatedForm>
    );
}

export function Step2({ ...props }: Step1Props) {

  const { ReportFormData } = props;

  // Navigate
  const navigation = useNavigation();

    return (
        <Form
          method={ "POST" }
          action={ `?step=2` }
          className={ "confirm-form" }
        >
          <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>投稿記事の確認</h2>
          <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>タイトル</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.title }</p>
          </fieldset>

          <fieldset className={ "border-b-2 border-solid pb-2" }>
          <label>本文</label>
          <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.detail }</p>
          </fieldset>

          <div className={ "wrap" }>
            <Link to={ `/newspost?step=1` } className={ "button button--secondary" }>
              前へ
            </Link>
            <button 
                type={ "submit" }
                className={ "button button--primary" }
            >
            この内容で投稿</button>
          </div>
    
      </Form>
    );
}