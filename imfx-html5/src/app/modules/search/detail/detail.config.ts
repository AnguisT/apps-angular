/**
 * Created by Sergey Klimenko on 10.03.2017.
 */
import {EventEmitter} from '@angular/core'
import {DetailServiceInterface} from './services/detail.service';
import {DetailProviderInterface} from './providers/detail.provider';
import {DetailComponent} from "./detail";

export class DetailSettings {
    /**
    * Service for working moduke
    */
    service?: DetailServiceInterface;

    /**
    * Provider for working with module
    */
    provider?: DetailProviderInterface;

    appSettings?: any;

    needApi?: boolean;

    detailsviewType?: string;

    detailsViews?: any[];

    typeDetails?: string;

    friendlyNamesForDetail?: any;

    detailData?: any;

    lookupService?: any;

    data?: {
        detailInfo?: any;
        accordions?: any;
    }

    showInDetailPage?: boolean;

    showAccordions?: boolean;

    onDataUpdated?: EventEmitter<any>;

    detailCtx?: any;

    _accordions?: Array<any>;
    tabsData?: Array<any>;
    file?: any;
    userFriendlyNames?: any;
    mediaParams?: {
        addPlayer: boolean,
        addMedia: boolean,
        addImage: boolean,
        showAllProperties: boolean,
        isSmoothStreaming: boolean,
        mediaType: string
    };
    typeDetailsLocal?:string;
    providerDetailData?: any;
    subtitles?: Array<any>;
    pacsubtitles?: Array<any>;
    timecodeFormatString?: string;
    showGolden?: boolean;
    clipBtns?: boolean;
    disabledClipBtns?: boolean;
    defaultThumb?: string;
    externalSearchTextForMark?: string;
    isOpenDetailPanel?: boolean;
}

export class DetailConfig {
    /**
    * Context of top component
    */
    public componentContext: any;

    public moduleContext?: any;

    public layoutConfig?: any;

    /**
    * Model of settings
    * @type {{}}
    */
    public options: DetailSettings = {};
}

export class GoldenSettings {
    file?: Object;
    jobFile?: Object;
    groups?: any[];
    jobGroups?: any[];
    friendlyNames?: Object;
    jobFriendlyNames?: Object;
    typeDetailsLocal?: string;
    typeDetails?: string;
    tabs?: any[];
    params?: any;
    layoutConfig?: any;
    series?: any;
    titleForStorage?: string;
}
export class GoldenConfig {
    /**
    * Context of top component
    */
    public componentContext: any;
    /**
    * settings obj
    */
    public appSettings: any;

    public moduleContext: any;

    /**
    * Model of settings
    * @type {{}}
    */
    public options: GoldenSettings = {};
}
