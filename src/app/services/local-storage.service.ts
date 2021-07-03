import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  constructor() {}
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  set(key: string, entity: any) {
    localStorage.setItem(key, JSON.stringify(entity));
  }

  static HISTORY_ENTRIES_KEY = 'history_entries';
  static FOCUS_ENTRIES_KEY = 'focus_entries';
}
