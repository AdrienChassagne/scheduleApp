import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { CalendarComponent } from './calendar/calendar.component';

import { AuthService } from './services/auth.service';
import { CssManagerService } from './services/cssmanager.service';
import { ModalServiceComponent } from './services/modale.service';
import { AppComponent } from './app.component';
import { HabitsComponent } from './habits/habits.component';
import { TodoComponent } from './todo/todo.component';
import { ReminderComponent } from './reminder/reminder.component';
import { NavtabComponent } from './navtab/navtab.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    HabitsComponent,
    TodoComponent,
    ReminderComponent,
    ModalServiceComponent,
    CalendarComponent,
    NavtabComponent

  ],
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    ModalModule,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    BsDatepickerModule.forRoot()

  ],
  entryComponents: [ModalServiceComponent],

  providers: [
    AuthService,
    CssManagerService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
