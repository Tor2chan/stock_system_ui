
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

interface CategoryItem {
  id: number;
  rowNum: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-category-manage',  
  imports: [TableModule, CommonModule, ButtonModule , ToggleSwitch, FormsModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss'
})
export class CategoryManageComponent  implements OnInit{
  
  categoryItem: CategoryItem = { id: 1, rowNum: 1, name: 'one', code: '001' };

  checked: boolean = true;
  mode: MODE_PAGE;

  item = [{ id:1, rowNum: 1, name:'one', code: '001' }]
    constructor(
      private router: Router,
    )
     
    {
        this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {
      console.log('mode:', this.mode)
    }
     onCancel() {
    this.router.navigate(['/category-search']);
  }

}
