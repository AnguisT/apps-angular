/**
 * Created by Sergey Trizna on 27.12.2017.
 */
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {Router} from "@angular/router";
import {BasketService} from "../../../services/basket/basket.service";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {SlickGridRowData} from "../../../modules/search/slick-grid/types";
import {appRouter} from "../../../constants/appRouter";
import {RaiseWorkflowWizzardProvider} from "../../../modules/rw.wizard/providers/rw.wizard.provider";
import {SilverlightProvider} from "../../../providers/common/silverlight.provider";
import {ItemTypes} from "../../../modules/controls/html.player/item.types";
import {ClipEditorService} from "../../../services/clip.editor/clip.editor.service";
import {MappingGridService} from "../../mapping/services/mapping.grid.service";
import {TranslateService} from "ng2-translate";
import {NotificationService} from "../../../modules/notification/services/notification.service";
import {MediaComponent} from "../media.component";
import {RaiseWorkflowWizzardComponent} from "../../../modules/rw.wizard/rw.wizard";
import {IMFXModalComponent} from "../../../modules/imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../../../modules/imfx-modal/proivders/provider";
import {BsModalService} from "ngx-bootstrap";

export class MediaSlickGridProvider extends SlickGridProvider {

    // public searchFormProvider?: SearchFormProvider,
    public router: Router;
    private basketService: BasketService;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.basketService = injector.get(BasketService);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
    }

    addToBasket($events) {
        let data = this.getSelectedRowData();
        if (!this.isOrdered(data)) {
            this.basketService.addToBasket(data, "Media");
        }

        // for update state for other formatters at row
        let slick = this.getSlick();
        slick.invalidateRow(this.getSelectedRowId());
        slick.render();
    }

    removeFromBasket($events) {
        let data = this.getSelectedRowData();
        if (this.isOrdered(data)) {
            this.basketService.removeFromBasket([data]);
        }
    }

    getMediaDetails($events) {
        let data = this.getSelectedRowData();
        let searchType = this.module.searchType.toLowerCase();
        if (!searchType) {
            throw new Error('let searchType is not defined!');
        }
        this.router.navigate(
            [
                appRouter[searchType].detail.substr(
                    0,
                    appRouter[searchType].detail.lastIndexOf('/')
                ),
                data.ID
            ]
        );
    }

    showRaiseWorkflowWizzard($events, rowData) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent= modalProvider.show(RaiseWorkflowWizzardComponent, {
            title: 'rwwizard.title',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });

        (<RaiseWorkflowWizzardComponent>modal.contentView.instance).rwwizardprovider.open(this.getSelectedRow(), "Media");
    }

    isOrdered(data?: SlickGridRowData): boolean {
        if (!data) {
            data = this.getSelectedRowData();
        }

        return data ? this.basketService.hasItem(data) : false;
    }

    isMediaLoggerShow() {
        return this.module.showMediaLogger;
    }

    goToMediaLogger($events) {
        let data = this.getSelectedRowData();
        let silver = this.injector.get(SilverlightProvider);
        if (silver.isSilverlightInstalled) {
            // this.router.navigate(['media-logger-silver', rowData.data.ID]);
            this.router.navigate(
                [
                    appRouter.media_logger.silver.substr(
                        0,
                        appRouter.media_logger.silver.lastIndexOf('/')
                    ),
                    data.ID
                ]
            );
        } else {
            // this.router.navigate(['media-logger', rowData.data.ID]);
            this.router.navigate(
                [
                    appRouter.media_logger.detail.substr(
                        0,
                        appRouter.media_logger.detail.lastIndexOf('/')
                    ),
                    data.ID
                ]
            );
        }
    }

    isMediaLoggerEnable() {
        let data = this.getSelectedRowData();
        if (!data) {
            return false;
        }

        let file = data;
        if (typeof(file['PROXY_URL']) == "string" && file['PROXY_URL'].match(/(?:http)|(?:https)/g) && file.IsPlayableVideo) {
            return true;
        } else {
            return false;
        }
    }

    clipEditorEnabled() {
        let data = this.getSelectedRowData();
        if (!data) {
            return false;
        }
        let playable = false;``
        if (data &&
            data["PROXY_URL"] &&
            data["PROXY_URL"].length > 0 &&
            data["PROXY_URL"].match(/^(http|https):\/\//g) &&
            data["PROXY_URL"].match(/^(http|https):\/\//g).length > 0 &&
            (data["MEDIA_TYPE"] == ItemTypes.AUDIO || data["MEDIA_TYPE"] == ItemTypes.MEDIA)) {
            playable = true;
        }
        var uA = window.navigator.userAgent,
            isIE = /msie\s|trident\/|edge\//i.test(uA);
        if (data && data["MEDIA_FORMAT_text"] == "WEBM" && isIE) {
            playable = false;
        }
        return playable;
    }

    clipEditor($events) {
        let data = this.getSelectedRowData();
        let rows: Array<any> = [data];
        let clipEditorService: ClipEditorService = this.injector.get(ClipEditorService);

        // set rows
        clipEditorService.setSelectedRows(rows);

        // set isAudio flag
        let isAudio = data.MEDIA_TYPE == ItemTypes.AUDIO ? true : false;
        clipEditorService.setIsAudio(isAudio);
        let id = data.ID;

        //   this.router.navigate(["clip-editor", id])
        this.router.navigate(
            [
                appRouter.clip_editor_media.substr(
                    0,
                    appRouter.clip_editor_media.lastIndexOf('/')
                ),
                id
            ]
        );
    }

    requestBrowseCopy() {
        console.log('requestBrowseCopy')
    }

    openInRCESL($events) {
        let data = this.getSelectedRowData();
        // this.router.navigate(['rce-silver', rowData.data.ID]);
        this.router.navigate(
            [
                appRouter.rce_silver.substr(
                    0,
                    appRouter.rce_silver.lastIndexOf('/')
                ),
                data.ID
            ]
        );
    }
    //
    openInRCE($events, rowData) {
        let data = this.getSelectedRowData();
        this.router.navigate(['rce', data.ID]);
    }

    mayUnbindMedia() : boolean {
        let data = this.getSelectedRowData();
        let res: boolean = false;
        if(data){
            res = data.PGM_PARENT_ID==0;
        }

        return res;
    }

    unbind($events){
        let data = this.getSelectedRowData();
        let translate = this.injector.get(TranslateService);
        let notificator = this.injector.get(NotificationService);
        let mgs = this.injector.get(MappingGridService);
        mgs.unbindMedia(data.ID).subscribe((res) => {
            notificator.notifyShow(1, translate.instant('mapping.unbindSuccess'));
            this.refreshGrid();
        }, (err) => {
            notificator.notifyShow(2, translate.instant('mapping.unbindError'));
        })
    }

    private refreshStarted;
    refreshGrid() {
        if (this.lastSearchModel) {
            this.refreshStarted = true;
            this.buildPage(this.lastSearchModel, false, false);
        }
    }

    afterRequestData(resp, searchModel) {
        if (!this.refreshStarted) {
            super.afterRequestData(resp, searchModel);

        } else {
            let respLength = resp.Rows ? resp.Rows : resp.Data.length;
            let data = this.prepareData(resp.Data, respLength);
            // this.originalPreparedData = data;
            this.updateData(null, data);
            if (this.refreshStarted) {
            }
            this.refreshStarted = false
        }
    }
}
