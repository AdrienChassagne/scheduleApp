import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navtab.component.html',
  styleUrls: ['navtab.component.less']
})
export class NavtabComponent implements OnInit {
  @Input() types: any;
  @Input() tags: any;

  @Output() onSelected = new EventEmitter<any>();
  @Output() onSelectedTag = new EventEmitter<any>();

  someProperty: string;
  selecTab: any;
  selecTag: any;
  selectOption: any;
  constructor() {
    this.selecTab = 'All';
    this.selectOption = 'all';
  }
  ngOnInit() {
  }
  selectedTab(state: string) {
    if (state === this.selecTab) {
      return { 'background-color': '#3f51b5', 'color': "#fff" };
    }
  }
  public changeSelectOption() {
    this.onSelected.emit(this.selectOption);
  }
  setTab(state) {
    this.selecTab = state;
    this.onSelected.emit(state);
  }
}
