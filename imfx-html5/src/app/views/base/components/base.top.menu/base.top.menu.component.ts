/**
 * Created by initr on 28.11.2016.
 */
import {
  Component, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy,
  ChangeDetectorRef, HostListener, ElementRef
} from '@angular/core';
import { SecurityService } from '../../../../services/security/security.service';
import { SessionStorageService, LocalStorageService } from 'ng2-webstorage';
import { Router } from '@angular/router';
import { UploadProvider } from '../../../../modules/upload/providers/upload.provider';
import { SimplifiedSearchComponent } from '../../../simplified/simplified.search.component';
import { SearchTypes } from '../../../../services/system.config/search.types';
import { SettingsGroupsService } from '../../../../services/system.config/settings.groups.service';
import {
  RaiseWorkflowWizzardProvider
} from '../../../../modules/rw.wizard/providers/rw.wizard.provider';
import {UploadComponent} from "../../../../modules/upload/upload";
import {IMFXModalComponent} from "../../../../modules/imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../../../../modules/imfx-modal/proivders/provider";
@Component({
    selector: 'base-top-menu',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BaseTopMenuComponent {
    @Output() toSearchPage: EventEmitter<any> = new EventEmitter<any>();
    @Output() toClick: EventEmitter<any> = new EventEmitter<any>();

    private defaultSearch;

    private activeItem = {m: false, w: false, a: false, s: false };
    private staticSearchType: string = SearchTypes.SIMPLIFIED;
    private simplifiedSearchComponentStoragePrefix = null;

    constructor(private securityService: SecurityService,
                private sessionStorage: SessionStorageService,
                private cdr: ChangeDetectorRef,
                private elementRef: ElementRef,
                private routerInstance: Router,
                private localStorage: LocalStorageService,
                private uploadProvider: UploadProvider,
                private rwwizardprovider: RaiseWorkflowWizzardProvider,
                private sgs: SettingsGroupsService,
                private modalProvider: IMFXModalProvider
    ) {
        this.simplifiedSearchComponentStoragePrefix = this.sessionStorage.retrieve(SimplifiedSearchComponent.storagePrefix);
    }

    public ngDoCheck(): void {
      this.cdr.detectChanges();
    }

    menuActive(bIsActive, target) {
      if (bIsActive !== null && bIsActive !== undefined) {
        this.activeItem[target] = bIsActive;
      }
      return true;
    }

    ngOnInit() {
      this.sgs.getSettingsUserById('defaultSearch').subscribe((setups) => {
        if (setups && setups[0] && setups[0].DATA) {
          this.defaultSearch = JSON.parse(setups[0].DATA).DefaultSearch;
        }
      });
    }

    toClickEvent($event) {
      this.toClick.emit();
    }

    hasPermission (path) {
        return true;
      // return this.securityService.hasPermissionByPath(path)
    }
    hasPermissions (paths) {
        return true;
      // let has = false;
      // for (var p of paths) {
      //   has =  has || this.securityService.hasPermissionByPath(p);
      // }
      // return has
    }

    clearStorages() {
        this.sessionStorage.clear();
        this.localStorage.clear();
    }

    callMediaUpload($events) {
        let modal: IMFXModalComponent= this.modalProvider.show(UploadComponent, {
            title: 'base.media_upload',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
    }

    // callRwWizard($events) {callMediaUpload
    //   let itemId = 65068;
    //   this.rwwizardprovider.open(itemId);
    //   return false;
    // }

    private simplifiedAvailable() {
      // if simple is not default search - it is the only way to get there
      if (SearchTypes[this.defaultSearch] !== SearchTypes.SIMPLIFIED
          && !!this.simplifiedSearchComponentStoragePrefix) {
        return true;
      }
    }
    // private shouldSetStaticSearch() {
    //   //if it is the only way to reach simple search
    //   // and it is empty yet
    //   if ((SearchTypes[this.defaultSearch] == SearchTypes.SIMPLIFIED)
    //       && (!this.sessionStorage.retrieve(SimplifiedSearchComponent.storagePrefix))) {
    //     return true
    //   }
    //   return false;
    // }

    // @HostListener(':mousedown', ['$event']) onMousedown(event) {
    //   let dropdown = $('.main-menu .submenu');
    //   let target = $(dropdown[0]).has(event.target).length;
    //   if (target === 0) {
    //
    //   }
    // }
}
