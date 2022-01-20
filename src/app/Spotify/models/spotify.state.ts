import { PayloadDTO } from 'src/app/Shared/models/payload.dto';

export interface SpotifyState {
  /*
  user: {
    tracks: TrackDTO[];
    playlists: PlaylistDTO[];
  } | null;
  */
  tracks: SpotifyApi.TrackObjectFull[] | undefined;
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: SpotifyState = {
  tracks: undefined,
  error: null,
  pending: false,
};
