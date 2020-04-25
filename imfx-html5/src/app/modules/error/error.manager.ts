/**
 * Created by Sergey Trizna on 29.03.2017.
 */
import {ErrorHandler, Inject, Injectable} from "@angular/core";
import {DebounceProvider} from "../../../app/providers/common/debounce.provider";
import {ModalProvider} from "../../../app/modules/modal/providers/modal.provider";
import {RuntimeError} from "../../../app/modules/error/models/runtime.error";
import {NetworkError} from "../../../app/modules/error/models/network.error";
import {StringProivder} from "../../../app/providers/common/string.provider";
import {Headers, Http, Request, RequestMethod} from "@angular/http";
import {SessionStorageService} from "ng2-webstorage";
import {ErrorManagerProvider} from "./providers/error.manager.provider";
import {NotificationService} from "../notification/services/notification.service";
@Injectable()
export class ErrorManager extends ErrorHandler {
    private storagePrefix = "error.stack";
    private httpService;


    constructor(private modalProvider: ModalProvider,
                private debounceProvider: DebounceProvider,
                private storageService: SessionStorageService,
                private stringProvider: StringProivder,
                private http: Http,
                private emp: ErrorManagerProvider,
                @Inject(NotificationService) private notificationRef: NotificationService,) {
        super();
    }

    handleError(error) {
        let errorModel = new RuntimeError();
        errorModel.setOriginalError(error);
        // use the line below to show error popups thrown from angular
        // this.throwError(errorModel);
        console.error(error);
    }

    throwError(error: RuntimeError | NetworkError) {
        // let prevErr = this.storageService.retrieve(this.storagePrefix) || "";
        // angular can call handleError method few times
        // so I use there sessionStorage and debounce for collect errors
        let errorFiltered = this.stringProvider.replaceStringByArray(error.getText('text', 'small'), [
            "(username=|password=)[a-zA-Z0-9\_\*\\.\\-\!\]+"
        ], [
            '>>hidden<<'
        ]);
        if (error.originalError.status == 400 && (error.originalError._body).indexOf("The user name or password is incorrect") > -1) {
            return;
        }
        // this.storageService.store(this.storagePrefix, errorFiltered + "<br>\r\n");
        // this.debounceProvider.debounce(() => {
        // this.createIssue(error);
        // debugger
        try {
            this.notificationRef.notifyShow(2, errorFiltered);
            // debugger
            // // if(typeof error === NetworkError) {
            // let showErr = true;
            // $.each(this.notShowNetworkErrorForItRoutes, (k, routeItem) => {
            //     showErr = !this.arrayProvider.inArray(error.getUr, routeItem);
            // });
            // if (showErr) {
            //     this.notificationRef.notifyShow(2, errorFiltered);
            // }
            // } else {
            //     this.notificationRef.notifyShow(2, errorFiltered);
            // }

            // let modal = this.modalProvider.getModal('error');
            // if (modal) {
            //     modal.setText(this.storageService.retrieve(this.storagePrefix) + "<br>\r\n").show();
            //     modal.onHidden.subscribe((e) => {
            //         this.storageService.clear(this.storagePrefix)
            //         this.emp.onErrorResolve.emit();
            //     });
            // } else {
            //     alert(error.getText());
            // }
            this.emp.onErrorThrown.emit({error: error});
        } catch (e) {
            // console.error(e);
            alert(e);
        }

        // }, 800, false)();
    }

    private createIssue(error: RuntimeError | NetworkError) {
        let text = error.getText('text');
        console.log(this.httpService);
        /*debugger*/
        let url = "http://yt.tmd.tv/rest/issue?project=ProjectX&summary='Issue created automated;'&description=test";
        let request = new Request({
            method: RequestMethod.Put,
            url: url,
            body: {},
            withCredentials: true
        });
        request.headers = new Headers();
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');

        this.http.request(request).subscribe((res) => {
            /*debugger*/
        })
        // this.httpService.put("", {})
    }
}
