/**
 * Created by Sergey Trizna on 31.08.2017.
 */
import {Component, ViewEncapsulation, Output, EventEmitter, ViewChild} from '@angular/core';
import {SecurityService} from "../../../../services/security/security.service";
import {SessionStorageService, LocalStorageService} from "ng2-webstorage";
import {Router} from "@angular/router";
import {UploadProvider} from "../../../../modules/upload/providers/upload.provider";
import {UploadModel} from "../../../../modules/upload/types";
import {DebounceProvider} from "../../../../providers/common/debounce.provider";
import { appRouter } from '../../../../constants/appRouter';
import {UploadComponent} from "../../../../modules/upload/upload";
import {IMFXModalComponent} from "../../../../modules/imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../../../../modules/imfx-modal/proivders/provider";
require('../../../../modules/upload/libs/filedrop/filedrop.js');
@Component({
    selector: 'base-upload-menu',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
    ]
})
export class BaseUploadMenuComponent {
    queueFiles: Array<UploadModel> = [];
    // @ViewChild('ddMenu') private ddMenu: any;
    @ViewChild('queueMenu') private queueMenu: any;
    @ViewChild('messageErrorText') private messageErrorText: any;
    @ViewChild('messageErrorWorkflowText') private messageErrorWorkflowText: any;
    private timeoutHandler;
    private ddMode: boolean = false;
    private skipUploadMode: boolean = false;
    constructor(private uploadProvider: UploadProvider,
                private router: Router,
                private modalProvider: IMFXModalProvider
    ) {
        uploadProvider.onStartUpload.subscribe((qf:Array<UploadModel>) => {
            this.queueFiles = uploadProvider.queueFiles;
        })

        // uploadProvider.filesAdded.subscribe((files: Array<UploadModel>) => {
        //
        // });
    }

    removeFileItem(i) {
        this.uploadProvider.removeFile(i);
    }

    ngAfterViewInit() {
        let self = this;
        // let ubtnEl = $(self.ddMenu.nativeElement).find('.upload-btn');

        (<any>$(document)).filedrop({
            onDragLeave: function (event) {
                if(self.skipUploadMode){
                    return
                }
                self.timeoutHandler = setTimeout(() => {
                    self.closeQueueMenu();
                    // for (var i = 0; i < self.timeoutHandler; i++) {
                    //     clearTimeout(i);
                    //     clearTimeout(self.timeoutHandler[i]);
                    // }
                    setTimeout(()=> {
                        self.ddMode = false;
                    }, 1000)
                }, 500);
            },
            onDragOver: function (event) {
                if(self.skipUploadMode){
                    return
                }
                if (!self.uploadProvider.uploadModalIsOpen) {
                    self.openQueueMenu();
                }
                self.ddMode = true;
            },
            onDragStart: function (event) {
                self.skipUploadMode = self.isPreventedDragDropEvent(event)
            },
            callback: function (files) {
                if(!self.skipUploadMode){
                    self.closeQueueMenu();
                }

                if(self.skipUploadMode){
                    return
                }
                if(self.uploadProvider.validateFiles(files)){
                    let modal:IMFXModalComponent = self.open();
                    setTimeout(() => {
                        modal.contentView.instance.onSelectFiles(files);
                    })
                    setTimeout(() => {
                        self.ddMode = false;
                    }, 1000)
                }

                self.skipUploadMode = false;
            }
        })
    }

    ngOnDestroy() {
        $(document).unbind('dragover dragleave drop');
    }

    private isPreventedDragDropEvent(event) {
        return (event.target.className.indexOf('dd-dots') > -1)
    }

    private closeQueueMenu() {
        $(this.queueMenu.nativeElement).removeClass('opened');
    }

    private openQueueMenu() {
        $(this.queueMenu.nativeElement).addClass('opened')
    }

    private navFromUploadMenu(router, param) {
        if (router === '/workflow/detail') {
            return this.router.navigate(
                [
                appRouter.workflow.detail.substr(
                    0,
                    appRouter.workflow.detail.lastIndexOf('/')
                ),
                param
                ]
            );
        } else if (router === '/media/detail') {
            return this.router.navigate(
                [
                appRouter.media.detail.substr(
                    0,
                    appRouter.media.detail.lastIndexOf('/')
                ),
                param
                ]
            );
        }
        // let link = [router, param];
        // console.log('link ' + link);
    }

    private copyError(state) {
        let el = state=='error'?this.messageErrorText.nativeElement:this.messageErrorWorkflowText.nativeElement
        let $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(el).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }

    private open() {
        return this.modalProvider.show(UploadComponent, {
            title: 'base.media_upload',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
    }

}
