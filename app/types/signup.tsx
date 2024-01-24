export type Preflight = {
  email: string;
  token: string;
}

export type User = {
  username: string;
  passphrase: string;
  viewname: string;
  personal: {
    name: string;
    phonenumber: string;
  }
  section: number;
};