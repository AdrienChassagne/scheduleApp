import { Component } from '@angular/core';
import { CssManagerService } from '../services/cssmanager.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'modal-service',
  templateUrl: './modale.service.html',
  styleUrls: ['modale.service.less']
})
export class ModalServiceComponent {
  public title: string;
  public good: boolean;
  public bad: boolean;
  public note: string;
  public type: string;
  public soon: number;
  public done: boolean;
  public state: number;
  public tags: any;

  start: Date = new Date();
  public onClose: Subject<any>;
  constructor(public bsModalRef: BsModalRef, private cssService: CssManagerService) { }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public onConfirm(): void {
    if (this.type === "todo") {
      let now = new Date();
      now.setHours(0, 0, 0, 0);
      this.start.setHours(0, 0, 0, 0);
      if (now.setDate(now.getDate()) === this.start.setDate(this.start.getDate())) {
        this.soon = 1;
      } else if (now.setDate(now.getDate()) > this.start.setDate(this.start.getDate())) {
        this.soon = 2;
      } else {
        this.soon = 0;
      }
      let state = this.cssService.setState(this.done, this.soon);
      this.onClose.next({ title: this.title, note: this.note, start: this.start, soon: this.soon, state: state });
      this.bsModalRef.hide();
    } else if (this.type === 'reminder') {
      this.onClose.next({ title: this.title, note: this.note, tags: this.tags });
      this.bsModalRef.hide();
    }

    else {
      this.onClose.next({ title: this.title, good: this.good, bad: this.bad, note: this.note });
      this.bsModalRef.hide();
    }
  }

  public onDelete(): void {
    this.onClose.next('delete');
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }
  setStyle(state: any, darker) {
    return this.cssService.setStyle(state, darker);
  }
  onChange(done, soon, start) {
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    if (now.setDate(now.getDate()) === start.setDate(start.getDate())) {
      soon = 1;
    } else if (now.setDate(now.getDate()) > start.setDate(start.getDate())) {
      soon = 2;
    } else {
      soon = 0;
    }
    this.state = this.cssService.setState(done, soon);
    this.cssService.setStyle(this.state, false);
  }
}
