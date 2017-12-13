import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { CalendarEvent } from 'angular-calendar';
import { colors } from '../classes/ccolors';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { Injectable, Inject } from '@angular/core';
import { addDays, addHours, startOfDay } from 'date-fns';

export interface Item { title: string; start: any, color: any }
export interface ItemId extends Item { id?: string };

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<ItemId[]>;
  current: any;
  title: string;
  events: Observable<Array<CalendarEvent<{ item: Item }>>>;


  constructor(private afs: AngularFirestore, private ats: AuthService) {
    this.itemsCollection = afs.collection('users').doc(ats.userId).collection<Item>('todo');
    this.events = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const date = data.start;
        const title = data.title;
        const done = data.done;
        const state = data.state;
        let color: any = null;
        if (state === 1) {
          color = colors.green;
        } else if (state === -1) {
          color = colors.orange;
        } else if (state === -9) {
          color = colors.red;
        }
        else {
          color = colors.yellow;
        }
        return { title: title, start: date, color: color };
      });
    });
  }

  viewDate: Date = new Date();


  ngOnInit(): void {

  }
}
