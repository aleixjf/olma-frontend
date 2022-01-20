//Angular
import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryState from 'src/app/Library/models/library.state';

//Models
import { FolderDTO, isFolderDTO } from 'src/app/Shared/models/folder.dto';
import { PlaylistDTO } from 'src/app/Shared/models/playlist.dto';

//Services
import { LibraryService } from '../../../services/library.service';

@Component({
  selector: 'app-side-panel-tree',
  templateUrl: './side-panel-tree.component.html',
  styleUrls: ['./side-panel-tree.component.scss'],
})
export class SidePanelTreeComponent {
  spinner!: boolean;

  dataSource = new MatTreeNestedDataSource<FolderDTO>();
  treeControl = new NestedTreeControl<FolderDTO | PlaylistDTO>((node) => {
    if (isFolderDTO(node)) return node.items;
    else return undefined;
  });
  hasChild = (_: number, node: FolderDTO) =>
    node.items && node.items.length > 0;

  constructor(
    private store: Store<AppState>,
    private libraryService: LibraryService,
  ) {
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        this.spinner = response.pending;
        if (response.collection?.playlists)
          this.dataSource.data = [response.collection.playlists];
        else this.dataSource.data = [];
      });
  }

  getPlaylistIcon(node: PlaylistDTO): string {
    if (node.rules) return 'settings';
    else
      switch (node.name) {
        case '_LOOPS':
          return 'loop';
        case '_RECORDINGS':
          return 'mic';
        case 'Preparation':
          return 'playlist_add';
        default:
          return 'queue_music'; //'playlist_play'
      }
  }
}
