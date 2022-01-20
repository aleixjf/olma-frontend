//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//RxJS
import { Observable } from 'rxjs';
import { CredentialsDTO } from 'src/app/Auth/models/credentials.dto';
//Models
import { UserDTO } from 'src/app/User/models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users';
    this.backendAPI = `/api/${this.controller}`;
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.backendAPI, user);
  }

  isEmailAlreadyUsed(email: string): Observable<boolean> {
    const body = { email };
    return this.http.post<boolean>(`${this.backendAPI}/email`, body);
  }

  getUser(user: CredentialsDTO | string): Observable<UserDTO> {
    if (typeof user === 'string')
      return this.http.get<UserDTO>(this.backendAPI + '/' + user);
    else return this.http.get<UserDTO>(this.backendAPI + '/' + user.uuid);
  }

  updateUserInformation(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(this.backendAPI + '/' + user.uuid, user);
  }

  updateUserPassword(user: UserDTO, password: string): Observable<UserDTO> {
    const body = {
      old_password: user.password,
      new_password: password,
    };
    return this.http.put<UserDTO>(
      this.backendAPI + '/' + user.uuid + '/password',
      body,
    );
  }
}
