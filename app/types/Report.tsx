export type Report = {
  title: string;
  detail: string;
  kind: string;    
  token: string;
};

export type comment = {
  num:number;
  nickname:string;
  comment:string;
  updatedDate:Date
};

export type ReportView = {
  id: string;
  title: string;
  detail: string;
  kind: string;
  comments: comment[];
};

export type reportcostom ={
  id:string;
  imgPath:string;
  title:string;
  detail_m:string; 
  nickname:string; 
  updatedDate:Date; 
  like_cnt:number;
  comment_cnt:number; 
  like_flg:boolean; 
  comment_flg:boolean;
};
