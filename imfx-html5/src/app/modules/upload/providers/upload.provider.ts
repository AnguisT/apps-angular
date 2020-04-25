/**
 * Created by Sergey Trizna on 04.05.2017.
 */
import {EventEmitter, Inject, Injectable} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {UploadService} from "../services/upload.service";
import {
    AvailableMediaTypeByExtensionAsSelect2ListTypes,
    AvailableMediaTypeByExtensionListTypes,
    MediaFileListTypes,
    MediaFileType,
    MediaFileTypes,
    UploadModel
} from "../types";
import {UploadComponent} from "../upload";
import {BasketService} from "../../../services/basket/basket.service";
import {Select2ItemType, Select2ListTypes} from "../../controls/select2/types";
import {NotificationService} from "../../notification/services/notification.service";
import {ArrayProvider} from "../../../providers/common/array.provider";
import {IMFXModalComponent} from "../../imfx-modal/imfx-modal";
import {VersionsInsideUploadComponent} from "../modules/versions/versions.component";
import {IMFXModalEvent} from "../../imfx-modal/types";
import {BaseUploadMenuComponent} from "../../../views/base/components/base.upload/base.upload.component";
var FormData = require('formdata-polyfill');
@Injectable()
export class UploadProvider {
    public baseUploadMenuRef: BaseUploadMenuComponent;
    // ref to module
    public moduleContext: UploadComponent;
    public filesAdded: EventEmitter<Array<UploadModel>> = new EventEmitter<Array<UploadModel>>();

    // separator for params of request
    private separator: string = '#!#';

    // model for send to server
    private formData: Array<any> = [];

    // model for work with form
    // private formModels: Array<any> = [];`

    // array of files
    private files: Array<File> = [];

    // current item file
    private activeFileItem: number = 0;

    // fields with values as object
    private fieldsWithObjectValues = [
        'AspectRatio',
        'TvStandard',
        'Usage'
    ];
    // Queue of files
    public queueFiles: Array<UploadModel> = [];
    private _queueId: number = 0;
    // public isFileReader: boolean = false;
    public uploadModal: any;
    public uploadModalIsOpen: boolean = false;
    public versionsModal: any;
    public _selectedVersion: { id?: number, title?: string } = {};

    // empty for start, filled on first call
    private availableMediaTypesByExtension: AvailableMediaTypeByExtensionListTypes = {};
    private availableMediaTypesAsSelect2ItemByExtension: AvailableMediaTypeByExtensionAsSelect2ListTypes = {}
    constructor(@Inject(UploadService) private uploadService: UploadService,
                @Inject(BasketService) private basketService: BasketService,
                // @Inject(ControlToAdvTransfer) private transferSubscriber: ControlToAdvTransfer,
                @Inject(NotificationService) private notificationRef: NotificationService,
                @Inject(ArrayProvider) private arrayProvider: ArrayProvider) {
        this.uploadService.providerContext = this;
    }

    /**
     * Entry point
     * @returns {any}
     */
    public init(): Observable<Subscription> {
        return Observable.create((observer) => {
            // Is available FileReader
            // this.isFileReader = this.isFileReaderAvailable();

            // get presets for workflow selector
            this.getPresetsAndPrepareIt().subscribe((presets: Array<Select2ItemType>) => {
                let controlWorkflow = this.moduleContext.controlWorkflow;
                controlWorkflow.setData(presets, true);

                // finish
                observer.next();
            });
        });
    }

    validateFiles(files) {
        let res = false;
        $.each(files, (k, file) => {
            // check name (english letters only for now)
            let name = $.trim(file.name);
            let reg = /^[0-9a-zA-Z_\(\)\-\.\s]*$/;
            if (!name) {
                this.notificationRef.notifyShow(2, "upload.empty_name");
                // continue
                return true;
            }

            if (!reg.test(name)) {
                this.notificationRef.notifyShow(2, "upload.invalid_name");
                // continue
                return true;
            }

            res = true;
        });

        return res;
    }

