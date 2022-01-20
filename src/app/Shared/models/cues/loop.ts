import { CueDTO } from './cue';

export class LoopDTO extends CueDTO {
  /* Common parameters */
  type = 5;

  /* Loop parameters */
  length: number; //loop duration (in s?)
  end: number; //cue position (in s?)

  constructor(position: number, length: number, index?: number, name?: string) {
    super(position, index, name, 5);
    this.length = length;
    this.end = position + length;
  }
}
