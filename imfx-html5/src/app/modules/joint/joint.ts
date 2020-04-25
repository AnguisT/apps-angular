/**
 * Created by Sergey Trizna on 07.06.2017.
 */
import {Component, ViewEncapsulation, ViewChild, Input, ChangeDetectorRef} from "@angular/core";
import {LinkTypes} from "./types";
import {JointDeps} from "./deps/deps";
import {shapes} from "jointjs";
import 'style-loader!jointjs/dist/joint.min.css';
import * as $ from 'jquery';
import * as joint from 'jointjs/dist/joint.js';
@Component({
    selector: 'joint',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss', '../../../../node_modules/jointjs/dist/joint.min.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // JointProvider,
        JointDeps
    ]
})

export class JointComponent {
    @ViewChild('jointjs') public control;
    @Input() fullSize: boolean = false;
    @Input() width: string = '100%';
    @Input() height: string = '100%';
    @Input() parentSelector: string = '';
    private extendsOptions = {};
    private iScrollPosW = 0;
    private iScrollPosH = 0;

     /**
     * Get default options
     * @returns Object
     */
    public getDefaultOptions() {
        return {
            width: this.width,
            height: this.height,
            fullSize: this.fullSize,
            parentSelector: this.parentSelector
        };
    }

    /**
     * Set default options
     * @param paramOptions
     */
    public setDefaultOptions(paramOptions) {
        this.extendsOptions = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            paramOptions // options from params
        );
    }

    /**
     * Returned current state options for plugin
     * @returns Object
     */
    public getActualOptions(paramOptions = {}) {
        let opts = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            this.extendsOptions, // actually options
            paramOptions // options from params
        );

        return opts;
    }

    constructor(public jointDeps: JointDeps,
                private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.jointDeps.init({config: this.getActualOptions(), control: this.control});
        //this.setResizeEvent();
    }

    getModel(inputs: Array<string> = [], outputs: Array<string> = [], options = {}) {
        return this.jointDeps.getModel(inputs, outputs, options);
    }

    addModel(inputs: Array<string> = [], outputs: Array<string> = [], options = {}) {
        let m = this.getModel(inputs, outputs, options);
        this.addCell(m);

        return m;
    }

    addBlock(opts) {
        let d = this.jointDeps.getBlock(opts);
        this.addCell(d);

        return d;
    }

    connectPort2Port(sourceId, sourcePort, targetId, targetPort, type: LinkTypes, opts): shapes.devs.Link {
        let link = this.jointDeps.getLinkPort2Port(sourceId, sourcePort, targetId, targetPort, type, opts);
        this.addCell(link);

        return link;
    }

    connectModel2Model(sourceId, targetId, type: LinkTypes, opts) {
        let link = this.jointDeps.getLinkModel2Model(sourceId, targetId, type, opts);
        this.addCell(link);

        return link;
    }

    drawAll() {
        this.jointDeps.drawAll();
    }

    resize() {
        this.jointDeps.resize();
    }

    addCell(el) {
        this.jointDeps.addCell(el);
    }

    on(on: string, cb: Function) {
        this.jointDeps.on(on, cb)
    }

    getPaper() {
        return this.jointDeps.paper;
    }

    setResizeEvent() {
        let width;
        let height;
        let $svgElement = $(this.control.nativeElement).find('svg');
        let iCurScrollPosW = $(this.control.nativeElement).scrollLeft();
        if (iCurScrollPosW > this.iScrollPosW) {
            // Scrolling Down
            width = this.control.nativeElement.clientWidth;
            width = width + iCurScrollPosW;
            $svgElement.attr('width', width);
        } else {
            // Scrolling Up
            let scrollWidth = this.control.nativeElement.scrollWidth;
            width = this.iScrollPosW - iCurScrollPosW;
            width = scrollWidth - width;
            $svgElement.attr('width', width);
        }
        this.iScrollPosW = iCurScrollPosW;

        let iCurScrollPosH = $(this.control.nativeElement).scrollTop();
        if (iCurScrollPosH > this.iScrollPosH) {
          // Scrolling Down
          height = this.control.nativeElement.clientHeight;
          height = height + iCurScrollPosH;
          $svgElement.attr('height', height);
        } else {
          // Scrolling Up
          let scrollWidth = this.control.nativeElement.scrollHeight;
          height = this.iScrollPosH - iCurScrollPosH;
          height = scrollWidth - height;
          $svgElement.attr('height', height);
        }
        this.iScrollPosH = iCurScrollPosH;

        this.cdr.detectChanges();
    }
}
