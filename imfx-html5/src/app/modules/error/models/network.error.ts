/**
 * Created by Sergey Trizna on 29.03.2017.
 */
import {ErrorInterface} from "./interface.error";
import {RequestOptions} from "@angular/http";

export class NetworkError implements ErrorInterface {
    text: string;
    suggestion: string;
    originalError?: any;
    request?: RequestOptions;


    setText(text): void {
        this.text = text;
    }

    getText(type: 'html' | 'text' = 'html', mode: 'small' | 'full' = 'full'): string {
        let err = "";
        let br = type == 'html' ? "<br />" : "\r\n";
        if (this.text) {
            err += this.text + br;
        }

        if (this.request) {
            if (mode == 'full') {
                err += "<strong>Error on request</strong>: " + br;
                err += "<strong>Url</strong>: " + "<span>" + this.request.url + "</span>" + br;
                err += "<strong>Headers</strong>: " + JSON.stringify(this.request.headers.toJSON()) + br;
                err += "<strong>Body</strong>: " + this.request.body + br;
            }
        }

        if (this.originalError) {
            err += "<span>" + this.getOriginalError() + "</span>"
            // err += "<span>" + this.originalError.toLocaleString() + "</span>" + br;
        }

        if (type == 'text') {
            err = $(err).text();
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
        let err;
        if (this.originalError && this.originalError._body) {
            let parsedErr = this.originalError._body;
            if (typeof parsedErr == "string") {
                parsedErr = JSON.parse(parsedErr);
            }

            if (parsedErr.Message) {
                err = parsedErr.Message
            }
        }

        if (!err) {
            err = this.originalError.toLocaleString();
        }

        return err;
    }

    setOriginalError(originalError) {
        this.originalError = originalError;
    }

    setRequest(request: RequestOptions) {
        this.request = request;
    }
}
