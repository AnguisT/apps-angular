import { Input, AfterViewInit, ElementRef, HostListener, Directive, AfterContentChecked } from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class Autosize implements AfterViewInit, AfterContentChecked {

    private el: HTMLElement;
    private _minHeight: string;
    private _maxHeight: string;
    private _resize = 'none';
    private _lastHeight: number;
    private _clientWidth: number;

    @Input('minHeight')
    get minHeight() {
        return this._minHeight;
    }
    set minHeight(val: string) {
        this._minHeight = val;
        this.updateMinHeight();
    }

    @Input('maxHeight')
    get maxHeight() {
        return this._maxHeight;
    }
    set maxHeight(val: string) {
        this._maxHeight = val;
        this.updateMaxHeight();
    }

    @Input('resize')
    get resize() {
        return this._resize;
    }
    set resize(val: string) {
        this._resize = val;
        this.updateResize();
    }

    @HostListener('window:resize', ['$event.target'])
    onResize(textArea: HTMLTextAreaElement) {
        if (this.el.clientWidth === this._clientWidth) { return; }
        this._clientWidth = this.element.nativeElement.clientWidth;
        this.adjust();
    }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {
        this.el = element.nativeElement;
        this._clientWidth = this.el.clientWidth;
    }

    ngAfterViewInit(): void {
        const style = window.getComputedStyle(this.el, null);
        this.el.style.resize = 'none';
        this.adjust();
    }

    adjust(): void {
        if (this.el.style.height === this.element.nativeElement.scrollHeight + 'px') { return; }
        this.el.style.overflow = 'hidden';
        this.el.style.height = 'auto';
        if (this.el.scrollHeight - 36 === 20) {
            this.el.style.height = (this.el.scrollHeight - 36) + 'px';
        } else {
            this.el.style.height = (this.el.scrollHeight - 15) + 'px';
        }
    }

    updateMinHeight(): void {
        this.el.style.minHeight = this._minHeight + 'px';
    }

    updateMaxHeight(): void {
        this.el.style.maxHeight = this._maxHeight + 'px';
    }

    updateResize(): void  {
        this.el.style.resize = this._resize;
    }

}