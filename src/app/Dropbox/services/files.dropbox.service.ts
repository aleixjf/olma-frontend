/*
Dropbox documentation:
https://www.dropbox.com/developers/documentation/http/documentation
https://www.dropbox.com/developers/reference/developer-guide
*/

//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//Other dependencies
import { Dropbox } from 'dropbox';

@Injectable({
  providedIn: 'root',
})
export class DropboxFilesService {
  private backendAPI: string;
  private controller: string;
  private jwt!: string;
  private dropbox: Dropbox;

  constructor(private http: HttpClient, private router: Router) {
    this.controller = 'v1';
    this.backendAPI = 'https://api.dropbox.com/' + this.controller;
    this.jwt = 'test';
    this.dropbox = new Dropbox({ accessToken: this.jwt });
  }

  uploadFiles(files: File[], path: string): void {
    if (Array.isArray(files) && files.length > 1) {
      let file: any;
      for (file in files) {
        this.uploadFile(file, path);
      }
    } else if (Array.isArray(files) && files.length == 1) {
      const file = files[0];
      this.uploadFile(file, path);
    }
  }

  uploadFile(file: File, path: string) {
    this.dropbox
      .filesUpload({
        path: path + path.endsWith('/') ? '' : '/' + file.name,
        contents: file,
      })
      .then(function (response) {
        const results = document.getElementById('results');
        if (results) {
          results.appendChild(document.createTextNode('File uploaded: '));
          results.appendChild(
            document.createTextNode(JSON.stringify(response)),
          );
          console.log(response);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
