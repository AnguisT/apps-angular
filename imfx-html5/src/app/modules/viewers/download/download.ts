/**
 * Created by Sergey Trizna on 16.05.2017.
 */
import {Component, ViewEncapsulation, ViewChild, Input, ChangeDetectorRef} from '@angular/core';
import {HttpService} from "../../../services/http/http.service";
import {ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'download-viewer',
    templateUrl: "tpl/index.html",
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})

export class DownloadViewerComponent {
    @Input('config') private config: any = {
        url: ''
    };
    @ViewChild('target') private compRef;
    private fileName: string;

    ngAfterViewInit() {
        let arrUrl = this.config.url.split('/');
        this.config.fileName = arrUrl[arrUrl.length-1];
    }
}

