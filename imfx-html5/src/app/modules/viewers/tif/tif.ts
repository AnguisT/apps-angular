import {Component, ViewEncapsulation, ViewChild, Input, ChangeDetectorRef} from '@angular/core';
import {HttpService} from "../../../services/http/http.service";
import {ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";

// import {Tiff} from 'tiff.js';
// const TiffConst = require('tiff.js/tiff.js');

@Component({
    selector: 'tif-viewer',
    templateUrl: "tpl/index.html",
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})

export class TIFViewerComponent {
    @Input('config') private config: any = {
        url: ''
    }
    // @ViewChild('target') private target;
    // tiff: any;

    constructor() {
      // this.tiff = TiffConst;
    }


    ngOnInit() {
      // var componentRef = this;
      // var xhr = new XMLHttpRequest();
      // xhr.responseType = 'arraybuffer';
      // xhr.open('GET', this.config.url);
      // xhr.onload = function (e) {
      //   var tiff = new componentRef.tiff({buffer: xhr.response});
      //   var canvas = tiff.toCanvas();
      //   componentRef.target.nativeElement.append(canvas);
      // };
      // xhr.send();
    }

}
