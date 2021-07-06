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

  export() {
    copyTextToClipboard(JSON.stringify(localStorage));
  }

  import(text: string) {
    try {
      const data = JSON.parse(text);
      Object.keys(data).forEach(function (k) {
        localStorage.setItem(k, data[k]);
      });
    } catch(e) {
      console.error('can not export!', e);
    }
  }

  static HISTORY_ENTRIES_KEY = 'history_entries';
  static FOCUS_ENTRIES_KEY = 'focus_entries';
}


function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}