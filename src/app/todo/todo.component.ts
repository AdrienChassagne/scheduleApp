import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { CssManagerService } from '../services/cssmanager.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalServiceComponent } from '../services/modale.service';


export interface Item { title: string; note: string; start: any; done: boolean; soon: number; state: number }
export interface ItemId extends Item { id?: string };


@Component({
  selector: 'my-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['todo.component.less']
})


export class TodoComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<ItemId[]>;
  current: any;
  title: string;
  selectedTab: string;
  bsModalRef: BsModalRef;
  total: number;
  placeholder: string;
  types = ['Done', 'Due', 'All'];
  constructor(private afs: AngularFirestore, private ats: AuthService, private modalService: BsModalService, private cssService: CssManagerService) {
    this.total = 0;
    this.placeholder = 'Add a todo';
    this.selectedTab = 'All';
    this.itemsCollection = afs.collection('users').doc(ats.userId).collection<Item>('todo');
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
    this.bsModalRef.content.start = data.start;
    this.bsModalRef.content.done = data.done;
    this.bsModalRef.content.soon = data.soon;
    this.bsModalRef.content.state = data.state;
    this.bsModalRef.content.type = "todo";
    this.bsModalRef.content.onClose.subscribe(result => {

      if (result === "delete") {
        this.itemsCollection.doc(data.id).delete();
      } else {
        this.itemsCollection.doc(data.id).update({ title: result.title, note: result.note, start: result.start, soon: result.soon, state: result.state });
      }
    })
  }
  addItem(title: string) {
    if (!title.length) {
      this.placeholder = 'Must have a title';
    } else {
      const date: any = new Date();
      const item: Item = { title: title, note: '', start: date, done: false, soon: -1, state: -1 };
      this.itemsCollection.add(item);
      this.placeholder = 'Add a todo';
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
  updateDone(item: ItemId) {
    if (item.done === true) {
      item.soon === 0;
    }
    this.itemsCollection.doc(item.id).update({ done: item.done, soon: item.soon });
  }
  setState(item: ItemId) {
    const state = this.cssService.setState(item.done, item.soon);
    this.itemsCollection.doc(item.id).update({ state: state });
  }

  setStyle(state, darker) {
    return this.cssService.setStyle(state, darker);
  }
  onSelected(state: string) {
    this.selectedTab = state;
  }
  showTab(item: ItemId) {
    if (this.selectedTab === 'All') {
      return true;
    }
    else if (this.selectedTab === 'Done') {
      if (item.done === true) {
        return true;
      }
    }
    else if (this.selectedTab === 'Due') {
      if (item.done === false) {
        return true;
      }
    }
  }
}
