//Angular
import { formatDate } from '@angular/common';
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
//Services
import { UserService } from '../../services/user.service';
import { emailAsyncValidator } from '../../validators/email-async.directive';
//Validators
import { passwordValidator } from '../../validators/password.directive';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
})
export class UserEditorComponent {
  spinner!: boolean;
  user!: UserDTO;

  userForm: FormGroup;
  editMode = false;
  validForm!: boolean;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;
  password_confirmation: FormControl = new FormControl('');

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.store.select('user').subscribe((response: UserState) => {
      this.spinner = response.pending;
      if (response.user) {
        this.user = response.user;
        this.editMode = true;
      }
    });

    this.name = new FormControl(this.user?.name, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]);

    this.surname_1 = new FormControl(this.user?.surname_1, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]);

    this.surname_2 = new FormControl(this.user?.surname_2, [
      Validators.minLength(2),
      Validators.maxLength(30),
    ]);

    this.birth_date = new FormControl(
      formatDate(
        this.user?.birth_date
          ? this.user.birth_date
          : new Date().setFullYear(new Date().getFullYear() - 18),
        'yyyy-MM-dd',
        'en',
      ),
      [Validators.required],
    );

    this.email = new FormControl(this.user?.email, {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],
      asyncValidators: emailAsyncValidator(this.userService, this.user?.email),
    });

    if (!this.editMode) {
      this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(
          /^(?=.*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž])(?=.*[A-ZÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])(?=.*\d)(?=.*[@$!%*?&.,-])[A-Za-z\dàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-@$!%*?&]{8,}$/,
        ),
        passwordValidator('password_confirmation', true),
      ]);

      this.password_confirmation = new FormControl('', [
        Validators.required,
        passwordValidator('password'),
      ]);

      this.userForm = this.formBuilder.group({
        name: this.name,
        surname_1: this.surname_1,
        surname_2: this.surname_2,
        birth_date: this.birth_date,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      });
    } else {
      this.password = new FormControl('', [
        Validators.required,
        // INFO: Comment in order to not provide additional information to not provide extra clues about the password.
        Validators.minLength(8),
        Validators.maxLength(64),
        //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      ]);

      this.userForm = this.formBuilder.group({
        name: this.name,
        surname_1: this.surname_1,
        surname_2: this.surname_2,
        birth_date: this.birth_date,
        email: this.email,
        password: this.password,
      });
    }
  }

  save(): void {
    let user = this.userForm.value;
    const uuid = this.user?.uuid;
    user = new UserDTO(
      user.name,
      user.surname_1,
      user.surname_2,
      user.birth_date,
      user.email,
      user.password,
    );
    user = { ...user, uuid: uuid };

    if (this.editMode)
      this.store.dispatch(UserActions.updateInformation({ user }));
    else this.store.dispatch(UserActions.registerUser({ user }));
  }

  cancel(): void {
    this.router.navigateByUrl('/profile');
  }
}
