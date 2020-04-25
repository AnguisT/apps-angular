/**
 * Created by Sergey Trizna on 09.08.2017.
 */
import {EventEmitter, Injectable} from "@angular/core";
import {RuntimeError} from "../models/runtime.error";
import {NetworkError} from "../models/network.error";
@Injectable()
export class ErrorManagerProvider {
    onErrorThrown: EventEmitter<{error: RuntimeError|NetworkError}> = new EventEmitter();
    onErrorResolve:EventEmitter<any> = new EventEmitter();
}