/*
OneDrive documentation:
https://docs.microsoft.com/es-es/onedrive/developer/?view=odsp-graph-online
https://developer.microsoft.com/en-us/graph/graph-explorer?request=me%2Fdrive%2Froot%2Fchildren&method=GET&version=v1.0
*/

//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OneDriveFilesService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient, private router: Router) {
    this.controller = 'v1';
    this.backendAPI = 'https://api.onedrive.com/' + this.controller;
  }
}
