import { CueDTO } from './cue';

export class GridMarkerDTO extends CueDTO {
  /* Common parameters */
  type = 4;

  /* Grid parameters */
  bpm: number;
  metronome?: string;
  battito?: number;

  constructor(
    position: number,
    bpm: number,
    index?: number,
    name?: string,
    metronome?: string,
    battito?: number,
  ) {
    super(position, index, name, 4);

    this.bpm = bpm;
    this.metronome = metronome;
    this.battito = battito;
  }
}
