/**
 * Created by Sergey Trizna on 29.03.2017.
 */
import {ErrorInterface} from './interface.error';

export class RuntimeError implements ErrorInterface {
    text: string;
    suggestion: string;
    originalError?: any;

    setText(text): void {
        this.text = text;
    }

    getText(type: 'html'|'text' = 'html', mode: 'small'|'full' = 'full'): string {
        let err;
        let br = type == 'html' ? "<br />" : "\r\n";
        err = this.originalError.toLocaleString() + br;
        if (this.originalError._body && mode == 'full') {
            err += this.originalError._body + br;
        }

        if (this.originalError.statusText) {
            err += this.originalError.statusText + br;
        }

        if(this.text) {
            err += this.text;
        }


        return err;
    }

    setSuggestion(suggestion): void {
        this.suggestion = suggestion;
    }

    getSuggestion(): string {
        return this.suggestion;
    }

    getOriginalError() {
        return this.originalError;
    }

    setOriginalError(originalError) {
        // if (typeof originalError == 'object') {
        //     let errText = "";
        //     if (originalError.message && originalError.message != "undefined") {
        //         errText += originalError.message;
        //     }
        //     if (originalError.stack && originalError.stack != "undefined") {
        //         errText += "<br />" + originalError.stack;
        //     }
        //     this.setText(errText);
        // } else {
        //     this.setText(originalError);
        // }
        this.originalError = originalError;
    }
}
