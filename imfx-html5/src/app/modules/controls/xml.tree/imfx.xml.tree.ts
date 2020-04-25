/**
 * Created by Pavel on 17.01.2017.
 */
import {ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
// Loading jQuery
// import tree component
// import {TreeComponent} from "./component-overrides/dist/angular2-tree-component";
import {TreeModel, TreeVirtualScroll} from "angular-tree-component";
// overrides

import {IMFXXMLTree} from "./model/imfx.xml.tree";
import {MultilineTextProvider} from "./components/modals/multiline.text/multiline.text.provider";
import {ModalConfig} from "../../modal/modal.config";
import {MultilineTextComponent} from "./components/modals/multiline.text/multiline.text.component";

declare var window: any;
@Component({
    selector: 'imfx-xml-tree',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    providers: [TreeVirtualScroll, TreeModel, MultilineTextProvider],
    entryComponents: [
        MultilineTextComponent
    ],
    encapsulation: ViewEncapsulation.None,
})
export class IMFXMLTreeComponent {
    @ViewChild('tree') private tree;
    // @ViewChild('multilineTextModal') private multilineTextModal;
    @Input('readonly') readonly: boolean = false;
    @Input() schemaModel: any;
    @Input() xmlModel: any;

    public xmlTree;

    // private multilineTextModalConfig = <ModalConfig>{
    //     componentContext: this,
    //     options: {
    //         modal: {
    //             size: 'md',
    //         },
    //         content: {
    //             view: MultilineTextComponent,
    //         }
    //     }
    // };

    constructor(private cdr: ChangeDetectorRef,
                private multilineTextProvider: MultilineTextProvider) {

    }

    ngOnInit() {
        // this.multilineTextProvider.multilineTextModal = this.multilineTextModal;
    }

    ngOnChanges() {
        //detects when parent component switches to another tree data
        this.xmlTree = new IMFXXMLTree(this.xmlModel, this.schemaModel);
        this.cdr.detectChanges();
    }

    public getXmlModel() {
        return this.xmlTree.getXmlModel();
    }

    public isValid() {
        return this.xmlTree.isValid();
    }

    public fillFromString(serialized: string) {
        let strings = serialized.split(";");
        let xpaths = [];
        for (var i = 0; i < strings.length; i += 2) {
            xpaths.push({
                key: strings[i],
                value: strings[i + 1]
            })
        }
        /*debugger*/
        ;
    }

}
