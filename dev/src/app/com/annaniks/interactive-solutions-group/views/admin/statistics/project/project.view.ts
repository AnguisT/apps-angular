import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './project.view.html',
  styleUrls: ['./project.view.scss']
})
export class ProjectView implements OnInit {

  menu = [
      {name: 'Поступления', url: 'income'},
      {name: 'Формат проекта', url: 'project-format'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
