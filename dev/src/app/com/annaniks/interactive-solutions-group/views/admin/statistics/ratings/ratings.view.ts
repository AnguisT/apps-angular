import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.view.scss']
})
export class RatingsView implements OnInit {

  menu = [
      {name: 'Заказчики', url: 'customers'},
      {name: 'Клиенты', url: 'clients'},
      {name: 'Менеджеры', url: 'managers'},
      {name: 'Менеджеры ISG - пресейл', url: 'isg-managers'},
      {name: 'Сценаристы ISG - пресейл', url: 'isg-screenwriters'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
