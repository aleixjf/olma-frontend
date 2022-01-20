export class TokenDTO {
  uuid: string;
  provider: string;
  jwt: string;
  //token_type: string;
  issued_date: Date;
  expires: boolean;
  expiration_date?: Date;
  revoked: boolean;

  constructor(
    uuid: string,
    jwt: string,
    //token_type: string,
    issued_date?: Date,
    expires_in?: number, //seconds
    expiration_date?: Date,
    provider?: string,
  ) {
    this.uuid = uuid;
    this.jwt = jwt;
    //this.token_type = token_type;
    this.issued_date = issued_date ? issued_date : new Date();
    if (expiration_date) {
      this.expiration_date = expiration_date;
      this.expires = true;
    } else if (expires_in && !expiration_date) {
      this.expires = true;
      this.expiration_date = new Date(
        this.issued_date.getTime() + expires_in * 1000,
      );
    } else {
      this.expires = false;
    }
    this.provider = provider ? provider : 'olma';
    this.revoked = false;
  }

  expires_soon(margin?: number): boolean {
    //margin in seconds
    if (!margin) margin = 0;
    const current_time = new Date();
    current_time.getTime();
    if (this.expiration_date) {
      const expiration_margin = new Date();
      expiration_margin.setTime(
        this.expiration_date?.getTime() - margin * 1000,
      );
      return current_time >= expiration_margin;
    } else return false;
  }

  is_expired(): boolean {
    const current_time = new Date();
    current_time.getTime();
    return this.expiration_date ? current_time >= this.expiration_date : false;
  }
}
