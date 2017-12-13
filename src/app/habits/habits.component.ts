import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { CssManagerService } from '../services/cssmanager.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalServiceComponent } from '../services/modale.service';

export interface Item { title: string; nbup: number; nbdown: number; good: boolean; bad: boolean; note: string; start: any }
export interface ItemId extends Item { id?: string };


@Component({
  selector: 'my-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['habits.component.less']
})


export class HabitsComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<ItemId[]>;
  current: any;
  title: string;
  bsModalRef: BsModalRef;
  selectedTab: string;
  placeholder: string;
  types = ['Strong', 'Weak', 'All'];
  constructor(private afs: AngularFirestore, private ats: AuthService, private modalService: BsModalService, private cssService: CssManagerService) {
    this.selectedTab = 'All';
    this.placeholder = 'Add an habit';
    this.itemsCollection = afs.collection('users').doc(ats.userId).collection<Item>('habits');

    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ItemId;
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
    this.bsModalRef.content.good = data.good;
    this.bsModalRef.content.bad = data.bad;
    this.bsModalRef.content.state = data.nbup + data.nbdown;
    this.bsModalRef.content.type = "habit";
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result === "delete") {
        this.itemsCollection.doc(data.id).delete();
        console.log(this.itemsCollection);
      } else {
        this.itemsCollection.doc(data.id).update({ title: result.title, good: result.good, bad: result.bad, note: result.note });
      }
    })
  }

  get
  addItem(title: string) {
    if (!title.length) {
      this.placeholder = 'Must have a title';
    } else {
      const item: Item = { title: title, nbup: 0, nbdown: 0, good: false, bad: false, note: '', start: new Date() };
      this.itemsCollection.add(item);
      this.placeholder = 'Add an habit';
    }
  }

  ngOnInit(): void {
    this.current = { nbup: '', nbdown: '', title: '' };

  }
  removeHabit(item: ItemId) {
    this.itemsCollection.doc(item.id).delete();
  }
  incrNb(item: ItemId) {
    this.itemsCollection.doc(item.id).update({ nbup: item.nbup + 1 });
  }
  decrNb(item: ItemId) {
    this.itemsCollection.doc(item.id).update({ nbdown: item.nbdown - 1 });
  }
  setCurrentData(item: ItemId) {
    this.current = item;
  }
  setStyle(plus: number, less: number, darker) {
    const state = plus + less;
    return this.cssService.setStyle(state, darker);
  }
  onSelected(state: string) {
    this.selectedTab = state;
  }
  showTab(item: ItemId) {
    if (this.selectedTab === 'All') {
      return true;
    }
    else if (this.selectedTab == 'Weak') {
      if (item.nbup + item.nbdown <= 0) {
        return true;
      }
    }
    else if (this.selectedTab == 'Strong') {
      if (item.nbup + item.nbdown > 1) {
        return true;
      }
    }
  }
}
