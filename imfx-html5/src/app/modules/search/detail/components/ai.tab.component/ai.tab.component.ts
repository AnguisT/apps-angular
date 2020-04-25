import {
  Component, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef, ViewChild,
  ElementRef, Injectable, Injector
} from '@angular/core';
import * as $ from 'jquery';
import {AiTabType} from "./models/ai.models";
import {AiTabService} from "./services/ai.service";
import {GridOptions} from "ag-grid";
import {IMFXHtmlPlayerComponent} from "../../../../controls/html.player/imfx.html.player";
@Component({
    selector: 'ai-tab',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
      AiTabService
    ],
    entryComponents: []

})
@Injectable()
export class IMFXAiTabComponent {

    public setMarkers: EventEmitter<any> = new EventEmitter<any>();
    config: any;
    private activeTab: AiTabType = AiTabType.Speech;
    private activeData = [];
    private activeDataFiltered = [];
    private speechData: any = [];
    private peopleData: any = [];
    private logosData: any = [];
    private ocrData: any = [];
    private adultData: any = [];
    private tagsData: any = [];
    private notesFilter = "";
    @ViewChild('tabsHeader', {read: ElementRef}) tabsHeader:ElementRef;
    @ViewChild('tableHeader', {read: ElementRef}) tableHeader:ElementRef;
    @ViewChild('tableBody', {read: ElementRef}) tableBody:ElementRef;
    constructor(protected cdr: ChangeDetectorRef,
                protected injector: Injector,
                protected aiService: AiTabService) {
    };

    ngOnInit() {
      this.aiService.getAiData(this.config.file.ID).subscribe((res)=>{
        this.speechData = res["SpeechToText"];
        this.peopleData = res["People"];
        this.logosData = res["Logos"];
        this.ocrData = res["Ocr"];
        this.adultData = res["Adult"];
        this.tagsData = res["AiTags"];
        this.activeData = this.speechData;
        this.activeDataFiltered = this.activeData;
      });
    };

    filterNotes() {
      this.activeDataFiltered = this.activeData.filter(d => d.Notes.toLowerCase().indexOf(this.notesFilter.toLowerCase()) > -1);
    }

    ngAfterViewChecked() {
      // if(this.tableHeader != undefined && this.tableBody != undefined) {
      //   //setTimeout(()=>{
      //     let headers = $(this.tableHeader.nativeElement).find('th');
      //     let rows = $(this.tableBody.nativeElement).find('.fake-rows');
      //     for(var i = 0; i < rows.length; i++) {
      //       rows[i].style.width = this.tableHeader.nativeElement.offsetWidth + "px";
      //       let columns = $(rows[i]).find('.fake-cell');
      //       for(var j = 0; j < headers.length; j++) {
      //         columns[j].style.width = headers[j].offsetWidth + "px";
      //       }
      //     }
      //   //},0);
      // }
      if(this.tabsHeader != undefined) {
        let text = $(this.tabsHeader.nativeElement).find('span');
        setTimeout(()=>{
          if(this.tabsHeader.nativeElement.offsetWidth < 989 && $(text).is(":visible")) {
            $(text).hide();
          }
          else if(this.tabsHeader.nativeElement.offsetWidth >= 989 && !($(text).is(":visible"))) {
            $(text).show();
          }
        },0);
      }
    }

    activateTab(tab: AiTabType, data) {
      this.activeTab = tab;
      this.activeData = data;
      this.activeDataFiltered = this.activeData;
      this.notesFilter = "";
    }

    setPlayerTime(item) {
      this.config.elem.emit('setTimecode', item);
    }
}
