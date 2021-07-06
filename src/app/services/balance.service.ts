import { RoundHelper } from './../helpers/roundHelper';
import { LocalStorage } from './local-storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {

  public balanceChanged$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly BALANCE_KEY = 'my_balance';
  private readonly BALANCE_HISTORY = 'my_balance_history';
  constructor(private ls: LocalStorage) {
    this.balanceChanged$.next(RoundHelper.twoDecimals(this.balance));
  }

  add(reward: number, title: string) {
    const balance = this.balance;
    const history = this.history;

    const newBalance = balance + reward;
    const historyEntryId: string = uuidv4();

    const entry: BalanceHistory = {
      id: historyEntryId,
      type: 'plus',
      amount: reward,
      title
    }

    history[historyEntryId] = entry;

    this.ls.set(this.BALANCE_KEY, newBalance);
    this.ls.set(this.BALANCE_HISTORY, history);

    this.balanceChanged$.next(RoundHelper.twoDecimals(newBalance));
  }

  charge(amount: number, title: string) {
    const balance = this.balance;
    const history = this.history;
    
    const newBalance = balance - amount;
    const historyEntryId: string = uuidv4();

    const entry: BalanceHistory = {
      id: historyEntryId,
      type: 'minus',
      amount,
      title
    }

    history[historyEntryId] = entry;

    this.ls.set(this.BALANCE_KEY, newBalance);
    this.ls.set(this.BALANCE_HISTORY, history);

    this.balanceChanged$.next(RoundHelper.twoDecimals(newBalance));
  }

  get balance(): number {
    const balance = this.ls.get(this.BALANCE_KEY);
    if(balance == null) {
      this.ls.set(this.BALANCE_KEY, 0);
    }
    return this.ls.get(this.BALANCE_KEY);
  }

  get history(): BalanceHistoryMap {
    const history = this.ls.get(this.BALANCE_HISTORY);
    if(history == null) {
      this.ls.set(this.BALANCE_HISTORY, {});
    }
    return this.ls.get(this.BALANCE_HISTORY);
  }
}


export interface BalanceHistory {
  id: string;
  type: 'minus' | 'plus';
  amount: number;
  title: string;
}

export interface BalanceHistoryMap {
  [id: string]: BalanceHistory
}

