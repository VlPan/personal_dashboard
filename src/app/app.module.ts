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
import { AddFocusPointsDialog } from './components/add-points/add-focus-points-dialog/add-focus-points-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddHabitPointsDialog } from './components/add-points/add-habit-points-dialog/add-habit-points-dialog';
import { AddAdditionalPointsDialog } from './components/add-points/add-additional-points-dialog/add-additional-points-dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { HistoryComponent } from './components/history/history.component';
import { ExportImportComponent } from './components/export-import/export-import.component';

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
    ExportImportComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
