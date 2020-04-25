import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {AgRendererComponent} from "ag-grid-ng2";

@Component({
    selector: 'ag-doc-viewer-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class AgDocViewerComponent implements AgRendererComponent {
    private params: any;
    private viewerConfig: any;
    private mediaType: string;

    constructor() { }

    agInit(params: any): void {
      this.params = params;
      let fileExtension = this.params.data.ReportName.match(/\.[0-9A-Za-z]+$/g);
      switch (fileExtension && fileExtension.length > 0 && fileExtension[0].toLocaleLowerCase()) {
        case '.pdf': {
          this.mediaType = 'pdfViewer';
          this.viewerConfig = {
            url: this.params.data.Url,
            onlyButton: true
          };
          break;
        }
        case '.xml': {
          this.mediaType = 'xmlViewer';
          this.viewerConfig = {
            url: this.params.data.Url,
            language: 'xml',
            onlyButton: true,
            fullSize: false
          };
          break;
        }
        default: {
          this.mediaType = 'downloadFileViewer';
          break;
        }
      }

    }
    refresh(params: any): void {
      this.params = params;
    }
}

