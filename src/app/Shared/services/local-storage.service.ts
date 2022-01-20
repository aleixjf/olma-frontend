import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: string | object) {
    if (typeof value === 'object')
      localStorage.setItem(key, JSON.stringify(value));
    else localStorage.setItem(key, value);
  }

  get(key: string) {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    else return null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
