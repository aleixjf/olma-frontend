import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): unknown {
    const dateTransform = new Date(value);
    const type: number = args[0];

    const dd: number = dateTransform.getDate();
    const mm: number = dateTransform.getMonth() + 1;
    const yyyy: number = dateTransform.getFullYear();
    const ddFormat: string = this.needZero(dd);
    const mmFormat: string = this.needZero(mm);

    let newFormat = '';
    if (type === 1) {
      newFormat = ddFormat + mmFormat + yyyy;
    }
    if (type === 2) {
      newFormat = ddFormat + ' / ' + mmFormat + ' / ' + yyyy;
    }
    if (type === 3) {
      newFormat = ddFormat + '/' + mmFormat + '/' + yyyy;
    }
    if (type === 4) {
      newFormat = yyyy + '-' + mmFormat + '-' + ddFormat;
    }

    return newFormat;
  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}
