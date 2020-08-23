import {Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input('onCheck') onCheck: EventEmitter<boolean> | undefined;

  private checked: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  change() {
    this.checked = !this.checked

    if (this.onCheck != undefined) {
      this.onCheck.emit(this.checked)
    }
  }
}
