//Angular
import { Component } from '@angular/core';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryActions from 'src/app/Library/actions';

//Models
import { PlaylistDTO } from 'src/app/Shared/models/playlist.dto';

@Component({
  selector: 'app-side-panel-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SidePanelSearchBoxComponent {
  constructor(private store: Store<AppState>) {}

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

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.store.dispatch(LibraryActions.filterLibrary({ value: filter }));
  }
}
