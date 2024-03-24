import { useNavigation, Link, Form } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { motion, HTMLMotionProps } from "framer-motion";
import { userSchema_step1, userSchema_step2, userSchema_step3 } from "~/schemas/signup";
import { User as SignupUserFormData } from "~/types/User";
import sections from "~/components/report/form/sections";
import FishmanEmailInput from "~/components/signup/form/FishmanEmailInput";
import PassphraseInput from "~/components/signup/form/PassphraseInput";
import ShopNameInput from "~/components/signup/form/ShopnameInput";
import ViewnameInput from "~/components/signup/form/ViewnameInput";
import NameInput from "~/components/signup/form/NameInput";
import Submitting from "~/components/signup/form/Submitting";

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
  signupUserFormData: SignupUserFormData;
}
export function Step1({ ...props }: Step1Props) {
  return (
    <ValidatedForm
      validator={ userSchema_step1 } 
      method={ "POST" }
      action={ `?step=1` }
    >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP1: メールアドレス・パスワードを設定してください</h2>
      <FishmanEmailInput name={ "user[email]" } />
      <PassphraseInput name={ "user[passphrase]" }/>
      <PassphraseInput name={ "user[passphraseConfirm]" } isConfirm/>
      <input type={ "hidden" } name={ "step" } value={ 1 }/>
      <div className={ "" }>
        <button 
          type={ "submit" }
          className={ "button button--primary" }
          //disabled={ navigation.state === "submitting" }
        >
          次へ
        </button>
      </div>
    </ValidatedForm>
  );
}

interface Step2Props {
  signupUserFormData: SignupUserFormData;
}
export function Step2({ ...props }: Step2Props) {
  // Props
  const { signupUserFormData } = props;
  const { personal } = signupUserFormData;
  
  return (
    <ValidatedForm
      validator={ userSchema_step3 } 
      method={ "POST" }
      action={ `?step=2` }
    >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP2: 登録情報を設定してください</h2>
      <ShopNameInput name={"user[shopname]"}defaultValue={ signupUserFormData.shopname }/>
      <NameInput name={ "user[personal][name]" } defaultValue={ personal ? personal.name : "" }/>
      <ViewnameInput name={ "user[viewname]" } defaultValue={ signupUserFormData.viewname }/>

      <input type={ "hidden" } name={ "step" } value={ 2 }/>
      <div className={ "flex gap-2 md:gap-8" }>
        <Link to={ `/home/fishmanuser?step=1` } className={ "button button--secondary" }>
          前へ
        </Link>
        <button 
          type={ "submit" }
          className={ "button button--primary" }
          //disabled={ navigation.state === "submitting" }
        >
          次へ
        </button>
      </div>
    </ValidatedForm>
  );
}

interface Step3Props {
  signupUserFormData: SignupUserFormData;
}
export function Step3({ ...props }: Step3Props) {
  // Props
  const { signupUserFormData } = props;
  const { personal } = signupUserFormData;
  
  // Navigate
  const navigation = useNavigation();
  
  return (
    <Form
      method={ "POST" }
      action={ `?step=3` }
      className={ "confirm-form" }
    >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>STEP3: 登録内容の確認</h2>
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>メールアドレス(ユーザー名)</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ signupUserFormData.username }</p>
      </fieldset>
      
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>パスワード</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ signupUserFormData.passphrase.split("").map((t) => { return "*" }) }</p>
      </fieldset>
      
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>利用者区分</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ sections.filter((section) => section.value === signupUserFormData.section)[0].name }</p>
      </fieldset>
      
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>店舗名・屋号</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ signupUserFormData.shopname }</p>
      </fieldset>
      
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>お名前</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ personal.name }</p>
      </fieldset>
      
      <fieldset className={ "border-b-2 border-solid pb-2" }>
        <label>ニックネーム</label>
        <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold" }>{ signupUserFormData.viewname }</p>
      </fieldset>

      
      <input type={ "hidden" } name={ "step" } value={ 3 }/>
      <div className={ "flex gap-2 md:gap-8" }>
        <Link to={ `/home/fishmanuser?step=2s` } className={ "button button--secondary" }>
          前へ
        </Link>
        <button 
          type={ "submit" }
          className={ "button button--primary" }
          //disabled={ navigation.state === "submitting" }
        >
          上記の内容で送信
        </button>
      </div>
      { /* ローディング */ }
      <Submitting state={ navigation.state } /> 
    </Form>
  );
}