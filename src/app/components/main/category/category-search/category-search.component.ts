
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';


interface CategoryItem {
  id: number;
  rowNum: number;
  name: string;
  active: boolean;
  code: string;
}

@Component({
  selector: 'app-category-search',
  imports: [TableModule, CommonModule, Button, TranslateModule],
  templateUrl: './category-search.component.html',
  styleUrl: './category-search.component.scss'
})
export class CategorySearchComponent implements OnInit{

  mode: MODE_PAGE = 'search';

  

  items = [{ id:1, rowNum: 1, name:'one',avtive:false, code: '001' }]

    constructor(
        private readonly router:Router
    ) {
      this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {

    }

  openPage(page: MODE_PAGE , data?: CategoryItem) {

    sessionStorage.setItem('mode', page);

    if (page === 'create') {
        this.router.navigate(['/category-create']);
    } else if (page === 'edit' && data?.id) {

        this.router.navigate([`/category-edit/${(data.id)}`]);

    }
    }
    
    onBack() {
        this.router.navigate(['/stock-main-search']);
    }

}
