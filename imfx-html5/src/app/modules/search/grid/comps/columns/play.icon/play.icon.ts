import {
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { AgRendererComponent } from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-play-icon-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class PlayIconColumnComponent implements AgRendererComponent {
    private params: any;

    private playable = false;
    private isVideo = false;
    // called on init
    agInit(params: any): void {
        this.params = params;
        if (this.params.data && this.params.data['PROXY_URL'] && this.params.data['PROXY_URL'].length > 0 && this.params.data['PROXY_URL'].match(/^(http|https):\/\//g) && this.params.data['PROXY_URL'].match(/^(http|https):\/\//g).length > 0) {
          this.playable = true;
        }
        let uA = window.navigator.userAgent,
        isIE = /msie\s|trident\/|edge\//i.test(uA);
        if (this.params.data && this.params.data['MEDIA_FORMAT_text'] == 'WEBM' && isIE)  {
          this.playable = false;
        }

        if (this.params.data && (this.params.data['MediaTypeOriginal'] === 100 || this.params.data['MediaTypeOriginal'] === 150)) {
            this.isVideo = true;
        }
    }

    // called when the cell is refreshed
    refresh(params: any): void {
        this.params = params;
    }
    // called when icon is clicked
    iconClick() {
      if (this.params.column) {
        let model = this.params.column.gridOptionsWrapper.gridOptions.api.getModel();
        model.forEachNode(function(el){
          el.data._playing = false;
        })
        let node = model.getRow(this.params.rowIndex);
        this.params.data._playing = true;
        this.params.column.gridOptionsWrapper.gridOptions.componentContext.selectRow(node.data, this.params.rowIndex);
      }
    }
}

