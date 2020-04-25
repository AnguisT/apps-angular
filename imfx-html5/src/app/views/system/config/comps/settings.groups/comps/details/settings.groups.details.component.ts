import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { GridOptions } from 'ag-grid';
import {
    SettingsGroupsService
} from '../../../../../../../services/system.config/settings.groups.service';
import { SettingsGroupParams } from './settings.group.params';
import {
    NotificationService
} from '../../../../../../../modules/notification/services/notification.service';
import {
    SimplifiedDetailSettingsComponent
} from '../../../../../../../modules/settings/simplified/detail/simplified.detail.settings.component';
import { SearchTypes } from '../../../../../../../services/system.config/search.types';
import { StartSearchComponent } from '../../../../../../start/start.search.component';
import {
    StartSearchFormComponent
} from '../../../../../../start/components/search/start.search.form.component';
import { Backgrounds } from '../../../../../../../services/system.config/backgrounds';
import { Icons } from '../../../../../../../services/system.config/icons';
import { TransferdSimplifedType } from '../../../../../../../modules/settings/simplified/types';
import {
    SimplifiedSettingsTransferProvider
} from '../../../../../../../modules/settings/simplified/simplified.settings.transfer.provider';
import {
    SettingsGroupsDetailsSearchScreenComponent
} from './comps/search.screen/settings.groups.details.search.screen.component';

@Component({
    selector: 'settings-groups-detail',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    entryComponents: [StartSearchFormComponent],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // SettingsGroupsService
    ]
})

export class SettingsGroupsDetailsComponent implements OnInit {
    @ViewChild('simplifiedDetailSettingsComponent') private simplifiedDetailSettingsComponent: SimplifiedDetailSettingsComponent;

    private settingsGroup;
    private settingsGroupName: string;
    private settingsGroupDescription: string;

    private loading: boolean = false;

    private simplifiedItemConfig = {};
    private simplifiedDetailConfig = {};
    private availableFacets = [];
    private availableSearchFields = [];

    private searchTypes = SearchTypes;
    private searchTypesKeys;
    private defaultSearch;
    private startSearchData;
    private itemSettingsData;
    private detailsSettingsData;

    private logoImages;

    private configDefault = {
      defaultSearch: <any>null,
      logoImages: <any>null,
      searchTypes: <any>null,
      searchTypesKeys: <any>null
    };

    private context = this;
    private startSearchSettings: EventEmitter<any> = new EventEmitter<any>();
    private simplifiedItemSettings: EventEmitter<any> = new EventEmitter<any>();
    private simplifiedDetailsSettings: EventEmitter<any> = new EventEmitter<any>();

    private facets: {
        key: string;
        enabled: boolean;
    }[] = [];
    private searchFields: {
        key: string;
        enabled: boolean;
    }[] = [];

    @Output() private back: EventEmitter<any> = new EventEmitter<any>();

    constructor(private cdr: ChangeDetectorRef,
                private settingsGroupsService: SettingsGroupsService,
                private notificationRef: NotificationService,
                private transfer: SimplifiedSettingsTransferProvider) {
        this.searchTypesKeys = Object.keys(this.searchTypes);

        this.logoImages = Object.keys(Icons).map(k => {
          return {
            id: k,
            url: Icons[k],
            select: false
          };
        });
        this.logoImages.filter(el => el.id === 'NOLOGO')[0].select = true;
    };

    ngOnInit() {
      this.configDefault.logoImages = this.logoImages;
      this.configDefault.searchTypes = this.searchTypes;
      this.configDefault.searchTypesKeys = this.searchTypesKeys;
    }

    searchByFieldItemChanged() {
        this.transfer.updated.emit(<TransferdSimplifedType>{
            setupType: 'search_by_fileds',
            groupId: this.settingsGroup.ID,
            setups: this.availableSearchFields
        });
    }

    facetItemChanged() {
        this.transfer.updated.emit(<TransferdSimplifedType>{
            setupType: 'facets',
            groupId: this.settingsGroup.ID,
            setups: this.availableSearchFields
        });
    }

