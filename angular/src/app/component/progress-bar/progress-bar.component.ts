import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

  @Input('progress') progress: number;
  @Input('total') total: number;
  @Input('height') height: string;

  constructor() {
    this.progress = 0;
    this.total = 100;
    this.height = '3px';
  }

}
