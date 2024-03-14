export type Preflight = {
  email: string;
  token: string;
}

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