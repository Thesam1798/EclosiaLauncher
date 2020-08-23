import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @ViewChild("circleLoader") circleLoader: ElementRef | undefined;
  @ViewChild("checkmark") checkmark: ElementRef | undefined;

  @Input('end') end: EventEmitter<boolean> | undefined;

  constructor() {
  }

  ngOnInit(): void {

    if (this.end === undefined || this.end === null) return;

    this.end.asObservable().subscribe(data => {
      if ((data === undefined || data === null) && (this.end !== undefined && this.end !== null)) {
        this.end.emit(false);
      }
    })

    this.end.subscribe((value: boolean) => {
      if (this.circleLoader !== undefined && this.checkmark !== undefined) {
        if (value) {
          this.circleLoader.nativeElement.className = "circle-loader complete";
          this.checkmark.nativeElement.style.display = 'block';
        } else {
          this.circleLoader.nativeElement.className = "circle-loader";
          this.checkmark.nativeElement.style.display = 'none';
        }
      }
    });
  }


}
