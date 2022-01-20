import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { PayloadDTO } from 'src/app/Shared/models/payload.dto';

export interface OneDriveState {
  files: TrackDTO[];
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: OneDriveState = {
  files: [],
  error: null,
  pending: false,
};
