export type User = {
  shopname: string;
  username: string;
  passphrase: string;
  viewname: string;
  personal: {
    name: string;
    phonenumber: string;
  }
  section: number;
};

export type Account = {
  shopname: string;
  username: string;
  nickname: string;
  rejistname: string;
  section: number;
};
