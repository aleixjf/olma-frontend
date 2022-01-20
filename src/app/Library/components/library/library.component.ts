//Angular
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
//NgRX - Actions
import * as LibraryActions from 'src/app/Library/actions';

//Models
import * as AuthState from 'src/app/Auth/models/auth.state';
import * as LibraryState from 'src/app/Library/models/library.state';

//Services
import { LibraryService } from 'src/app/Library/services/library.service';

//External dependencies
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  showSyncButton!: boolean;
  showCloudButtons!: boolean;
  showExportButtons!: boolean;
  node!: string;
  smartlist!: boolean;
  libraryActive!: boolean;

  /* Sidenav resizsing */
  resizeStyle: any = {
    'min-width': '100px',
    'max-width': '50%',
  };
  resizeMobile: any = {
    'min-width': '100px',
    width: '80%',
    'max-width': '80%',
  };
  onResize(event: ResizeEvent): void {
    this.resizeStyle = {
      ...this.resizeStyle,
      width: `${event.rectangle.width}px`,
      //height: `${event.rectangle.width}px`
    };
  }

  constructor(
    private store: Store<AppState>,
    private libraryService: LibraryService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)'); //Get value from settings --> $phoneWidth
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      this.showCloudButtons =
        response.credentials?.tokens?.dropbox ||
        response.credentials?.tokens?.onedrive
          ? true
          : false;
      this.showSyncButton = response.credentials?.tokens?.spotify
        ? true
        : false;
    });
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        this.node = response.active?.name ? response.active.name : 'Library';
        if (response.collection) this.showExportButtons = true;
        else this.showExportButtons = false;
        if (response.active?.rules) this.smartlist = true;
        else this.smartlist = false;
        if (!response.active?.ids && response.active) this.libraryActive = true;
        else this.libraryActive = false;
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.store.dispatch(LibraryActions.filterPlaylist({ value: filter }));
  }

  selectLibrary(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const library = input.files[0];

    this.store.dispatch(LibraryActions.parseLocalLibrary({ library }));
  }

  exportTraktorLibrary() {
    this.libraryService.exportTraktorLibrary();
  }

  match() {
    if (this.libraryActive) this.store.dispatch(LibraryActions.matchLibrary());
    else this.store.dispatch(LibraryActions.matchPlaylist());
  }
}
