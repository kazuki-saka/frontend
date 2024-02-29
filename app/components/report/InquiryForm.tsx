import { useNavigation, Link, Form } from "@remix-run/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Inquiry as InquiryFormData } from "~/types/Inquiry";
import { ValidatedForm } from "remix-validated-form";
import { InquirySchema_step1 } from "~/schemas/inquiry";
import  FishDropdownList  from "~/components/report/form/FishDropDownList";
import ShopNameInput from "~/components/signup/form/ShopnameInput";
import NameInput from "~/components/signup/form/NameInput";
import PostCodeInput from "./form/PostCodeInput";
import AdressInput from "./form/AdressInput";
import InquiryDetailInput from "./form/InquiryDetailInput"

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
        <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>問い合わせたい内容を記入願います。</h2>
        <ShopNameInput  name={"user[shopname]"} defaultValue={InquiryData.shopname }/>
        <NameInput  name={"user[name]"} defaultValue={InquiryData.rejistname }/>
        <PostCodeInput name ={"inquiry[postcode]"} defaultValue={InquiryData.postcode}/>
        <AdressInput name={"inquiry[adress]"} defaultValue={InquiryData.address}/>
        <FishDropdownList />
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

