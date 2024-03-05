import { json, redirect,　useLoaderData, useActionData, Link, Form, useParams } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { getSession, commitSession } from "~/services/session.server";
import authenticate from "~/services/authenticate.user.server";
import CommentFormModal from "~/components/report/CommentFormModal";
import { AnimatePresence } from "framer-motion";
import { Wrap as UserFormWrap, View as ViewProc } from "~/components/report/ReportViewForm";

export const meta: MetaFunction = () => {
  return [
    { title: "記事詳細 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type report = {id:string, fishkind:number, title:string, detail_modify:string, nickname:string, updatedDate:Date };
type comment = {num:number, nickname:string, comment:string, updatedDate:Date };

type LoaderApiResponse = {
  status: number;
  messages: { message: string };
  report: report;
  comment: comment[];
  likenum:number;
}

type ActionApiResponse = {
  status: number;
  messages: { message: string };
};

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {

  console.log("======reportview  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
  const signature = await authenticate({ session: session });

  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }

  // URLパラメータから記事種別と記事IDを取得
  const kind = new URL(request.url).searchParams.get("kind");
  const id = new URL(request.url).searchParams.get("id");
  const ref = new URL(request.url).searchParams.get("ref");

  console.log("kind=", kind);
  console.log("id=", id);
  console.log("ref=", ref);

//  const FormDat = await request.formData();
//  console.log("FormDat=", FormDat);
//  const like = FormDat.get("like");
//  console.log("like=", like);

  if (ref === "view"){
    // FormData作成
    const formData = new FormData();
    formData.append("user[signature]", String(signature));
    formData.append("report[kind]", String(kind));
    formData.append("report[id]", String(id));

    console.log("formData.singnature=", formData.get("user[signature]"));
    console.log("formData.report[kind]=", formData.get("report[kind]"));
    console.log("formData.report[id]=", formData.get("report[id]"));

    //該当記事の詳細API呼び出し
    const apiResponse = await fetch(`${ context.env.API_URL }/detail/view`, { method: "POST", body: formData });
    // JSONデータを取得
    const jsonData = await apiResponse.json<LoaderApiResponse>();
    console.log("jsonData=", jsonData);
    console.log("jsonData.report=", jsonData.report);
    console.log("jsonData.comment=", jsonData.comment);

    // ステータス200以外の場合はエラー
    if (jsonData.status !== 200) {
      throw new Response(null, {
        status: jsonData.status,
        statusText: jsonData.messages.message,
      });
    }
    
    return json(
      {
        ref: ref,
        kind: kind,
        report: jsonData.report,
        comments: jsonData.comment,
        likenum:jsonData.likenum
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        }
      });      
  }

  if (ref === "comment"){
    console.log("comment");

    return json({
      ref: ref,
      kind: kind,
      report: null,
      comments: null,
      likenum: 0
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    });      
}

}

/**
 * Action
 */
export async function action({ request, context }: ActionFunctionArgs) {
  console.log("======reportview  ACTION======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
  const signature = await authenticate({ session: session });
  console.log("signature=", signature);

  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }

  // URLパラメータからrefを取得
  const ref = new URL(request.url).searchParams.get("ref");
  const id = new URL(request.url).searchParams.get("id");

  console.log("ref=", ref);
  console.log("id=", id);
  
  // フォームデータを取得
  const formData = await request.formData();
  const likeid = formData.get("likeid");
  console.log("likeid=", likeid);

  if (likeid !== null) {
    //ほしいね
    console.log("like");
    formData.append("user[signature]", String(signature));
    formData.append("report[id]", String(likeid));

    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/detail/likeup`, { method: "POST", body: formData });

    // APIからデータを受信
    const jsonData = await apiResponse.json<ActionApiResponse>();

    // ステータス200の場合はエラー
    console.log("jsonData=", jsonData);
    if (jsonData.status !== 200) {
      throw new Response(null, {
        status: jsonData.status,
        statusText: jsonData.messages.message,
      });
    }
    
    //セッションに今回いいねした記事IDを追加する
    const likeary: string[] = session.get("home-user-like");
    if (likeary != null){
      likeary.push(String(likeid));    
      session.set("home-user-like", likeary);  
    }
    else{
      //初回はこちら
      const tmp :String[] = [String(likeid)];
      session.set("home-user-like", tmp);  
    }

    return redirect(`/home/reportview?ref=view&id=${likeid}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });  
  }

  if (formData.get("form") === "CommentUpdate") {
    //　コメント登録
    console.log("commentupdate");
    const comment = formData.get("report[comment]");
    formData.append("user[signature]", String(signature));
    formData.append("report[id]", String(id));
    formData.append("report[comment]", String(comment));

    console.log("formdata.user[signature]", formData.get("user[signature]"));
    console.log("formdata.report[id]", formData.get("report[id]"));
    console.log("formdata.report[comment]", formData.get("report[comment]"));

    // APIへデータを送信
    const apiResponse = await fetch(`${ context.env.API_URL }/detail/Comment`, { method: "POST", body: formData });
    // APIからデータを受信
    const jsonData = await apiResponse.json<ActionApiResponse>();

    // ステータス200の場合はエラー
    console.log("jsonData=", jsonData);
    if (jsonData.status !== 200) {
      throw new Response(null, {
        status: jsonData.status,
        statusText: jsonData.messages.message,
      });
    }
    
    //セッションに今回コメントした記事IDを追加する
    const commentary: string[] = session.get("home-user-comment");

    if (commentary != null){
      if (commentary.indexOf(String(id)) == -1){
        //コメント済みでないなら追加
        commentary.push(String(id));    
      }
      session.set("home-user-comment", commentary);  
    }
    else{
      //初回はこちら
      const tmp :String[] = [String(id)];
      session.set("home-user-comment", tmp);
    }
    
    return redirect(`/home/reportview?ref=view&id=${id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });  
  }
}

export default function Page() {

  // LOADER
  const loaderData = useLoaderData<typeof loader>();

  // ACTION
  const actionData = useActionData<typeof action>();

  const ref = loaderData.ref;

  return (
    <article>
      <AnimatePresence initial={ false }>
      { /* 記事詳細画面 */ }
        { ref === "view" &&
        <UserFormWrap key={ "view" }>
          <ViewProc loaderData={ loaderData }/>
        </UserFormWrap>
        }

      { /* コメントフォームモーダル */ }
        { ref === "comment" &&
        <CommentFormModal 
          loaderData={ loaderData! }
          actionData={ actionData! }
        />
        }
      </AnimatePresence>
    </article>
  );
}
  