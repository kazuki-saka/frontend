import { json, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import CommentFormModal from "~/components/report/CommentFormModal";
import { AnimatePresence } from "framer-motion";
import { Wrap as UserFormWrap, Comments, Post } from "~/components/report/ReportViewForm";

export const meta: MetaFunction = () => {
  return [
    { title: "記事詳細 | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type report = {id:string, fishkind:number, title:string, detail_modify:string, nickname:string, updatedDate:Date, filePath:string };
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
  // 認証署名取得
  const signature = session.get("signin-auth-user-signature");
  
  // 認証署名がない場合はエラー
  if (!signature) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }

  // 認証処理から認証署名を取得
  const { user, likes, comments } = await guard({ request: request, context: context });
  
  // URLパラメータから記事種別と記事IDを取得
  const id = new URL(request.url).searchParams.get("id");
  const ref = new URL(request.url).searchParams.get("ref");

  console.log("id=", id);
  console.log("ref=", ref);

//  const FormDat = await request.formData();
//  console.log("FormDat=", FormDat);
//  const like = FormDat.get("like");
//  console.log("like=", like);

  if (ref === "view") {

    // FormData作成
    const formData = new FormData();
    formData.append("user[signature]", String(signature));

    if (id === null){
      formData.append("report[id]", String(session.get("home-report-id")));  
    }
    else{
      formData.append("report[id]", String(id));
    }

    console.log("formData.singnature=", formData.get("user[signature]"));
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
    
    //セッションに魚種を保存
    session.set("home-fishkind", jsonData.report.fishkind);

    console.log("id=", jsonData.report.id);
    //ほしいね済みか判定
    const likeary: string[] = session.get("home-user-like");
    console.log("likeary=", likeary);
    const likeflg: boolean = likeary && likeary.indexOf(String(jsonData.report.id)) >= 0 ? true:false;
    console.log("likeflg=", likeflg);

    //一度でもコメントした記事か判定
    const commentary: string[] = session.get("home-user-comment");
    console.log("commentary=", commentary);
    const commentflg: boolean = commentary && commentary.indexOf(String(jsonData.report.id)) >= 0 ? true:false;
    console.log("commentflg=", commentflg);

    return json(
      {
        ref: ref,
        report: jsonData.report,
        comments: jsonData.comment,
        likenum: jsonData.likenum,
        likeflg: likeflg,
        commentflg: commentflg,
        uploads_url: context.env.UPLOADS_URL,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        }
      });      
  }

  if (ref === "comment") {
    console.log("comment");

    return json({
      ref: ref,
      report: null,
      comments: null,
      likenum: 0,
      likeflg: false,
      commentflg: false,
      uploads_url: context.env.UPLOADS_URL,
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
  
  const signature = session.get("signin-auth-user-signature");
  
  // 認証処理から認証署名を取得
  const { user, likes, comments } = await guard({ request: request, context: context });
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

    //セッションに記事IDを保存
    session.set("home-report-id", likeid);
    
    /** ページ遷移不要 */
    /*
    return redirect(`/home/reportview?ref=view&id=${likeid}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });  
    */
    
    return json({
      status: "OK",
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    }); 
  }

  if (formData.get("form") === "CommentUpdate") {
    //　コメント登録
    console.log("commentupdate");
    const comment = formData.get("report[comment]");
    formData.append("user[signature]", String(signature));
    if (id === null){
      //ほしいねした後はidが消えているので
      formData.append("report[id]", String(session.get("home-report-id")));
    }
    else{
      formData.append("report[id]", String(id));
    }
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
        
    /** ページ遷移不要 */
    /*
    return redirect(`/home/reportview?ref=view&id=${id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
    */
    
    return json({
      status: "OK",
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    }); 
  }
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { ref } = loaderData;
  
  // ACTION
  const actionData = useActionData<typeof action>();

  
  return (
    <>
      <AnimatePresence initial={ false }>
        { /* 記事詳細画面 */ }
        <UserFormWrap >
          { /* コメント送信時再レンダリング不要 */ }
          <Post loaderData={ loaderData } />
          <div className={ "bg-gray-400 w-full h-[1px] mt-4" }/>
          { /* コメント送信時再レンダリング必要 */ }
          <Comments loaderData={ loaderData } />
        </UserFormWrap>        
      </AnimatePresence>
    </>
  );
}
  