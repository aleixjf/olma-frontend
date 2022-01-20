import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { FolderDTO } from 'src/app/Shared/models/folder.dto';
import { Indexing, MusicFolders, Sets } from './xml/traktor.xml';

export interface Library {
  tracks?: TrackDTO[]; //Visible Tracks
  playlists?: FolderDTO;
}

export interface TraktorLibrary extends Library {
  musicFolders?: MusicFolders;
  remixSets?: Sets;
  indexing?: Indexing;
}
