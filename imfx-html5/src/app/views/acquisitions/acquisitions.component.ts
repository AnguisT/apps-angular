import {
    ChangeDetectorRef,
    Component, ElementRef, EventEmitter, HostListener, Injector, ViewChild, ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ViewsProvider } from '../../modules/search/views/providers/views.provider';
import {AcquisitionService} from './services/acquisition.service';
import {appRouter} from '../../constants/appRouter';
import { OverlayComponent } from '../../modules/overlay/overlay';

@Component({
    selector: 'acquisitions',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
      AcquisitionService
    ]
})

export class AcquisitionsComponent {

    @ViewChild('tableHeader', {read: ElementRef}) tableHeader:ElementRef;
    @ViewChild('tableBody', {read: ElementRef}) tableBody:ElementRef;
    @ViewChild('overlayWrapper') overlayWrapper: any;
    @ViewChild('overlay') overlay: OverlayComponent;

    private searchValue = '';
    private data = [];

    constructor(protected viewsProvider: ViewsProvider,
                protected service: AcquisitionService,
                protected router: Router,
                protected cdr: ChangeDetectorRef,
                protected injector: Injector) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
      setTimeout(()=>{
        this.resizeHandler();
      },0);
    }

    searchFakeData(e) {
      if(e && e.keyCode == 13 && this.searchValue.trim().length > 0) {
        this.doSearch();
      }
      else if(!e && this.searchValue.trim().length > 0) {
        this.doSearch();
      }
    }

    doSearch() {
      this.overlay.show(this.overlayWrapper.nativeElement);
      // $(this.overlayWrapper.nativeElement).show();
      let self = this;
      this.service.getData(this.searchValue.trim()).subscribe((data) => {
        if (data && data.Data && data.Data.length > 0) {
            self.data = data.Data;
        } else {
            self.data = [];
        }
        self.cdr.detectChanges();
        setTimeout(() => {
          self.resizeHandler();
          self.overlay.hide(self.overlayWrapper.nativeElement);
          // $(self.overlayWrapper.nativeElement).hide();
        }, 0);
      });
    }

    goToWorkspace(id) {
      this.router.navigate([
        appRouter.acquisitions.workspace.replace('/:id', ''),
        id
      ]);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.resizeHandler();
    }

    resizeHandler() {
      if(this.tableHeader != undefined && this.tableBody != undefined) {
        //setTimeout(()=>{
        let headers = $(this.tableHeader.nativeElement).find('th');
        let rows = $(this.tableBody.nativeElement).find('.fake-rows');
        for(var i = 0; i < rows.length; i++) {
          rows[i].style.width = this.tableHeader.nativeElement.offsetWidth + 'px';
          let columns = $(rows[i]).find('.fake-cell');
          for(var j = 0; j < headers.length; j++) {
            columns[j].style.width = headers[j].offsetWidth + 'px';
          }
        }
        //},0);
          this.cdr.detectChanges();
      }
    }
}
