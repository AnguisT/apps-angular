import {Component, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Component({
  selector: 'image-block',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class IMFXImageComponent {
    @Input() PROXY_URL;
    constructor() {}
}
