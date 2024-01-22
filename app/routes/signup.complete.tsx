import { json, MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import RegistCompleteModal from "~/components/signup/RegistCompleteModal";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
    return [
      { title: "利用者登録 | ふくいお魚つながるアプリ" },
      { name: "description", content: "ふくいお魚つながるアプリ" },
    ];
  };

 /**
 * Loader
 */
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("======LOADER_Complete======");
  // URLパラメータからrefを取得
  //const ref = new URL(request.url).searchParams.get("ref");
  const ref = "complete";
  // JSON形式で返却
  return json({
    ref: ref
  });
}


export default function Page() {

    // LOADER
    const loaderData = useLoaderData<typeof loader>();
  
    console.log("======Page_Complete======");
    return (
      <article className={ "bg-signup" }>
        { /* 登録完了モーダル */ }
        <RegistCompleteModal 
        loaderData={ loaderData! }
        />
      </article>
    );
  
}