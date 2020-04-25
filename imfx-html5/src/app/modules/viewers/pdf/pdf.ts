/**
 * Created by Sergey Trizna on 16.05.2017.
 */
import {ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation, HostListener} from "@angular/core";
require('pdfjs-dist/build/pdf.js');
require('pdfjs-dist/build/pdf.worker.js');
@Component({
    selector: 'pdf-viewer',
    templateUrl: "tpl/index.html",
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,

})

export class PDFViewerComponent {
    private _config: any = {
        url: '',
        renderMode: 'embedding',
        fullSize: false
    }
    @Input('config') private config;
    private isEmpty: boolean = true;

    @ViewChild('target') private compRef;
    private PDFJS;
    private PDFObject;

    constructor(private cdr: ChangeDetectorRef) {
        this.config = $.extend(true, this._config, this.config);
    }

    ngAfterViewInit() {
        this.config = $.extend(true, this._config, this.config);
        this.PDFObject = require('./libs/pdfobject.js');
        if (!this.config.url) {
            this.clear();
            return;
        }
        ;
        if (this.config.renderMode == 'canvas') {
            this.renderPDFByURLToCanvas(this.config.url);
        } else {
            this.renderPDFByURL(this.config.url, -1, this.PDFObject.supportsPDFs);
        }
    }

    renderPDFByURL(url: string, countPages: number = -1, isPDFObj: boolean = this.PDFObject.supportsPDFs) {
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isPDFObj && isFirefox) {
            this.renderPDFByURLEmbedding(url);
        } else {
            console.warn('PDFObject is not defined; Rendering to canvas');
            this.renderPDFByURLToCanvas(url, countPages);
        }
    }

    renderPDFByURLEmbedding(url: string, selector?: string) {
        this.config.renderMode = 'embedding'
        if (!selector) {
            selector = this.compRef.nativeElement;
        }

        this.show();
        this.PDFObject.embed(url, selector, {
            pdfOpenParams: {
                view: 'FitH',
                pagemode: 'none',
                toolbar: 0,
                navpanes: 1,
            },
            // PDFJS_URL: 'node_modules/pdfjs-dist/build/pdf.js'
        });
    }

    renderPDFByURLToCanvas(url: string, countPages: number = -1) {
        this.config.renderMode = 'canvas'
        let self = this;
        (<any>window).PDFJS.getDocument(url).then(function (pdf) {
            if (countPages < 0) {
                countPages = pdf.numPages
            }
            for (let i = 1; i <= countPages; i++) {
                pdf.getPage(i).then(function (page) {
                    self.renderPage(page);
                });
            }
        });
        setTimeout(() => {
            this.show();
            this.cdr.detectChanges();
        })
    }

    renderPDFFromContent(blob: Blob) {
        let URL = (<any>window).URL || (<any>window).webkitURL;
        let downloadUrl = URL.createObjectURL(blob);
        this.renderPDFByURL(downloadUrl);
    }

    toggleFullSize() {
        this.config.fullSize = !this.config.fullSize;
        let bg = $('#test-for-overlay').find('#pdf-background');
        if (bg.length === 0) {
            $('#test-for-overlay').prepend(`<div id="pdf-background" style="position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: #000;
            opacity: .5;"></div>`);
        } else {
            $(bg).remove();
        }
    }

    clear() {
        this.isEmpty = true;
        this.compRef.nativeElement.innerHTML = '';
    }

    show() {
        this.isEmpty = false;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      let x = event.keyCode;
      if (x === 27 && this.config.fullSize) {
        this.toggleFullSize();
      }
    }

    private renderPage(page) {
        let viewport = page.getViewport(1.5);
        let canvas = (<any>$('<canvas></canvas>')[0]);
        let ctx = canvas.getContext('2d');
        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        this.compRef.nativeElement.appendChild(canvas);
        page.render(renderContext);
        this.show();
    }
}
