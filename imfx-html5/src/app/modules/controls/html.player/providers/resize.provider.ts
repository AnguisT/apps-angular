import { AbstractPlayerProvider } from "./abstract.player.provider";
import { Injectable } from "@angular/core";

@Injectable()
export class ResizeProvider extends AbstractPlayerProvider {

  setResizeEvent() {
    var self = this;
    $($(this.componentRef.player.el_.parentElement).find("iframe")[0]['contentWindow']).resize(function () {
      self.onResize();
    });
    this.onResize();
  }

  public onResize() {
    let _player = $($('[data-imfx-id=' + 'imfx-video-' + this.componentRef.internalId + ']')[0]);
    let controlBarHeight = _player.find('#sub_control_bar').height();
    if (controlBarHeight > 35) {
      _player.find('#center_control_bar').css('order', 1);
    }
    else {
      _player.find('#center_control_bar').css('order', 0);
    }
    let videoHeight = _player.height();
    controlBarHeight = _player.find('.vjs-control-bar').height();
    _player.find('.vjs-control-bar .vjs-progress-control').css('borderBottomWidth', controlBarHeight + 'px');
    _player.find('video.vjs-tech').height(videoHeight - controlBarHeight - 9);
    _player.find('.imfx-big-play-btn').height(videoHeight - controlBarHeight - 9);
    _player.find('.vjs-text-track-display').height(videoHeight - controlBarHeight - 19);

    $('.player-wrapper .png-overlay').height(videoHeight - controlBarHeight - 9);
  }


}
