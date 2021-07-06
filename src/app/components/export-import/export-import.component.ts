import { LocalStorage } from './../../services/local-storage.service';
import { Validators, FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from './../../models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export-import',
  templateUrl: './export-import.component.html',
  styleUrls: ['./export-import.component.scss']
})
export class ExportImportComponent implements OnInit {

  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  jsonDataControl = new FormControl(null, [
    Validators.required,
    Validators.min(1),
  ]);


  constructor(private ls: LocalStorage) { }

  ngOnInit() {
  }

  importDataToLS() {
    this.ls.import(this.jsonDataControl.value)
  }

  exportDataFromLS() {
    this.ls.export();
  }

}
