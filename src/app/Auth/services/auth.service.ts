//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//RxJS
import { Observable } from 'rxjs';

//Models
import { UserDTO } from 'src/app/User/models/user.dto';
import { CredentialsDTO } from '../models/credentials.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.backendAPI = `/api/${this.controller}`;
  }

  login(credentials: CredentialsDTO): Observable<any> {
    return this.http.post<any>(this.backendAPI, credentials);
  }

  refresh(credentials: CredentialsDTO): Observable<any> {
    return this.http.post<any>(this.backendAPI, credentials);
  }

  profile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.backendAPI + '/profile');
  }
}