    setSettingsGroup(settingsGroup) {
        this.settingsGroup = settingsGroup;
        this.settingsGroupName = this.settingsGroup.NAME;
        this.settingsGroupDescription = this.settingsGroup.DESCRIPTION;
        let simplifiedSettings = this.getSetting('simplified');
        if (simplifiedSettings && simplifiedSettings.DATA) {
            let data: SettingsGroupParams = <SettingsGroupParams>JSON
            .parse(simplifiedSettings.DATA);
            this.availableFacets = data.AvailableFacets;
            this.availableSearchFields = data.AvailableSearchFields;
            // preheat setups for simplified
            let itemSimple = {
              data: data.SimplifiedItemLayout,
              id: settingsGroup.ID
            };
            this.simplifiedItemSettings.emit(itemSimple);
            let detailSimple = {
              data: data.SimplifiedDetailLayout,
              id: settingsGroup.ID
            };
            this.simplifiedDetailsSettings.emit(detailSimple);
        }

        let defaultSearchSettings = this.getSetting('defaultSearch');
        if (defaultSearchSettings && defaultSearchSettings.DATA) {
            let data = JSON.parse(defaultSearchSettings.DATA);
            this.configDefault.defaultSearch = data.DefaultSearch;
            this.defaultSearch = data.DefaultSearch;
        }

        let startSettings = this.getSetting('startSearch');
        this.startSearchSettings.emit(startSettings);

        let logoImageSettings = this.getSetting('logoImage');
        if (logoImageSettings && logoImageSettings.DATA) {
            let logoData = JSON.parse(logoImageSettings.DATA);
            this.logoImages.forEach(function (el, ind) {
                if (el.id === logoData.LogoImage) {
                    el.select = true;
                } else {
                    el.select = false;
                }
            });
        }
        this.cdr.detectChanges();

        this.settingsGroupsService.getSearchFields().subscribe(res => {
            this.searchFields = res.map(el => ({
                key: el,
                enabled: this.availableSearchFields.indexOf(el) > -1
            }));
            this.cdr.detectChanges();
        });
        this.settingsGroupsService.getFacets().subscribe(res => {
            this.facets = res.map(el => ({
                key: el,
                enabled: this.availableFacets.indexOf(el) > -1
            }));
            this.cdr.detectChanges();
        });


    }

    // TODO: change to ngmodel
    defaultSearchChange(s) {
        this.defaultSearch = s;
    }

    goBack() {
        this.back.emit();
    }

    saveSettings($event) {
        // /*debugger*/
    }

    private getSetting(key) {
        if (this.settingsGroup.TM_SETTINGS_KEYS) {
            return this.settingsGroup.TM_SETTINGS_KEYS.filter(el => el.KEY === key)[0];
        }
    }

    private getOrAddSettings(key) {
        this.settingsGroup.TM_SETTINGS_KEYS = this.settingsGroup.TM_SETTINGS_KEYS || [];
        let found = this.settingsGroup.TM_SETTINGS_KEYS.filter(el => el.KEY === key)[0];
        if (!found) {
            let setting = {
                // 'ID': 0,
                // 'GROUP_ID': 0,
                'KEY': key,
                'VALUE': null,
                'DATA': null
            };
            this.settingsGroup.TM_SETTINGS_KEYS.push(setting);
            return setting;
        }
        return found;
    }

    private saveSettingsGroup() {
        if (!this.settingsGroupName){
            this.notificationRef.notifyShow(2, 'settings_group.empty_name_error');
            return;
        }

        this.settingsGroup.NAME = this.settingsGroupName;
        this.settingsGroup.DESCRIPTION = this.settingsGroupDescription;
        let simplifiedSettings = this.getOrAddSettings('simplified');
        simplifiedSettings.DATA = JSON.stringify(<SettingsGroupParams> {
            AvailableFacets: this.facets.filter(el => el.enabled).map(el => el.key),
            AvailableSearchFields: this.searchFields.filter(el => el.enabled).map(el => el.key),
            SimplifiedItemLayout: this.itemSettingsData.simplifiedItemSettingsComponent.getSettings(),
            SimplifiedDetailLayout: this.detailsSettingsData.simplifiedDetailSettingsComponent.getSettings(),
        });
        let defaultSearchSettings = this.getOrAddSettings('defaultSearch');
        defaultSearchSettings.DATA = JSON.stringify({
            DefaultSearch: this.defaultSearch
        });
        let startSearchSetting = this.getOrAddSettings('startSearch');
        let data = this.startSearchData.startSearchForm.getCustomizedParams();
        startSearchSetting.DATA = JSON.stringify({
            Title: data.title,
            Subtitle: data.subtitle,
            Background: data.selectedBackground,
            Logo: data.selectedSearchLogo
        });
        let logoImage = this.logoImages.filter(function (el) {
            return el.select === true;
        });
        if (logoImage.length) {
            let logoImageSettings = this.getOrAddSettings('logoImage');
            logoImageSettings.DATA = JSON.stringify({
                LogoImage: logoImage[0].id
            });
        }
        this.settingsGroup.EntityKey = null;
        this.settingsGroup.TM_SETTINGS_KEYS = this.settingsGroup.TM_SETTINGS_KEYS.map(el => {
            el.EntityKey = null;
            el.TM_SETTINGS_GROUPS = null;
            el.TM_SETTINGS_GROUPSReference = null;
            return el;
        });

        this.loading = true;

        this.settingsGroupsService.saveSettingsGroup(this.settingsGroup).subscribe(res => {
            this.settingsGroup.ID = res.ID;
            this.loading = false;
            this.notificationRef.notifyShow(1, 'settings_group.save_success');
            logoImage[0] && this.settingsGroupsService.logoChanged.emit(logoImage[0].id);
            // this.goBack();
        });


    }

}