    /**
     * Bind array of files to FormData
     * @param files
     */
    public bindFilesToFormData(files) {
        let size = files[0].size / 1024 / 1024 / 1024;
        if (size < 2) {
            $.each(files, (k, file) => {
                // check name (english letters only for now)
                let name = $.trim(file.name);
                let reg = /^[0-9a-zA-Z_\(\)\-\.\s]*$/;
                if (!name) {
                    this.notificationRef.notifyShow(2, "upload.empty_name");
                    // continue
                    return true;
                }

                if (!reg.test(name)) {
                    this.notificationRef.notifyShow(2, "upload.invalid_name");
                    // continue
                    return true;
                }
                // check extension
                let ext = name.split('.').pop();
                let fileMediaTypes: MediaFileListTypes | null = this.getMediaTypesByExt(ext);
                if (!fileMediaTypes || fileMediaTypes.length == 0) {
                    this.notificationRef.notifyShow(2, "upload.error_ext");
                    // continue
                    return true;
                }
                let key = this.formData.length;
                if(fileMediaTypes.length == 1){
                    this.setFormData("MediaFormat", fileMediaTypes[0].Id, key);
                }
                this.setFormData("Filename", encodeURI(name), key);
                this.setFormData("FilenameReal", name, key);
                this.setFormData("IsLocal", true, key);
                this.setFormData("Filesize", file.size, key);
                this.setFormData("fileToUpload", file, key);

                // this.fileNames += this.fileNames.length == 0 ? file.name : ", " + file.name;
                this.files.push(file);
            });
        } else {
            this.notificationRef.notifyShow(2, 'The file size exceeds 2 gigabytes');
        }
        // this.cdr.detectChanges();
    }

    /**
     * Return available extensions
     */
    public getAvailableExtensions(): MediaFileTypes {
        return this.moduleContext.controlMediaTypes._serverResponse;
    }

    /**
     * Prepare available extensions to assoc array of array
     */
    public bindMediaTypesToExtension() {
        let types: MediaFileTypes = this.getAvailableExtensions();
        if ($.isEmptyObject(this.availableMediaTypesByExtension)) {
            $.each(types, (k, t) => {
                $.each(t.Extensions.split('|'), (ex, ev) => {
                    if (ev) {
                        if (!this.availableMediaTypesByExtension[ev]) {
                            this.availableMediaTypesByExtension[ev] = [];
                            this.availableMediaTypesAsSelect2ItemByExtension[ev] = [];
                        }
                        this.availableMediaTypesByExtension[ev].push(t);
                        let select2Type = this.moduleContext.controlMediaTypes.turnObjectToStandart(t, {
                            key: 'Id',
                            text: 'Name'
                        });
                        this.availableMediaTypesAsSelect2ItemByExtension[ev].push(select2Type)
                    }
                });
            });
        }
    }

    /**
     * Get Select2ListTypes by extension
     * @param ex
     * @returns {Select2ListTypes}
     */
    public getMediaTypesAsSelect2ItemByExt(ex): Select2ListTypes {
        this.bindMediaTypesToExtension();
        // console.log(this.availableMediaTypesAsSelect2ItemByExtension);
        return this.availableMediaTypesAsSelect2ItemByExtension[ex] || [];
    }

    /**
     * Get MediaFileListTypes by extension
     * @param ext
     * @returns {MediaFileType}
     */
    public getMediaTypesByExt(ext): MediaFileListTypes {
        this.bindMediaTypesToExtension();

        return this.availableMediaTypesByExtension[ext.toLowerCase()];
    }

    /**
     * Select file item
     * @param key
     */
    public selectFileItem(key: number) {
        this.activeFileItem = key;
        this.moduleContext.fillControls();
    }

    /**
     * Set value to FormData
     * @param field
     * @param val
     * @param activeItem
     */
    public setFormData(field, val, activeItem: number = this.activeFileItem) {
        if (activeItem > -1) {
            if (!this.formData[activeItem]) {
                this.formData[activeItem] = {};
            }
            this.formData[activeItem][field] = val;
        } else {
            this.formData[field] = val;
        }

    }

    /**
     * Remove form data
     * @param activeItem
     */
    public removeFormData(field = 'all', activeItem: number = this.activeFileItem) {
        if (field == 'all') {
            if (this.formData[activeItem]) {
                this.formData = this.formData.filter((o, i) => {
                    if (i == activeItem) {
                        return false
                    }

                    return true
                });
            }
        } else {
            delete this.formData[activeItem][field];
        }
    }

