//Angular
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from './app.reducers';
import * as AuthActions from 'src/app/Auth/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'olma';
  authenticated!: boolean;
  admin!: boolean;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private store: Store<AppState>,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.store.select('auth').subscribe((response) => {
      this.authenticated = response.authenticated;
      this.admin = response.admin;
    });

    this.mobileQuery = media.matchMedia('(max-width: 600px)'); //Get value from settings --> $phoneWidth
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
