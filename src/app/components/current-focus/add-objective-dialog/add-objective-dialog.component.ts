import { Objective } from 'src/app/services/objective.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/models';

@Component({
  selector: 'app-add-objective-dialog',
  templateUrl: './add-objective-dialog.component.html',
  styleUrls: ['./add-objective-dialog.component.scss']
})
export class AddObjectiveDialogComponent {

  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  objectiveName = new FormControl(null, [
    Validators.required,
  ]);

  reward = new FormControl(null, [
    Validators.required,
    Validators.min(0),
  ]);

  
  constructor(
    public currentDialog: MatDialogRef<AddObjectiveDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddObjectiveDialogData,
  ) {
    
  }

  ngOnInit() {
    this.currentDialog.afterOpened().subscribe(() => {
      if(this.data.objective) {
        this.objectiveName.setValue(this.data.objective.title);
        this.reward.setValue(this.data.objective.reward);
      }
    })
  }

  done() {
    this.currentDialog.close({objectiveName: this.objectiveName.value, reward: this.reward.value});
  }

  get isAnyError(): boolean {
    return this.objectiveName.hasError('required') || 
    this.reward.hasError('required') || 
    this.reward.hasError('min') 
  }

}

export interface AddObjectiveDialogData{
  objective: Objective
}