    public removeItem(itemIndex: number = this.activeFileItem) {
        this.files.splice(itemIndex, 1);
        this.removeFormData('all', itemIndex);
        if (itemIndex == this.activeFileItem) {
            this.selectFileItem(0);
        }
    }


    /**
     * Return full form data
     * @returns {Array}
     */
    public getFullFormData() {
        return this.formData;
    }

    /**
     * Clear form data
     */
    public clearProperties() {
        this.formData = [];
        // this.moduleContext.formData = [];
        this.files = [];
        this._selectedVersion = {};
    }

    /**
     * Get values from FormData
     * @param field
     * @param activeItem
     * @returns {any}
     */
    public getFormData(field, propery = null, activeItem: number = this.activeFileItem) {
        let res;
        if (activeItem > -1) {
            res = this.formData[activeItem];
            if (res) {
                res = res[field];
                if (res && res[propery]) {
                    res = res[propery];
                }
            }
        } else {
            res = this.formData[field];
        }


        return res;
    }

    /**
     * On open upload modal
     */
    public open() {
        this.uploadModalIsOpen = true;
        let uploadComponent: UploadComponent = this.uploadModal.getContent();
        this.uploadModal.onShown.subscribe(() => {
            uploadComponent.onShown()
        });
        this.uploadModal.show();
    }

    /**
     * Open modal with versions
     */
    public showVersions() {
        let modal: IMFXModalComponent = this.moduleContext.modalProvider.show(VersionsInsideUploadComponent, {
            name: 'upload-version-modal',
            title: 'upload.version_title',
            size: 'xl',
            footer: 'close|ok'
        }, {});

        // modal.onShown.subscribe(() => {
        //     modal.contentView.slickGridComp.provider.resize();
        // });
        // modal.onShow.subscribe();
        // modal.modalEvents.subscribe((e: IMFXModalEvent) => {
        //     if(e.name == 'ok'){
        //         debugger
        //     }
        // })
    }

    /**
     * On select version
     * @param data
     */
    public onSelectVersion(data) {
        this._selectedVersion = {id: data.ID, title: data.FULLTITLE};
        this.moduleContext.isValidForm = this.isValidForm();
        if (this.moduleContext.isValidForm) {
            this.moduleContext.enableAllFields()
        } else {
            this.moduleContext.disableAllFields()
        }
    }

    /**
     * Validate form
     * @returns {boolean}
     */
    isValidForm() {
        return this._selectedVersion.id !== undefined && this.files.length > 0;
    }

    /**
     * Upload files
     */
    public onStartUpload: EventEmitter<Array<UploadModel>> = new EventEmitter<Array<UploadModel>>();
    upload() {
        this.notificationRef.notifyShow(1, 'upload.start');
        let formDatas: Array<FormData> = this.getPreparedFormDataToUpload();
        this.addFiles(formDatas);
        this.onStartUpload.emit(this.queueFiles);
        this.processUploadFile();
        this.moduleContext.hide();
    }

    public processUploadFile() {
        let self = this;
        if (this.queueFiles[self._queueId]) {
            let um: UploadModel = this.queueFiles[self._queueId];
            let fd: FormData = um.formData;
            if (um.state === 'waiting') {
                um.state = 'progress';
                this.uploadFileUseAJAX(fd).subscribe(function (resp) {
                    um.state = 'success';
                    this.unsubscribe();
                    self._queueId = self._queueId + 1;
                    self.processUploadFile();
                }, function () {
                    um.state = 'error';
                    this.unsubscribe();
                    self._queueId = self._queueId + 1;
                    self.processUploadFile();
                })
            } else {
                self._queueId = self._queueId + 1;
                self.processUploadFile();
            }
        } else {
            if (this.queueFiles[self._queueId - 1]) {
                this.notificationRef.notifyShow(1, 'upload.completed');
            } else {
                this.notificationRef.notifyShow(2, 'upload.error');
            }
        }
    }

    public getQueueId() {
        return this._queueId
    }

    public getActiveFileItem() {
        return this.activeFileItem || 0;
    }

