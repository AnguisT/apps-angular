import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter, ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { SessionStorageService, LocalStorageService } from 'ng2-webstorage';
import { PermissionService } from '../../../../services/permission/permission.service';
import { ConfigService } from '../../../../services/config/config.service';
import { ProfileService } from '../../../../services/profile/profile.service';

@Component({
    selector: 'profile-defaultpage',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class ProfileDefaultPageComponent {
    @ViewChild('selectDefaultPage') private dropdownModule;
    private defaultPage: string;
    private allowedPages = [];
    @Output() private changedDefaultPage: EventEmitter<any> = new EventEmitter<any>();

    private defaultPageSubscription;

    constructor (private storageService: LocalStorageService,
                 private cdr: ChangeDetectorRef,
                 private profileService: ProfileService) {
      let compRef = this;
      this.defaultPageSubscription = this.profileService.defaultPage.subscribe(page => {
        this.defaultPage = page;
        this.cdr.detectChanges();
        this.selectPage();
        compRef.defaultPageSubscription.unsubscribe();
      });
      this.profileService.retrieveDefaultPage();
    }

    ngOnInit() {
      let _allowedPages = PermissionService.getPermissionsMap()[0].paths;
      for (let i = 0; i < _allowedPages.length; i++) {
        if (_allowedPages[i].indexOf(':id') === -1) {
          this.allowedPages.push(_allowedPages[i]);
        }
      }
    }

    ngAfterViewInit() {
        this.selectPage();
    }

    selectPage() {
        let data = this.dropdownModule.turnArrayToStandart(this.allowedPages);
        this.dropdownModule.setData(data, true);
        this.setSelectedPage();
    }

    setSelectedPage() {
        let index = this.allowedPages.indexOf(this.defaultPage);
        this.dropdownModule.setSelectedByIds([index]);
    }

    onSelectPage(event) {
        this.defaultPage = event.params.data.text;
        this.changedDefaultPage.emit(this.defaultPage);
    }
}

