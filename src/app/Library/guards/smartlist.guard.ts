//Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

//RxJS
import { Observable } from 'rxjs';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryState from 'src/app/Library/models/library.state';

@Injectable({
  providedIn: 'root',
})
export class SmartlistGuard implements CanActivate {
  private playlist: any; //PlaylistDTO;

  constructor(private store: Store<AppState>, private router: Router) {
    //this.library = this.localStorageService.get('access_token');
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        if (response.active) this.playlist = response.active;
      });
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.playlist.rules) return true;
    else return false;
  }
}
