import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() title : string = '';
  @Input() message : string = '';
  @Input() type : 'error' | 'success' | 'info' = 'info';
  @Input() autoDissmiss : boolean = false;
  @Input() closable : boolean = false;
  @Input() dissmissTimer : number = 4000;
  @Input() confirmation : boolean = false;
  @Output() confirm = new EventEmitter<void>;

  visisble = true;
  flying_out : boolean = false;

  onConfirm () {
    this.confirm.emit();
  }

  ngOnInit () {
    if (this.autoDissmiss) {
      setTimeout (()=> {
        this.flying_out = true;
        setTimeout (() => {
          this.visisble = false;
        }, 5000);
      }, this.dissmissTimer)
    }
  }

  close () {
    this.flying_out = true;
    setTimeout (() => {
      this.visisble = false;
    }, 5000);
  }

}
