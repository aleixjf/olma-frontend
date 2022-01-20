//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//RxJS
import { Observable } from 'rxjs';
//Models
import { UserDTO } from 'src/app/User/models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth/profile';
    this.backendAPI = `/api/${this.controller}`;
  }

  profile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.backendAPI);
  }

  updateInformation(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(this.backendAPI, user);
  }

  updatePassword(user: UserDTO, password: string): Observable<UserDTO> {
    const body = {
      old_password: user.password,
      new_password: password,
    };
    return this.http.put<UserDTO>(`${this.backendAPI}/password`, body);
  }
}
