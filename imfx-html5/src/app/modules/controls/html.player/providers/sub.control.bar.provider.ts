import {Injectable} from "@angular/core";
import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {ResizeProvider} from "./resize.provider";
import {AbstractPlayerProvider} from "./abstract.player.provider";

@Injectable()
export class SubControlBarProvider extends AbstractPlayerProvider {


  constructor(private resizeProvider: ResizeProvider) {
    super();
  }

  initSubControlBar() {
    this.componentRef.player.controlBar.addChild(
      'component', {
        text: "",
        id:"sub_control_bar"
      }).addClass('sub-control-bar').setAttribute('id','sub_control_bar');
    this.resizeProvider.setResizeEvent();
    setTimeout(()=>this.resizeProvider.onResize());
  }

}
