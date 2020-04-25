import {
    Component,
    ViewEncapsulation,
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-icons-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
// WHAT
export class IconsColumnComponent implements AgRendererComponent {
    private params:any;
    private url_media_icon:string;
    private url_hdSd_icon:string;
    private fileExt:string;
    
    private playable = false;
    
    private isHD = false;
    private isSD = false;
    private isVideo = false;
    private isPdf = false;
    private isAudio = false;
    private isXml = false;
    private isExcel = false;
    private isWord = false;
    private isSubtitles = false;
    private isImage = false;

    // called on init
    agInit(params:any):void {
        this.params = params;
        if(this.params.data && this.params.data["FileExtension"] && this.params.data["FileExtension"].length > 0) {
            this.fileExt = this.params.data["FileExtension"].toUpperCase();
        }
        
        if(this.params.data && this.params.data["PROXY_URL"] && this.params.data["PROXY_URL"].length > 0 && this.params.data["PROXY_URL"].match(/^(http|https):\/\//g) && this.params.data["PROXY_URL"].match(/^(http|https):\/\//g).length > 0) {
          this.playable = true;
        }
        var uA = window.navigator.userAgent,
        isIE = /msie\s|trident\/|edge\//i.test(uA);
        if(this.params.data && this.params.data["MEDIA_FORMAT_text"] == "WEBM" && isIE)  {
          this.playable = false;
        }
        
        if(this.params.data && this.params.data["MediaTypeOriginal"] == 100)
        {
            this.isVideo = true;
        }
        else if(this.params.data && this.params.data["MediaTypeOriginal"] == 150) {
            this.isAudio = true;
        }
        else if(this.params.data && (this.params.data["MediaTypeOriginal"] == 120 || this.params.data["MediaTypeOriginal"] == 200)) {
          this.isImage = true;
        }
        else if(this.params.data && this.params.data["MediaTypeOriginal"] == 101) {
          this.isSubtitles = true;
        }
        else if(this.params.data && (this.params.data["MediaTypeOriginal"] == 3 ||
                this.params.data["MediaTypeOriginal"] == 210 ||
                this.params.data["MediaTypeOriginal"] == 220 ||
                this.params.data["MediaTypeOriginal"] == 230)) {
            switch(this.fileExt) {
              case "XLS" || "XLSX":
                this.isExcel = true;
                break;
              case "DOC" || "DOCX":
                this.isWord = true;
                break;
              case "XML":
                this.isXml = true;
                break;
              case "PDF":
                this.isPdf = true;
                break;
              default:
                break;
            }
        }
        //subtitles
        // if(this.params.data._hdSd_icon_not_formated == 12) {
        //   this.isSD = true;
        // }
        // else if(
        //   this.params.data._hdSd_icon_not_formated == 4 ||
        //   this.params.data._hdSd_icon_not_formated == 5 ||
        //   this.params.data._hdSd_icon_not_formated == 6)
        // {
        //   this.isHD = true;
        // }
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
    }
}

