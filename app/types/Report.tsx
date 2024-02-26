export type Report = {
  title: string;
  detail: string;
  kind: string;    
  token: string;
}

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
}