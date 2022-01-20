import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { PayloadDTO } from 'src/app/Shared/models/payload.dto';
import { TraktorLibrary } from './library';
import { RulesDTO } from 'src/app/Shared/models/rules.dto';
import { PlatformIDs } from 'src/app/Shared/models/metadata/platformIDs';

export interface LibraryState {
  collection?: TraktorLibrary;
  active: {
    uuid?: string;
    name?: string;
    ids?: PlatformIDs;
    tracks?: TrackDTO[];
    filtered?: TrackDTO[];
    rules?: RulesDTO;
  } | null;
  editor: TrackDTO | null;
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: LibraryState = {
  active: null,
  editor: null,
  error: null,
  pending: false,
};
