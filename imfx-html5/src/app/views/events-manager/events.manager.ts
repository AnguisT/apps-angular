import { Component, ViewEncapsulation } from '@angular/core';

// vis
import 'style-loader!vis/dist/vis.css';
import 'style-loader!vis/dist/vis-timeline-graph2d.min.css';
import * as vis from 'vis';

@Component({
  moduleId: 'events-manager',
  selector: 'events-manageer',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class EventsManagerComponent {
  constructor() {
  }


  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.viewInit());
  }

  viewInit(): void {

    let container = document.getElementById('events-timeline');

    let componentRef = this;


    let groups = [
      { id: 1, content: 'group 1' },
      { id: 2, content: 'group 2' },
      { id: 3, content: 'group 3' },
      { id: 4, content: 'group 4' },
    ];
    let items = new vis.DataSet();

    // Configuration for the Timeline
    let options = <any> {};
    options.zoomMin = 1000 * 10; // 10 sec
    options.editable = true;
    // TODO: remove cast to any when vis typings will be updatedTimelineOptions
    (<any>options).onAdd = (item, callback) => {
      item.end = new Date(item.start.getTime() + 3600 * 1000);
      item.content = '';
      callback(item);
    };


    // Create a Timeline
    let timeline = new vis.Timeline(container, items, groups, options);

  }


}