    /**
     * Upload file use ajax (active now)
     * @param data
     * @returns {any}
     */
    uploadFileUseAJAX(data: FormData): Observable<Subscription> {
        return Observable.create((observer) => {
            // setTimeout(() => {
            //     observer.error(data);
            // }, 1000);
            this.uploadService.uploadUseAJAX(data).subscribe(
                (resp: any) => {
                    if (!resp.WorfklowResult) {
                        resp.WorfklowResult = {};
                    }
                    if (resp && resp.MediaId) {
                        this.queueFiles[this.getQueueId()].success = resp;

                        observer.next(resp);
                    } else {
                        this.notificationRef.notifyShow(2, "upload.error_uploading");
                        this.queueFiles[this.getQueueId()].error = resp;
                        this.queueFiles[this.getQueueId()].errorText = JSON.stringify(resp);
                        observer.error(resp);
                    }
                },
                (error: any) => {
                    this.queueFiles[this.getQueueId()].error = error;
                    this.queueFiles[this.getQueueId()].errorText = JSON.stringify(error);
                    observer.error(error);
                }
            );
        });
    }

    /**
     * Return array of files by state
     * @param args
     * @returns {UploadModel[]}
     */
    getUploadModelsByStates(...args: any[]): Array<UploadModel> {
        return this.queueFiles.filter((um, i) => {
            let sol = false;
            $.each(args, (k, st) => {
                if (um.state == st) {
                    sol = true;
                    return false
                }
            });

            return sol;
        })
    }

    /**
     * Prepare form data to upload
     * @returns {Array<FormData>}
     */
    public getPreparedFormDataToUpload(): Array<FormData> {
        let self = this;
        let formDatas: Array<FormData> = [];
        // let versionId = this.getFormData('VersionId', null, -1);
        let versionId = this._selectedVersion.id;
        $.each(this.formData, (i, dataItem) => {
            let formData: FormData = new FormData();
            formData.append('VersionId', versionId.toString());
            $.each(dataItem, (k, d) => {
                (<any>formData).set('WorkflowPresetId', 0);
                if (this.arrayProvider.inArray(this.fieldsWithObjectValues, k)) {
                    formData.append(k, d.ID + self.separator + d.Name[0]);
                } else {
                    if (k == 'FilenameReal') {
                        return true;
                    }
                    if (k == 'WorkflowPresetId' && (<any>formData).get(k) == "0") {
                        (<any>formData).set('WorkflowPresetId', d);
                        return true;
                    }
                    formData.append(k, this.getFormData(k, null, i));
                }
            });
            formDatas.push(formData)
        });

        return formDatas;
    }

    /**
     * Add file to queue
     * @param data
     * @returns {UploadModel}
     */
    addFile(data: FormData): UploadModel {
        let uploadModel = new UploadModel;
        uploadModel.state = "waiting";
        uploadModel.formData = data;
        uploadModel.percentValue = 0;
        uploadModel.mediaFileType = this.moduleContext.controlMediaTypes._serverResponse[this.getFormData('MediaFormat')];
        // /*debugger*/;
        // not working for ie
        // uploadModel.file = (<any>uploadModel.formData).get('fileToUpload');
        this.queueFiles.push(uploadModel);
        // this.uploadFile(data).subscribe();
        return uploadModel;
    }

    /**
     * Add files to queue
     * @param data
     */
    addFiles(data: Array<FormData> = []) {
        let self = this;
        let uploadedModels: Array<UploadModel> = [];
        data.forEach((item: FormData, i: number) => {
            let um = this.addFile(item);
            um.file = self.files[i];
            uploadedModels.push(um);
        });
    }

    /**
     * Remove all completed items in files queue
     */
    removeCompleted() {
        let self = this;
        let completed = this.getUploadModelsByStates('error', 'success');
        $.each(completed, (ci, co) => {
            $.each(self.queueFiles, (qi, qo) => {
                if (!co || !qo) {
                    return true
                }
                if (
                    qo.file.Filename == co.file.Filename
                    &&
                    qo.file.Filesize == co.file.Filesize
                    &&
                    co.state == qo.state
                ) {
                    self.removeFile(qi);
                }
            });
        });
    }

    /**
     * Remove file from queue
     * @param i
     */
    removeFile(i) {
        this.queueFiles.splice(i, 1);
        // reset iterator
        this._queueId = 0;
    }

