import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";

@Component({
    selector: 'preview-files-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
      'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PreviewFilesFormatterComp {
    private params;
    private previewType: PreviewType = PreviewType.None;
    public injectedData: SlickGridFormatterData;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.params.url = this.params.data.Url;
        if(this.params.data.Filename.toLowerCase().includes(".pdf")) {
          this.previewType = PreviewType.Pdf;
        }
        else if(this.params.data.Filename.toLowerCase().includes(".png") ||
                this.params.data.Filename.toLowerCase().includes(".bmp") ||
                this.params.data.Filename.toLowerCase().includes(".jpeg") ||
                this.params.data.Filename.toLowerCase().includes(".jpg")) {
          this.previewType = PreviewType.Image;
        }
        this.params.onlyButton = true;
    }

    checkType(type) {
      if(type == 'pdf' && this.previewType == PreviewType.Pdf) {
        return true;
      }
      else if(type == 'img' && this.previewType == PreviewType.Image) {
        return true;
      }
      return false;
    }
}

export function PreviewFilesFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    let ctxs = columnDef.__contexts;

    return commonFormatter(PreviewFilesFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}

export enum PreviewType {
  None,
  Image,
  Pdf
}



