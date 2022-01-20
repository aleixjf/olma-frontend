export interface PlayedTrack {
  track: SpotifyApi.TrackObjectFull;
  played_at: string;
  context: SpotifyApi.ContextObject;
}
