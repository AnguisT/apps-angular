import { Component } from '@angular/core';

@Component({
  selector: 'demo',
  template: `
    <div style="height: calc(100% - 80px)">
      <h1>Demo blank page</h1>
        <simple-preview-player></simple-preview-player>
    </div>
  `
})
export class DemoComponent {

}
