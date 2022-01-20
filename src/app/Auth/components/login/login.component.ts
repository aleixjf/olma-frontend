//Angular
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as AuthActions from 'src/app/Auth/actions';

//Models
import { CredentialsDTO } from 'src/app/Auth/models/credentials.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  spinner!: boolean;
  loginForm: FormGroup;
  validForm!: boolean;

  email: FormControl;
  password: FormControl;
  store_token: FormControl;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    this.store.select('auth').subscribe((response) => {
      this.spinner = response.pending;
    });
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
    ]);
    this.store_token = new FormControl(false);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      store_token: this.store_token,
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.validForm = false;
      return;
    } else {
      this.validForm = true;
      const credentials: CredentialsDTO = { ...this.loginForm.value, uuid: '' };
      this.store.dispatch(AuthActions.login({ credentials }));
    }
  }
}
