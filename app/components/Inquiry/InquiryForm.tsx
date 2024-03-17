import { useNavigation, Link, Form } from "@remix-run/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Inquiry as InquiryFormData } from "~/types/Inquiry";
import { ValidatedForm } from "remix-validated-form";
import { InquirySchema_step1 } from "~/schemas/inquiry";
import  FishDropdownList  from "./form/FishDropDownList";
import ShopNameInput from "./form/ShopnameInput";
import NameInput from "./form/NameInput";
import PostCodeInput from "./form/PostCodeInput";
import AdressInput from "./form/AdressInput";
import InquiryDetailInput from "./form/InquiryDetailInput"
import FishKindAry from "../FishKind";

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
  InquiryData: InquiryFormData;
}

export function Step1({ ...props }: Step1Props) {

  const { InquiryData } = props;

  return (
    <ValidatedForm
    validator={ InquirySchema_step1 } 
    method={ "POST" }
    action={ `?step=1` }
    >
    <div className={ "container" }>
      <div className={ "wrap" }>
        <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>
          <p>問い合わせたい内容を記入願います。</p>
          <p>魚種：{FishKindAry[Number(InquiryData.kind) - 1].name}</p>
        </h2>
        <ShopNameInput  name={"inquiry[shopname]"} defaultValue={InquiryData.shopname }/>
        <NameInput  name={"inquiry[rejistname]"} defaultValue={InquiryData.rejistname }/>
        <PostCodeInput name ={"inquiry[postcode]"} defaultValue={InquiryData.postcode}/>
        <AdressInput name={"inquiry[address]"} defaultValue={InquiryData.address}/>        
        <InquiryDetailInput name={"inquiry[detail]"} defaultValue={InquiryData.detail}/> 
        <input type={ "hidden" } name={ "step" } value={ 1 }/>
        <div className={ "flex gap-2 md:gap-8" }>
          <button 
            type={ "submit" }
            className={ "button button--primary" }
          >
            問い合わせ内容確認画面へ
          </button>
        </div>
      </div>  
    </div>
    </ValidatedForm>
  );
}

interface Step2Props {
  InquiryData: InquiryFormData;
}

export function Step2({ ...props }: Step2Props) {

  const { InquiryData } = props;

  return (
    <Form
      method={ "POST" }
      action={ `?step=2` }
      className={ "confirm-form" }
      >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>問い合わせ内容の確認</h2>

      <fieldset>
        <label>魚種</label>
        <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ FishKindAry[Number(InquiryData.kind) - 1].name  }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>店舗・屋号</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ InquiryData.shopname }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>お名前</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ InquiryData.rejistname }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>郵便番号</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ InquiryData.postcode }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>住所</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ InquiryData.address }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>問い合わせ内容</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>
          <div className='break-words whitespace-pre'>
            { InquiryData.detail }
          </div>
        </p>
      </fieldset>

      <input type={ "hidden" } name={ "step" } value={ 2 }/>
      <div className={ "wrap" }>
        <Link to={ `/home/Inquiry?step=1` } className={ "button button--secondary" }>
          前へ
        </Link>
        <button 
            type={ "submit" }
            className={ "button button--primary" }
        >
        この内容で問い合わせする</button>
      </div>  
  </Form>
  );
}
