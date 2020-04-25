import {Injectable} from "@angular/core";
import {AbstractPlayerProvider} from "./abstract.player.provider";
import {FocusProvider} from "./focus.provider";
import {ClipsProvider} from "./clips.provider";

@Injectable()
export class HotkeysProvider extends AbstractPlayerProvider {

  private ACTIONS = {
    TOGGLE_PLAY: "space",
    BACKWAD: "j",
    FORWARD: "l",
    ADD: "m",
    REPLACE: "r",
    CLEAR: "x",
    MARK_IN: "i",
    MARK_OUT: "o"
  }
  private BTNS_IDS = {
    ADD: "#addclip",
    REPLACE: "#replaceclip",
    CLEAR: "#clearclip",
    MARK_IN: "#markin",
    MARK_OUT: "#markout",
    GO_TO_IN: "#gotoin",
    GO_TO_OUT: "#gotoout"
  }

  constructor(private focusProvider: FocusProvider,
              private clipsProvider: ClipsProvider) {
    super();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.focusProvider.isFocused) {
      if (event.key.toLowerCase() == this.ACTIONS.MARK_IN && (!$(this.BTNS_IDS.MARK_IN).attr('disabled') || !$(this.BTNS_IDS.GO_TO_IN).attr('disabled'))) {
        if (event.shiftKey) {
          this.clipsProvider.goToIn();
        } else {
          this.clipsProvider.setIn();
        }
      } else if (event.key.toLowerCase() == this.ACTIONS.MARK_OUT && (!$(this.BTNS_IDS.MARK_OUT).attr('disabled') || !$(this.BTNS_IDS.GO_TO_OUT).attr('disabled'))) {
        if (event.shiftKey) {
          this.clipsProvider.goToOut();
        } else {
          this.clipsProvider.setOut();
        }
      } else if (event.key.toLowerCase() == this.ACTIONS.ADD && !$(this.BTNS_IDS.ADD).attr('disabled')) {
        this.clipsProvider.add(false);
      } else if (event.key.toLowerCase() == this.ACTIONS.REPLACE && !$(this.BTNS_IDS.REPLACE).attr('disabled')) {
        this.clipsProvider.add(true);
      } else if (event.key.toLowerCase() == this.ACTIONS.CLEAR && !$(this.BTNS_IDS.CLEAR).attr('disabled')) {
        this.clipsProvider.clear();
      } else if (event.key.toLowerCase() == this.ACTIONS.BACKWAD) {
        this.componentRef.player.currentTime(this.componentRef.player.currentTime() - (event.shiftKey ? 10 : 1))
      } else if (event.key.toLowerCase() == this.ACTIONS.FORWARD) {
        this.componentRef.player.currentTime(this.componentRef.player.currentTime() + (event.shiftKey ? 10 : 1))
      } else if (event.code.toLowerCase() == this.ACTIONS.TOGGLE_PLAY) {
        this.componentRef.player.paused() ? this.componentRef.player.play() : this.componentRef.player.pause();
      }
    }
  }

}
