import { PlatformTokens } from './platformTokens';

export class CredentialsDTO {
  uuid: string;
  email?: string;
  password?: string;
  //store_token?: boolean;
  tokens?: any;

  constructor(
    uuid: string,
    email?: string,
    password?: string,
    //access_token: string,
    tokens?: PlatformTokens,
    //store_token?: boolean,
  ) {
    this.uuid = uuid;
    this.email = email;
    this.password = password;
    //this.store_token = store_token;
    /*this.tokens = {
      olma: access_token,
    }*/
    this.tokens = tokens;
  }
}
