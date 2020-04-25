import { Component, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { XMLService } from '../../../../../services/xml/xml.service';
import { BasketService } from '../../../../../services/basket/basket.service';
import { OverlayComponent } from '../../../../../modules/overlay/overlay';
import { Observable, Subscription } from 'rxjs';
import {IMFXXMLTree} from "../../../../../modules/controls/xml.tree/model/imfx.xml.tree";
import {IMFXMLTreeComponent} from "../../../../../modules/controls/xml.tree/imfx.xml.tree";

@Component({
  selector: 'system-config-xml-tree',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  entryComponents: [
    OverlayComponent
  ],
  encapsulation: ViewEncapsulation.None
})

export class SystemConfigXmlComponent {
  @ViewChild('xmlTree') private xmlTree: IMFXMLTreeComponent;
  @ViewChild('systemConfig') private systemConfig;
  @ViewChild('overlay') private overlay: OverlayComponent;
  private selectedSchemaModel: any = {};
  private selectedXmlModel: any = {};
  private schemas: any = [];
  private schemaTypes: any = [];
  private xmlLoading: boolean = false;
  private xmlEmpty: boolean = false;
  private xmlSubscription: Subscription;

  constructor(private cdr: ChangeDetectorRef,
              private xmlService: XMLService) {
  }


  public onSelect($event) {

  }


  ngOnInit() {
    this.initXML();
  }

  initXML() {
    let self = this;
    this.xmlService.getSchemaList()
    .subscribe(result => {
      let schemaTypesMap = new Map();
      let filtered = result.filter(el => el.SchemaType);
      for (let schema of filtered) {
        if (!schemaTypesMap.get(schema.SchemaType.Id)) {
          schemaTypesMap.set(schema.SchemaType.Id, {
            schemaType: schema.SchemaType,
            Children: [],
            Name: schema.SchemaType.Value
          });
        }
        schemaTypesMap.get(schema.SchemaType.Id).Children.push(schema);
      }
      self.schemaTypes = Array.from(schemaTypesMap).map(el => el[1]);
      if (self.schemaTypes[0].Children[0]) {
        self.schemaTypes[0].Children[0].selected = true;
        self.selectXml(self.schemaTypes[0].Children[0].Id);
      } else {
        self.xmlEmpty = true;
      }
      self.cdr.detectChanges();
    });
  }

  selectXml(id) {
    this.xmlLoading = true;
    this.overlay.show(this.systemConfig.nativeElement);
    this.xmlEmpty = false;
    if (this.xmlSubscription) {
      this.xmlSubscription.unsubscribe();
    }
    this.xmlSubscription = this.xmlService.getXmlData(id)
      .subscribe((result: any) => {
        this.xmlLoading = false;
        this.overlay.hide(this.systemConfig.nativeElement);
        if (result) {
          this.selectedSchemaModel = result.SchemaModel;
          this.selectedXmlModel = result.XmlModel;
        } else {
          this.xmlEmpty = true;
        }
        this.cdr.detectChanges();
      });
  }

  public getValue() {
    let a = this.xmlTree.getXmlModel();
  }

  ngOnDestroy() {
    this.overlay.hide(this.systemConfig.nativeElement);
  }

  public validate() {
    alert(this.xmlTree.isValid());
  }

}
