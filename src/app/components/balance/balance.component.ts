import { DateControlService } from './../../services/date-control.service';
import { PointsService } from 'src/app/services/points.service';
import { BalanceService } from './../../services/balance.service';
import { MyErrorStateMatcher } from './../../models';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {


  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();


  balancePointsControl = new FormControl(null, [
    Validators.required,
    Validators.min(1),
  ]);

  rewardTitleControl = new FormControl(null, [
    Validators.required,
  ]);
  

  constructor(public balanceService: BalanceService, private points: PointsService, private dateControl: DateControlService) { 
  }

  ngOnInit() {

  }

  get isAnyError(): boolean {
    return this.balancePointsControl.hasError('required') || 
           this.balancePointsControl.hasError('min') || 
           this.rewardTitleControl.hasError('required')
  }

  charge() {
    this.balanceService.charge(this.balancePointsControl.value, this.rewardTitleControl.value)
    this.balancePointsControl.reset();
    this.rewardTitleControl.reset();
  }

  add() {
    this.balanceService.add(this.balancePointsControl.value, this.rewardTitleControl.value)
    this.points.addPointsToDate(this.dateControl.dateWhenInitialized, this.balancePointsControl.value, 'additional');
    this.balancePointsControl.reset();
    this.rewardTitleControl.reset();
  }
}
