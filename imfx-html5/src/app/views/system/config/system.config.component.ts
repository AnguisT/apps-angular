import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SystemConfigXmlComponent} from "./comps/xml/xml.component";

@Component({
  selector: 'system-config',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    SystemConfigXmlComponent
  ]
})
export class SystemConfigComponent implements OnInit{

  private selectedComponent: "ug"|"xml"|"gs";


  ngOnInit() {
    this.selectItem("ug")
  }

  selectItem(i) {
    this.selectedComponent = i;
  }

}
