import { FocusEntry } from './../../models';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFocusPointsDialog } from './add-focus-points-dialog/add-focus-points-dialog';
import { PointsService } from 'src/app/services/points.service';
import { AddHabitPointsDialog } from './add-habit-points-dialog/add-habit-points-dialog';
import { AddAdditionalPointsDialog } from './add-additional-points-dialog/add-additional-points-dialog';
import { FormControl } from '@angular/forms';
import { DateControlService } from 'src/app/services/date-control.service';

@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.scss']
})
export class AddPointsComponent implements OnInit {

  date: FormControl;
  constructor(private dialog: MatDialog, private pointsService: PointsService, private dateControl: DateControlService, private cd: ChangeDetectorRef) { 
    this.date = new FormControl(dateControl.today);
  }

  ngOnInit() {
    // this.dateControl.isNextDay$.subscribe(() => {
    //   this.date = new FormControl(this.dateControl.today);
    //   this.cd.detectChanges();
    // })
  }


  openAddFocusPointsDialog() {
    const dialogRef = this.dialog.open(AddFocusPointsDialog, {
      data: {
        date: this.date.value
      }
    });

    const subscriber = dialogRef.afterClosed().subscribe((focusEntries: Map<string, FocusEntry>) => {   
      if(focusEntries) {
        const totalPoints = Array.from(focusEntries.values()).reduce((a, b) => a + b.result, 0);
        this.pointsService.addPointsToDate(this.date.value, totalPoints, 'focus');
        this.pointsService.saveFocusEntities(Array.from(focusEntries.values()), this.date.value);
      }   

      subscriber.unsubscribe();
    });
  }

  openAddHabitPointsDialog() {
    const dialogRef = this.dialog.open(AddHabitPointsDialog);

    const subscriber = dialogRef.afterClosed().subscribe((pointsToAdd: number) => {      
      if(pointsToAdd) {
        this.pointsService.addPointsToDate(this.date.value,pointsToAdd, 'habits');
      }

      subscriber.unsubscribe();
    });
  }

  openAddAdditionalPointsDialog() {
    const dialogRef = this.dialog.open(AddAdditionalPointsDialog);

    const subscriber = dialogRef.afterClosed().subscribe((pointsToAdd: number) => {      
      if(pointsToAdd) {
        this.pointsService.addPointsToDate(this.date.value,pointsToAdd, 'additional');
      }

      subscriber.unsubscribe();
    });
  }
}