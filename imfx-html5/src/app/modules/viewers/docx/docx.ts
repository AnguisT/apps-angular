/**
 * Created by Sergey Trizna on 16.05.2017.
 */
import { Component, ViewEncapsulation, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { ResponseContentType, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'docx-viewer',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // PDFViewerProvider
    ]
})

export class DOCXViewerComponent {
    @Input('config') private config: any = {
        url: ''
    };
    @ViewChild('target') private compRef;
    @ViewChild('docx') private docx;
    private mammoth;
    private innerHTML: string = '';
    private error: boolean = true;
    private height;
    private text;

    constructor(private httpService: HttpService,
                private cd: ChangeDetectorRef,
                private translate: TranslateService) {
        this.mammoth = require('mammoth');
    }

    ngOnInit() {
        let self = this;
        let $iframe = $(self.docx.nativeElement).find('iframe')[0];
        $iframe.onload = function() {
            $($(self.docx.nativeElement)
            .find('iframe')[0]['contentWindow']).resize(function () {
                if (self.error) {
                    self.height = $(self.docx.nativeElement).find('iframe').height() + 'px';
                    self.cd.detectChanges();
                }
            });
        };
    }

    ngAfterViewInit() {
        let self = this;
        this.getFileByURL(this.config.url).subscribe((ab: ArrayBuffer) => {
            self.convertToHtml(ab).subscribe((result: any) => {
                self.innerHTML = result.value;
                self.error = false;
                self.cd.markForCheck();
            });
        }, (error) => {
            if (error.status === 500) {
                // ошибка сервера
                this.text = this.translate.instant('details_item.server_not_work');
            } else if (error.status === 400 || error.status === 404) {
                // элемент не найден
                this.text = this.translate.instant('details_item.document_not_found');
            } else if (error.status === 0) {
                // сети нет
                this.text = this.translate.instant('details_item.check_network');
            }
            self.height = $(self.docx.nativeElement).find('iframe').height() + 'px';
            console.log(error);
        });
    }

    getMammoth() {
        return this.mammoth;
    }

    convertToHtml(arrayBuffer: ArrayBuffer) {
        return Observable.create((observer) => {
            this.getMammoth().convertToHtml({arrayBuffer: arrayBuffer})
                .then((result) => {
                    observer.next(result);
                })
                .done();
        });
    }


    getFileByURL(url) {
        return Observable.create((observer) => {
            if ((<any>window).FileReader && (<any>window).File
            && (<any>window).FileList && (<any>window).Blob) {
                this.httpService._http.get(url, {responseType: ResponseContentType.Blob})
                    .map((response) => {
                        return (<Response>response).blob();
                    })
                    .catch((error: any) => {
                        return Observable.throw(error);
                    })
                    .subscribe(
                        (blob: Blob) => {
                            let reader = new FileReader();
                            reader.onload = (e) => {
                                observer.next(reader.result);
                            };

                            reader.readAsArrayBuffer(blob);
                        }, (error) => {
                            observer.error(error);
                        }
                    );

            } else {
                throw new Error('FileReader is not supported');
            }
        });
    }
}
