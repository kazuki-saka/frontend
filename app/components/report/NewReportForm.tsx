import { useNavigation, Link, Form } from "@remix-run/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Report as ReportFormData } from "~/types/Report";
import { ValidatedForm } from "remix-validated-form";
import { ReportSchema_step1, ReportSchema_step1Img } from "~/schemas/newreport";
import TitleInput from "~/components/report/form/TitleInput";
import DetailInput from "~/components/report/form/DetailInput";
import { useRef, useState } from "react";

let filename:string;

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

/*
export async function createUploadImage(file: File) {
  const formData = new FormData();

  Object.entries({ file }).forEach(([key]) => {
    formData.append(key, file);
  });

  const res = await axios.post(`api/detail/view`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data
}
*/

interface Step1Props {
    ReportFormData: ReportFormData;
}

//画像選択部分
export function ImgStep1({ ...props }: Step1Props) {

  const { ReportFormData } = props;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState("");
  if (!filename && ReportFormData.imgpath){
    filename = ReportFormData.imgpath;
  }

  const handleChangePreview = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) {
      return;
    }

    const fileinfo = ev.target.files[0];
    const urlname = URL.createObjectURL(fileinfo);
    setPreviewImage(urlname);
    //filename = fileinfo.name;
    filename = urlname;
  };

  return (
    <ValidatedForm
        validator={ ReportSchema_step1Img } 
        method={ "POST" }
        action={ `?step=1` }
      >
      <div className={ "container" }>
        <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>画像を投稿</h2>
        <div>
          <img
            alt= "画像が選択されていません。" 
            src={previewImage}
          />
          <input id="imginput"
            type="file"
            onChange={handleChangePreview}
            ref={inputFileRef}
            accept="image/*"
            style={{ display: "none" }}
          />
          <br></br>
          <button onClick={() => inputFileRef.current?.click()} className="button button--primary">
            画像を選択
          </button>
          <br></br>

          {filename !== undefined &&
            <button type={ "submit" } className="button button--secondary">
              アップロードする
            </button>
          }
          <input type={ "hidden" } name={ "step" } value={ 1 }/>
          <input type={ "hidden" } name={ "report[ref]" } value={ "image" }/>
          <input type={ "hidden" } name={ "report[imgpath]" } value={ filename }/>
        </div>
      </div>
    </ValidatedForm>
  );
}

//記事のタイトル・本文部分
export function ReportStep1({ ...props }: Step1Props) {

  const { ReportFormData } = props;

  return (
    <ValidatedForm
        validator={ ReportSchema_step1 } 
        method={ "POST" }
        action={ `?step=1` }
      >
      <div className={ "container" }>
        <label className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>記事を投稿</label>
        <fieldset>
          <label>魚種</label>
          <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.kind }</p>
        </fieldset>
        <TitleInput name={"report[title]"} defaultValue={ ReportFormData.title} />
        <DetailInput name={"report[detail]"} defaultValue={ ReportFormData.detail} />
        <input type={ "hidden" } name={ "step" } value={ 1 }/>
        <input type={ "hidden" } name={ "report[ref]" } value={ "detail" }/>
        <div className={ "flex gap-2 md:gap-8" }>
          <button 
            type={ "submit" }
            className={ "button button--primary" }
          >
            投稿確認画面へ
          </button>
        </div>
      </div>
    </ValidatedForm>
  );
}

interface Step2Props {
  ReportFormData: ReportFormData;
}

export function Step2({ ...props }: Step2Props) {

  const { ReportFormData } = props;

  return (
    <Form
      method={ "POST" }
      action={ `?step=2` }
      className={ "confirm-form" }
    >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>投稿記事の確認</h2>
      <label>投稿画像</label>
          <div className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>
            <img
              src={ReportFormData.imgpath}
            />
          </div>
      <fieldset>
          <label>魚種</label>
          <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.kind }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
      <label>タイトル</label>
      <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.title }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
      <label>本文</label>
      <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>
        <div className='break-words whitespace-pre'>
          { ReportFormData.detail }
        </div>
      </p>
      </fieldset>

      <input type={ "hidden" } name={ "step" } value={ 2 }/>
      <input type={ "hidden" } name={ "report[ref]" } value={ "detail" }/>
     <div className={ "wrap" }>
        <Link to={ `/home/newspost?step=1` } className={ "button button--secondary" }>
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