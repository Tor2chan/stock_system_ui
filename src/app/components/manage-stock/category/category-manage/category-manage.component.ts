
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';

@Component({
  selector: 'app-category-manage',
  imports: [TableModule, CommonModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss'
})
export class CategoryManageComponent  implements OnInit{

  mode: MODE_PAGE;

  item = [{ id:1, rowNum: 1, name:'one', code: '001' }]
    constructor()
     
    {
        this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {
      console.log('mode:', this.mode)
    }

}
