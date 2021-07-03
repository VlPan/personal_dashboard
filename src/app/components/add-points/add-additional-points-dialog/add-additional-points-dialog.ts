import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FocusEntry, MyErrorStateMatcher } from 'src/app/models';


@Component({
  selector: 'app-add-additional-points',
  templateUrl: './add-additional-points.component.html',
  styleUrls: ['./add-additional-points.component.scss']
})
export class AddAdditionalPointsDialog { 

  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  additionalPointsControl = new FormControl(null, [
    Validators.required,
    Validators.min(1),
  ]);

  
  constructor(
    public currentDialog: MatDialogRef<AddAdditionalPointsDialog>,
    public dialog: MatDialog,
  ) {}


  done() {
    this.currentDialog.close(this.additionalPointsControl.value);
  }

  get isAnyError(): boolean {
    return this.additionalPointsControl.hasError('required') || 
           this.additionalPointsControl.hasError('min')
  }

}
