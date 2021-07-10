import { BalanceComponent } from './components/balance/balance.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TodayPreviewComponent } from './components/today-preview/today-preview.component';
import { AddPointsComponent } from './components/add-points/add-points.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { AddFocusPointsDialog } from './components/add-points/add-focus-points-dialog/add-focus-points-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddHabitPointsDialog } from './components/add-points/add-habit-points-dialog/add-habit-points-dialog';
import { AddAdditionalPointsDialog } from './components/add-points/add-additional-points-dialog/add-additional-points-dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { HistoryComponent } from './components/history/history.component';
import { ExportImportComponent } from './components/export-import/export-import.component';
import { CurrentFocusComponent } from './components/current-focus/current-focus.component';
import { AddObjectiveDialogComponent } from './components/current-focus/add-objective-dialog/add-objective-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    TodayPreviewComponent,
    AddPointsComponent,
    AddFocusPointsDialog,
    AddHabitPointsDialog,
    AddAdditionalPointsDialog,
    HistoryComponent,
    BalanceComponent,
    ExportImportComponent,
    CurrentFocusComponent,
    AddObjectiveDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTooltipModule,
    MatSliderModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
