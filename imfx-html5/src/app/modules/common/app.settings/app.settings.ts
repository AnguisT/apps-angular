/**
 * Created by Sergey Trizna on 08.03.2017.
 */
import {Injectable} from '@angular/core';
import {AppSettingsInterface} from './app.settings.interface';

/**
 * App constants
 */
@Injectable()
export class AppSettings implements AppSettingsInterface {
    mediaSubtypes = {};
    subtypes = {};
    tabsType = {};
    mediaIcons = {};

    contributorThumb = './assets/img/contributor.jpg';

    constructor(){
    }

    getSubtype(id): number {
        return this.subtypes[id];
    }
    getSubtypes(): any {
        return this.subtypes;
    }

    getTabName(id): any {
        return this.tabsType[id];
    }
    getMediaIcon(id): string|0 {
        if( !this.mediaIcons[id] ){
            return 0;
        }
        else {
            return "./assets/imfx-icons/" +this.mediaIcons[id];
        }
    }
    getContributorThumb(): string {
        return this.contributorThumb;
    }
    checkTabExist (id){
        for (var e in this.tabsType){
            if (this.tabsType[e]==id){
                return true;
            }
        }
        return false;
    };
    getTabs(): any{
        return this.tabsType;
    };
    getMediaSubtypes(): any {
        return this.mediaSubtypes;
    }
}
