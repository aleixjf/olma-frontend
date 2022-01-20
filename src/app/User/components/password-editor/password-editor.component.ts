//Angular
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
//NgRX - Actions
import * as UserActions from 'src/app/User/actions';
import { UserDTO } from 'src/app/User/models/user.dto';
//Models
import { UserState } from 'src/app/User/models/user.state';
//Validators
import { passwordValidator } from '../../validators/password.directive';

@Component({
  selector: 'app-password-editor',
  templateUrl: './password-editor.component.html',
  styleUrls: ['./password-editor.component.scss'],
})
export class PasswordEditorComponent {
  spinner!: boolean;
  user!: UserDTO;

  userForm: FormGroup;
  editMode = false;
  validForm!: boolean;

  password: FormControl;
  new_password: FormControl;
  new_confirmation: FormControl;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.store.select('user').subscribe((response: UserState) => {
      this.spinner = response.pending;
      if (response.user) {
        this.user = response.user;
      }
    });

    this.password = new FormControl('', [
      Validators.required,
      /* INFO: No additional information to not provide extra clues about the password.
      Validators.minLength(8),
      Validators.maxLength(64),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      */
    ]);
    this.new_password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      Validators.pattern(
        /^(?=.*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž])(?=.*[A-ZÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])(?=.*\d)(?=.*[@$!%*?&.,-])[A-Za-z\dàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-@$!%*?&]{8,}$/,
      ),
      passwordValidator('new_confirmation', true),
    ]);
    this.new_confirmation = new FormControl('', [
      Validators.required,
      passwordValidator('new_password'),
    ]);

    this.userForm = this.formBuilder.group({
      password: this.password,
      new_password: this.new_password,
      new_confirmation: this.new_confirmation,
    });
  }

  save(): void {
    const password = this.userForm.value.password;
    const new_password: string = this.userForm.value.new_password;
    const user: UserDTO = { ...this.user, password };
    //const user: UserDTO = new UserDTO(this.user.name, this.user.surname_1, this.user.surname_2, this.user.birth_date, this.user.email, password);
    this.store.dispatch(
      UserActions.updatePassword({ user, password: new_password }),
    );
  }

  cancel(): void {
    this.router.navigateByUrl('/profile');
  }
}
