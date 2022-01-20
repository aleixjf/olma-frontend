import { Injectable } from '@angular/core';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  info(message: string): void {
    console.info(message);
    /*
    console.info('path:', message.path);
    console.info('timestamp:', message.timestamp);
    console.info('message:', message.message);
    console.info('messageDetail:', message.messageDetail);
    console.info('statusCode:', message.statusCode);
    */
  }

  warning(message: string): void {
    console.warn(message);
    /*
    console.warn('path:', message.path);
    console.warn('timestamp:', message.timestamp);
    console.warn('message:', message.message);
    console.warn('messageDetail:', message.messageDetail);
    console.warn('statusCode:', message.statusCode);
    */
  }

  error(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }
}
