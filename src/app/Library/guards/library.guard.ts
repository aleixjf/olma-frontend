//Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

//RxJS
import { Observable } from 'rxjs';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryState from 'src/app/Library/models/library.state';

//Models
import { TraktorLibrary } from 'src/app/Library/models/library';

@Injectable({
  providedIn: 'root',
})
export class LibraryGuard implements CanActivate {
  private library!: TraktorLibrary;

  constructor(private store: Store<AppState>, private router: Router) {
    //this.library = this.localStorageService.get('access_token');
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        if (response.collection) this.library = response.collection;
      });
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.library) return true;
    else {
      this.router.navigate(['/library']);
      return false;
    }
  }
}
