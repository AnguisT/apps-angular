/**
 * Created by Sergey Trizna on 14.06.2017.
 */
import {GridProvider} from "../../../modules/search/grid/providers/grid.provider";
import {Router} from "@angular/router";
import {BasketService} from "../../../services/basket/basket.service";
import {Inject, Injector} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {RaiseWorkflowWizzardProvider} from "../../../modules/rw.wizard/providers/rw.wizard.provider";
import {ClipEditorService} from "../../../services/clip.editor/clip.editor.service";
import {ItemTypes} from "../../../modules/controls/html.player/item.types";
import { appRouter } from '../../../constants/appRouter';
import {SlickGridProvider} from "../../demo/comps/slick-grid/slick-grid/providers/slick.grid.provider";
import {SearchFormProvider} from "../../../modules/search/form/providers/search.form.provider";

export class MediaGridProvider extends GridProvider {
    constructor(@Inject(Router) protected router: Router,
                @Inject(TranslateService) translate: TranslateService,
                @Inject(ClipEditorService) protected clipEditorService: ClipEditorService,
                @Inject(RaiseWorkflowWizzardProvider) protected raiseWorflowProvider: RaiseWorkflowWizzardProvider,
                @Inject(BasketService) protected basketService: BasketService) {
        super(translate)
    }

    addToBasket($events, rowData) {
        if (!this.isOrdered(rowData)) {
            this.basketService.addToBasket(rowData.data, "Media");
        }
    }

    showRaiseWorkflowWizzard($events, rowData) {
        this.raiseWorflowProvider.open(rowData.data, "Media");
    }

    isOrdered(rowData): boolean {
        return this.basketService.hasItem(rowData.data);
    }

    getMediaDetails($events, rowData) {
        let componentContext = this.getComponentContext();
        let searchType = componentContext.searchGridConfig.options.type;
        if (!searchType) {
            throw new Error('let searchType is not defined!');
        }

        this.router.navigate(
            [
                appRouter[searchType].detail.substr(
                    0,
                    appRouter[searchType].detail.lastIndexOf('/')
                ),
                rowData.data.ID
            ]
        );
    }

    goToMediaLogger($events, rowData) {
      let componentContext = this.getComponentContext();
      if ( componentContext.silver.isSilverlightInstalled ) {
        // this.router.navigate(['media-logger-silver', rowData.data.ID]);
        this.router.navigate(
            [
              appRouter.media_logger.silver.substr(
                0,
                appRouter.media_logger.silver.lastIndexOf('/')
              ),
              rowData.data.ID
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
              rowData.data.ID
            ]
        );
      };
    }

    clipEditorEnabled(rowData) {
      if (!rowData) {
        return false;
      }
      let playable = false;
      if(rowData.data &&
        rowData.data["PROXY_URL"] &&
        rowData.data["PROXY_URL"].length > 0 &&
        rowData.data["PROXY_URL"].match(/^(http|https):\/\//g) &&
        rowData.data["PROXY_URL"].match(/^(http|https):\/\//g).length > 0 &&
        (rowData.data["MEDIA_TYPE"] == ItemTypes.AUDIO || rowData.data["MEDIA_TYPE"] == ItemTypes.MEDIA)) {
        playable = true;
      }
      var uA = window.navigator.userAgent,
        isIE = /msie\s|trident\/|edge\//i.test(uA);
      if(rowData.data && rowData.data["MEDIA_FORMAT_text"] == "WEBM" && isIE)  {
        playable = false;
      }
      return playable;
    }

    clipEditor($events, rowData) {
        let rows: Array<any> = [rowData.data];
        // set rows
        this.clipEditorService.setSelectedRows(rows);

        // set isAudio flag
        let isAudio = rowData.data.MEDIA_TYPE == ItemTypes.AUDIO?true:false;
        this.clipEditorService.setIsAudio(isAudio);
        let id = rowData.data.ID;
        debugger;
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

    openInRCESL($events, rowData) {
        // this.router.navigate(['rce-silver', rowData.data.ID]);
        this.router.navigate(
            [
                appRouter.rce_silver.substr(
                    0,
                    appRouter.rce_silver.lastIndexOf('/')
                ),
                rowData.data.ID
            ]
        );
    }
    //
    // openInRCE($events, rowData) {
    //     this.router.navigate(['rce', rowData.data.ID]);
    // }

    changeStatus() {
        console.log('changeStatus')
    }

    delete() {
        console.log('delete');
    }

    isMediaLoggerEnable(rowData) {
        if (!rowData) {
            return false;
        }

        let file = rowData.data;
        if (typeof(file['PROXY_URL']) == "string" && file['PROXY_URL'].match(/(?:http)|(?:https)/g) && file.IsPlayableVideo) {
            return true;
        } else {
            return false;
        }
    }

    isMediaLoggerShow(rowData) {
        let componentContext = this.getComponentContext();
        let showLogger = componentContext.searchGridConfig.options.showMediaLogger;
        return !!showLogger;
    }

    private getComponentContext() {
        return this.moduleContext.config.componentContext;
    }

}
