import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.view.html',
  styleUrls: ['./staff.view.scss']
})
export class StaffView implements OnInit {

    menu = [
      {name: 'Переработки', url: 'processing'},
      {name: 'Командировки', url: 'trip'},
    ];

    constructor() { }

  ngOnInit() {
  }

}



