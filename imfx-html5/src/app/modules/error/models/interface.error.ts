/**
 * Created by Sergey Trizna on 29.03.2017.
 */
export interface ErrorInterface {
    text: string;
    suggestion: string;
    originalError?: any;
    getText(): string;
    getSuggestion(): string;
    setText(text): void;
    setSuggestion(suggestion): void;
    getOriginalError(): any;
    setOriginalError(originalError): void;
}