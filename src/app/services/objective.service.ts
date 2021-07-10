import { DateHelper } from './../helpers/dateHelper';
import { BalanceService } from './balance.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorage } from './local-storage.service';
import { PointsService } from './points.service';
import { DateControlService } from './date-control.service';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService {
  public objectives: ObjectiveEntry;
  public uncompletedObjectives: Objective[] = [];

  public objectivesChanged$: Subject<Objective[]> = new Subject();

  public hightLightObjectives: Objective[] = []

  constructor(public ls: LocalStorage, public balance: BalanceService, private points: PointsService, private dateControl: DateControlService) {
    this.objectives = this.getObjectives();
    this.uncompletedObjectives = this.getUncompletedObjectives();

    this.hightLightObjectives = this.getHighlighted();
  }

  getObjectives(): ObjectiveEntry {
    return this.ls.get(LocalStorage.OBJECTIVES_KEY) || {};
  }

  getUncompletedObjectives(): Objective[] {
    return Object.values(this.objectives).filter((o: Objective) => o.completed !== true);
  }

  saveObjectives(): void {
    this.ls.set(LocalStorage.OBJECTIVES_KEY, this.objectives);

    this.objectivesChanged$.next(this.getUncompletedObjectives());
  }

  updateObjective(objective: Objective): void {
    this.objectives[objective.id] = objective;
    this.saveObjectives();
  } 

  completeObjective(objective: Objective): void {
    objective.completed = true;
    this.objectives[objective.id] = objective;
    this.saveObjectives();

    this.balance.add(objective.reward, `The Goal Completed: ${objective.title}`)
    this.points.addPointsToDate(this.dateControl.dateWhenInitialized, objective.reward, 'additional');
  } 

  deleteObjective(objective: Objective): void {
    delete this.objectives[objective.id]
    this.saveObjectives();
  } 

  toggleHightLightObjectiveForToday(objective: Objective) {
    const isExist: boolean = this.hightLightObjectives.some(h => h.id === objective.id);
    const noneSelected: boolean = this.hightLightObjectives.length === 0;
    if(isExist) {
      this.hightLightObjectives = this.hightLightObjectives.filter(h => objective.id !== h.id);
    } else {
      if(noneSelected) {
        this.hightLightObjectives.push(objective);
      }
    }

    this.saveHighlighted();
  }

  saveHighlighted() {
    const dateStr = DateHelper.generateDateString(this.dateControl.dateWhenInitialized);

    const all = this.ls.get(LocalStorage.FOCUSED_AREAS) || {};
    all[dateStr] = this.hightLightObjectives;
    this.ls.set(LocalStorage.FOCUSED_AREAS, all);
  }

  getHighlighted(): Objective[] {
    const dateStr = DateHelper.generateDateString(this.dateControl.dateWhenInitialized);
    const all = this.ls.get(LocalStorage.FOCUSED_AREAS) || {};
    return all[dateStr] || [];
  }

}

export interface Objective {
  id: string;
  title: string;
  reward: number;
  progress: number;
  completed: boolean;
}

export interface ObjectiveEntry {
  [key: string]: Objective;
}
