// INFO: This is an adaptation of the HttpErrorResponse to handle the errors in our way
// import { HttpErrorResponse } from "@angular/common/http";

import { ErrorDTO } from './error.dto';

export interface PayloadDTO {
  // headers?: HttpHeaders;
  // url?: string;
  status?: number;
  // statusText?: string,
  // ok: boolean, --> errors are always false (OK only for 200+ responses)
  // name: string,
  message: string;
  //error?: any;
  error?: ErrorDTO;
}
