import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { Injectable, Inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalServiceComponent } from '../services/modale.service';

export interface Item { title: string; note: string; myTags: any }
export interface ItemId extends Item { id?: string };
export interface Tags {
  status: boolean;
  title: string;
}

@Component({
  selector: 'my-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['reminder.component.less']
})

export class ReminderComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<ItemId[]>;
  current: any;
  title: string;
  showHide: any;
  bsModalRef: BsModalRef;
  selectedTab: any;
  placeholder: string;
  types = ['All'];
  public myTags: Tags[] = [
    { status: false, title: 'miscellaneous' },
    { status: false, title: 'work' },
    { status: false, title: 'school' },
    { status: false, title: 'sports' },
    { status: false, title: 'health' },
    { status: false, title: 'households' },
    { status: false, title: 'friends' },
    { status: false, title: 'family' }
  ];
  public tagArr: any = [{ status: true, title: 'all' }];

  constructor(private afs: AngularFirestore, private ats: AuthService, private modalService: BsModalService) {
    this.selectedTab = 'All';
    this.showHide = [];
    this.placeholder = 'Add a reminder';
    this.tagArr = this.tagArr.concat(this.myTags);
    this.itemsCollection = afs.collection('users').doc(ats.userId).collection<Item>('reminder');
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        let data = a.payload.doc.data() as ItemId;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }
  public openModalWithComponent() {
    let data = this.current;
    this.bsModalRef = this.modalService.show(ModalServiceComponent);
    this.bsModalRef.content.title = data.title;
    this.bsModalRef.content.note = data.note;
    this.bsModalRef.content.type = "reminder";
    this.bsModalRef.content.tags = data.myTags;
    this.bsModalRef.content.onClose.subscribe(result => {

      if (result === "delete") {
        this.itemsCollection.doc(data.id).delete();
      } else {
        this.itemsCollection.doc(data.id).update({ title: result.title, note: result.note, myTags: result.tags });
      }
    })
  }
  onSelected(state: any) {
    this.selectedTab = state;
  }
  showTab(item: ItemId) {
    if (this.selectedTab === 'All' || this.selectedTab === 'all') {
      return true;
    } else {
      for (var i = 0; i < item.myTags.length; i++) {
        if (item.myTags[i].status === true) {
          if (item.myTags[i].title === this.selectedTab) {
            return true;
          }
        }
      }
    }
  }
  showHiddenTag(item) {
    this.showHide = !this.showHide;
  }
  showTag(tag) {
    if (tag.status === true) {
      return true
    } else {
      return false;
    }
  }
  addItem(title: string) {
    if (!title.length) {
      this.placeholder = 'Must have a title';
    } else {
      const date: any = new Date();
      const item: Item = { title: title, note: '', myTags: this.myTags };
      this.itemsCollection.add(item);
      this.placeholder = 'Add a reminder';
    }
  }
  ngOnInit(): void {
    this.current = { title: '' };
  }
  removeHabit(item: ItemId) {
    this.itemsCollection.doc(item.id).delete();
  }
  setCurrentData(item: ItemId) {
    this.current = item;
  }
}
