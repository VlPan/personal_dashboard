import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FocusEntry, MyErrorStateMatcher } from 'src/app/models';


@Component({
  selector: 'app-add-habit-points',
  templateUrl: './add-habit-points.component.html',
styleUrls: ['./add-habit-points.component.scss']
})
export class AddHabitPointsDialog { 

  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  habitPointsControl = new FormControl(null, [
    Validators.required,
    Validators.min(1),
  ]);

  
  constructor(
    public currentDialog: MatDialogRef<AddHabitPointsDialog>,
    public dialog: MatDialog,
  ) {}


  done() {
    this.currentDialog.close(this.habitPointsControl.value);
  }

  get isAnyError(): boolean {
    return this.habitPointsControl.hasError('required') || 
           this.habitPointsControl.hasError('min')
  }

}
