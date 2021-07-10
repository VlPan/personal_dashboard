import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import {
  Objective,
  ObjectiveEntry,
  ObjectiveService,
} from 'src/app/services/objective.service';
import { AddObjectiveDialogComponent } from './add-objective-dialog/add-objective-dialog.component';

import { v4 as uuidv4 } from 'uuid';
import { Color, interpolate } from 'src/app/helpers/colorHelper';

@Component({
  selector: 'app-current-focus',
  templateUrl: './current-focus.component.html',
  styleUrls: ['./current-focus.component.scss'],
})
export class CurrentFocusComponent {
  objectives: Objective[] = [];

  selectedObjectiveToUpdate: Objective | null = null;

  red = new Color(232, 9, 26);
  yellow = new Color(235, 225, 52);
  green = new Color(6, 170, 60);

  start = this.red;
  end = this.yellow;

  formatLabel(value: number) {
    return value  + '%';
  }

  constructor(
    public objectiveService: ObjectiveService,
    public dialog: MatDialog
  ) {
    this.objectives =
      this.objectiveService.getUncompletedObjectives()

    this.objectiveService.objectivesChanged$.subscribe(
      (newObjectives: Objective[]) => {
        this.objectives = newObjectives;
      }
    );
  }

  addObjective() {
    const dialogRef = this.dialog.open(AddObjectiveDialogComponent);

    const subscriber = dialogRef
      .afterClosed()
      .subscribe(({ objectiveName, reward }) => {
        if (objectiveName && reward) {
          const newObjective: Objective = {
            id: uuidv4(),
            title: objectiveName,
            progress: 0,
            completed: false,
            reward: reward,
          };
          this.objectiveService.updateObjective(newObjective);
        }

        subscriber.unsubscribe();
      });
  }

  updateObjective(objective: Objective) {
    this.selectedObjectiveToUpdate = objective;
    const dialogRef = this.dialog.open(AddObjectiveDialogComponent, {
      data: {
        objective,
      },
    });

    const subscriber = dialogRef
      .afterClosed()
      .subscribe(({ objectiveName, reward }) => {
        if (objectiveName && reward && this.selectedObjectiveToUpdate) {
          this.selectedObjectiveToUpdate.title = objectiveName;
          this.selectedObjectiveToUpdate.reward = reward;
          this.objectiveService.updateObjective(this.selectedObjectiveToUpdate);
        }
        this.selectedObjectiveToUpdate = null;
        subscriber.unsubscribe();
      });
  }

  updateObjectiveProgress(progress: number | null, objective: Objective) {
    this.selectedObjectiveToUpdate = objective;
    this.selectedObjectiveToUpdate.progress = progress as number;

    this.objectiveService.updateObjective(this.selectedObjectiveToUpdate);

    this.selectedObjectiveToUpdate = null;
  }

  deleteObjective(objective: Objective) {
    this.objectiveService.deleteObjective(objective);
  }

  completeObjective(objective: Objective) {
    this.objectiveService.completeObjective(objective);
  }

  ifOverflow(e: any) {
    return e.scrollWidth > e.clientWidth;
  }

  calculateObjectiveColor(progress: number): string {
    let val = progress;
    if (progress > 50) {
      this.start = this.yellow,
          this.end = this.green;
      val = val % 51;
    } else {
      this.start = this.red,
      this.end = this.yellow;
    }

    let startColors = this.start.getColors(),
      endColors = this.end.getColors();
    let r = interpolate(startColors.r, endColors.r, 50, val);
    let g = interpolate(startColors.g, endColors.g, 50, val);
    let b = interpolate(startColors.b, endColors.b, 50, val);

    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}
