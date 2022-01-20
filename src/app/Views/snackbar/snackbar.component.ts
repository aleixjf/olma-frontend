//Angular
import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
//NgRX - States
import { AuthState } from 'src/app/Auth/models/auth.state';
import { OAuthState } from 'src/app/OAuth/models/oauth.state';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  config: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    //panelClass: ['snackbar-notification'],
    duration: 3000, //in ms
  };

  constructor(private snackBar: MatSnackBar, private store: Store<AppState>) {
    this.store.select('auth').subscribe((response: AuthState) => {
      if (response.error) this.snackbarNotification(response.error.message);
    });
    this.store.select('oauth').subscribe((response: OAuthState) => {
      if (response.error) this.snackbarNotification(response.error.message);
    });
  }

  snackbarNotification(
    message: string,
    action?: string,
    config?: MatSnackBarConfig,
  ) {
    this.snackBar.open(
      message,
      action ? action : 'Dismiss',
      config
        ? config
        : { ...this.config, panelClass: ['snackbar-notification'] },
    );
  }

  snackbarError(message: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(
      message,
      action ? action : 'Dismiss',
      config ? config : { ...this.config, panelClass: ['snackbar-error'] },
    );
  }
}
