import { PointsService } from 'src/app/services/points.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FocusEntry, MyErrorStateMatcher } from 'src/app/models';

import { v4 as uuidv4 } from 'uuid';

export interface AddFocusPointsDialogData {
  date: Date;
}

@Component({
  selector: 'app-add-focus-points',
  templateUrl: './add-focus-points.component.html',
  styleUrls: ['./add-focus-points.component.scss']
})
export class AddFocusPointsDialog { 


  focusEntries: Map<string, FocusEntry> = new Map();

  mode: AddFocusPointsViewMode = AddFocusPointsViewMode.full;

  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  essentialControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(10),
  ]);

  difficultyControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(10),
  ]);

  flowControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(10),
  ]);

  minsControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
  ]);

  focusPointsControl = new FormControl(null, [
    Validators.required,
    Validators.min(1),
  ]);
  
  constructor(
    public currentDialog: MatDialogRef<AddFocusPointsDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddFocusPointsDialogData,
    public pointsService: PointsService
  ) {}

  // @ViewChild(MatChipList) entriesList!: MatChipList;


  addFocusEntry() {
    const essential = this.essentialControl.value;
    const difficulty = this.difficultyControl.value;
    const flow = this.flowControl.value;
    const mins = this.minsControl.value;

    const result = (((essential + difficulty + flow) * mins) / 100 );

    let resultWithReward = this.pointsService.addRewardsForLongConcentration(result, mins);
    let finalResult = this.pointsService.addPointsToDate(this.data.date, resultWithReward, 'focus');

    const entry: FocusEntry = {
      id: uuidv4(),
      essential,
      difficulty,
      flow,
      mins,
      result: finalResult
    }
    this.focusEntries.set(entry.id, entry);
    this.pointsService.saveFocusEntity(entry, this.data.date);
   
    this.essentialControl.reset()
    this.difficultyControl.reset()
    this.flowControl.reset()
    this.minsControl.reset()

  }

  preventFocus(event: FocusEvent) {
    event.preventDefault();
  }

  focusEntryRemoved(id: string) {
    this.focusEntries.delete(id);
  }

  done() {
    this.currentDialog.close({focusEntries: this.focusEntries, mode: this.mode, simplifiedPoints: this.focusPointsControl.value});
  }

  get isAnyError(): boolean {
    return this.essentialControl.hasError('min') || 
           this.essentialControl.hasError('max') ||
           this.essentialControl.hasError('required') ||
           this.flowControl.hasError('min') ||
           this.flowControl.hasError('max') ||
           this.flowControl.hasError('required') ||
           this.difficultyControl.hasError('min') ||
           this.difficultyControl.hasError('max') ||
           this.difficultyControl.hasError('required') || 
           this.minsControl.hasError('required')
  }

  get isAnyErrorSimplified(): boolean {
    return this.focusPointsControl.hasError('required') || 
           this.focusPointsControl.hasError('min')
  }


  toggleMode() {
    this.focusEntries.clear();
    if(this.isFullMode) {
      this.mode = AddFocusPointsViewMode.simplified
    } else {
      this.mode = AddFocusPointsViewMode.full
    }
  }

  get isFullMode() {
    return this.mode === AddFocusPointsViewMode.full;
  }

  get isSimplifiedMode() {
    return this.mode === AddFocusPointsViewMode.simplified;
  }
}


export enum AddFocusPointsViewMode {
  full = 'full',
  simplified = 'simplified'
}