import {Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core'
require('./silverlight/Silverlight');

@Component({
  selector: 'silverlight-player',
  templateUrl: './tpl/index.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IMFXSilverlightPlayerComponent {
  slObj: any;
  @Input() src: String;
  @Input() type: number;
  @Input() id: number;

  constructor(private cdr: ChangeDetectorRef) {
    let self = this;
    (<any>window).playerInitialised = function () {
      console.log('playerInitialised');
      self.initSlObj();
      self.loadFileEx(self.src, 0, 25); // 3rd is frame rate
    }
  }


  ngOnInit() {

  };

  initSlObj() {
    if (this.slObj != null)
      return;
    var control = document.getElementById('slHost');
    this.slObj = control;
    if (this.slObj == null)
      console.log('Unabled to initialise SL control.');
    else
      console.log ("init SL");
  }

  loadFile(file) {
    let el:any;
    el = document.getElementById('slHost');
    el && el.Content.pg.LoadFile(file);
    console.log (file + " loaded");
  }

  loadFileEx(file, som, frameRate) {
    let el:any;
    el = document.getElementById('slHost');
    el && el.Content.pg.LoadFileEx(file, som, frameRate);
    console.log (file + " ex loaded");
  }

}
