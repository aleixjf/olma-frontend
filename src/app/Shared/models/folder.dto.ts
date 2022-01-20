import { PlatformIDs } from 'src/app/Shared/models/metadata/platformIDs';
import { PlaylistDTO } from './playlist.dto';

export class FolderDTO {
  name: string;
  ids?: PlatformIDs;
  items?: (FolderDTO | PlaylistDTO)[];
  private type = 'folder';

  constructor(
    name: string,
    ids?: PlatformIDs,
    items?: (FolderDTO | PlaylistDTO)[],
  ) {
    this.name = name;
    this.ids = ids;
    this.items = items;
  }

  get num_items(): number {
    return this.items ? this.items.length : 0;
  }
}

export function isFolderDTO(object: any): object is FolderDTO {
  try {
    return object.type === 'folder';
  } catch (e) {
    return false;
  }
}