    /**
     * Update value from control
     * @param field
     * @param item
     */
    updateControl(field: string, item: Select2ItemType | null) {
        if (item === null) {
            this.removeFormData(field);
        } else {
            if (this.arrayProvider.inArray(this.fieldsWithObjectValues, field)) {
                this.setFormData(field, {
                    ID: item.id,
                    Name: item.text,
                    Selected: false
                });
            } else {
                this.setFormData(field, item.id);
            }
        }
    }

    /**
     * Is supported FileReader in browser
     * @returns {boolean}
     */
    // private isFileReaderAvailable(): boolean {
    //     return !!((<any>window).FileReader && (<any>window).File && (<any>window).FileList && (<any>window).Blob);
    // }

    /**
     * Get presets and prepare it for select2 control
     * @returns {any}
     */
    private getPresetsAndPrepareIt(): Observable<Array<Select2ItemType>> {
        return Observable.create((observer) => {
            this.basketService.getOrderPresets().subscribe((resp: any) => {
                let presets: Array<Select2ItemType> = this.moduleContext.controlWorkflow.turnArrayOfObjectToStandart(resp, {
                    key: 'Id',
                    text: 'Name',
                    selected: 'Selected'
                });
                observer.next(presets);
            });
        });
    }


    // addChunk(chunk: ArrayBuffer, emiter: EventEmitter<any>, type: 'ajax' | 'service') {
    //     if (chunk) {
    //         if (type == 'ajax') {
    //             this.uploadFileUseAJAX(chunk).subscribe((res) => {
    //                 emiter.emit(res);
    //             });
    //         } else {
    //             this.uploadFileUseHttpService(chunk).subscribe((res) => {
    //                 emiter.emit(res);
    //             });
    //         }
    //     } else {
    //         console.log('Finished');
    //     }
    // }


    // uploadFileUseHttpService(data: FormData | ArrayBuffer): Observable<Subscription> {
    //     return Observable.create((observer) => {
    //         this.uploadService.upload(data).subscribe((resp) => {
    //             /*debugger*/;
    //             observer.next(resp)
    //         })
    //     });
    // }
    //
    // private prepareFormDataForSend() {
    //
    // }
    //
    // private prepareArrayBufferForSend() {
    //
    // }

    // private uploadFile(data: FormData | ArrayBuffer): Observable<Subscription> {
    //     //     // let base64js = require('base64-js');
    //     return Observable.create((observer) => {
    //         observer.next();
    //         //
    //         //         // if(typeof data === ArrayBuffer){
    //         //         //     let base64data = atob(
    //         //         //         new Uint8Array(data)
    //         //         //             .reduce((data, byte) => data + String.fromCharCode(byte), '')
    //         //         //     );
    //         //         // } else {
    //         //         //     let base64data = base64js.fromByteArray(data);
    //         //         // }
    //         //
    //         //         // /*debugger*/;
    //         //         // TODO Refact it; Need use httpService instead of $.ajax
    //         //         // let myXhr = $.ajaxSettings.xhr();
    //         //         // $.ajax({
    //         //         //     url: ConfigService.getAppApiUrl() + '/api/file-upload',
    //         //         //     // url: ConfigService.getAppApiUrl() + '/api/versions',
    //         //         //     type: 'POST',
    //         //         //     data: data,
    //         //         //     cache: false,
    //         //         //     contentType: false,
    //         //         //     processData: false,
    //         //         //     beforeSend: (request) => {
    //         //         //         request.setRequestHeader("Accept", 'application/vnd.tmd.mediaflex.api+json;version=1');
    //         //         //         request.setRequestHeader('Authorization', 'Bearer ' + this.httpService.getAccessToken());
    //         //         //         request.setRequestHeader('Content-Type', 'multipart/form-data');
    //         //         //     },
    //         //         //     xhr: () => {
    //         //         //         if (myXhr.upload) {
    //         //         //             myXhr.upload.addEventListener('progress', function (progress) {
    //         //         //
    //         //         //             }, false);
    //         //         //         }
    //         //         //         return myXhr;
    //         //         //     }
    //         //         // }).done((result) => {
    //         //         //     /*debugger*/;
    //         //         //     observer.next(result);
    //         //         //     //API call succeeded
    //         //         // }).fail((xhr, status, error) => {
    //         //         //     /*debugger*/;
    //         //         //     observer.error({xhr: xhr, status: status, error: error});
    //         //         // });
    //     });
    // }
}
