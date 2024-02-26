export type ReportType = {
  name: string;
  value: number;
};

const ReportTyps: ReportType[] = [
    {
        name: "トピックス",
        value: 1
    },
    {
        name: "生産者投稿記事",
        value: 2
    },
    {
        name: "市場関係投稿記事",
        value: 3
    },
];
export default ReportTyps;