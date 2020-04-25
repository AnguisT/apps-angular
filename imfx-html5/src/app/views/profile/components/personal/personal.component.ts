import {
  ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ServerStorageService } from '../../../../services/storage/server.storage.service';
import { ProfileService } from '../../../../services/profile/profile.service';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Component({
    selector: 'profile-settings-personal',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [
      ProfileService
    ]
})

export class ProfilePersonalSettingsComponent implements OnInit {

    @ViewChild('loggerSettingsWrapper') private loggerSettingsWrapper;
    private data;
    private personalData = {
      Mute: false
    };
    private personalDataPrev = {
      Mute: false
    };
    private ready = false;

    constructor(private cdr: ChangeDetectorRef,
                private storageService: ServerStorageService,
                private profileService: ProfileService) {
    };

    ngOnInit() {
        this.initPersonalSetting();
    }

    initPersonalSetting() {
        let self = this;
        this.storageService.retrieve(['personal_settings'], true).subscribe((res) => {
          if (res[0].Value.length > 0) {
            self.personalData = JSON.parse(res[0].Value);
            self.personalDataPrev = JSON.parse(res[0].Value);
            self.ready = true;
              self.cdr.detectChanges();
          }
        });
    }

    SavePersonal() {
        if(!this.ready)
            return;
      let self = this;
      setTimeout(() => {
        this.personalData.Mute = !this.personalData.Mute;
        this.storageService.store('personal_settings', this.personalData).subscribe((res) => {
          self.profileService.SetPersonal(self.personalData);
            self.cdr.detectChanges();
        });
      }, 0);
    }
}
