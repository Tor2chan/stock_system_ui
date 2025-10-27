
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../services/global.service';
import { CategoryData } from '../../../../models/catagory-data';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../../../services/category.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../interceptors/jwt.interceptor';



@Component({
  selector: 'app-category-search',
  imports: [TableModule, CommonModule, Button, TranslateModule],
  standalone: true,
  templateUrl: './category-search.component.html',
  styleUrl: './category-search.component.scss',
   providers: [MessageService]
})
export class CategorySearchComponent implements OnInit{
  
   criteria:CategoryData={
   };
  
   items: CategoryData[] = [];
   totalRecords:number = 0;
   rows: number = 5;

  mode: MODE_PAGE = 'search';

  
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  

    constructor(
        public readonly globalService:GlobalService,
           private readonly messageService:MessageService,
           private readonly categoryService:CategoryService,
           private readonly translate : TranslateService,
       
           private router: Router
    ) {
      this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit(event?: TablePageEvent) { 
       if (event) {
                this.criteria.size = event.rows;
                this.criteria.first = event.first;
                if (event.rows != this.rows) {
                    this.globalService.backToFirstPage();
                }
            } else {
                this.globalService.backToFirstPage();
            }
    
            this.rows = this.criteria.size ?? 5;
    
            this.categoryService.find(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
              
                if (status === 200) {
    
                    this.items = entries as CategoryData[];
                    this.totalRecords = totalRecords as number;
                   console.log('item',this.items);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('common.message.exception') || 'kkkk',
                        detail: this.translate.instant(message as string) || message,
                        life: 5000
                    });
                }
            });
        }

  // openPage(page: MODE_PAGE , data?: CategoryItem) {

  //   sessionStorage.setItem('mode', page);

  //   if (page === 'create') {
  //       this.router.navigate(['/category-create']);
  //   } else if (page === 'edit' && data?.id) {

  //       this.router.navigate([`/category-edit/${(data.id)}`]);

  //   }
  //   }
    
    onBack() {
        this.router.navigate(['/stock-main-manage-create']);
    }


     openPage(page: MODE_PAGE , data?: CategoryData) {
      
          sessionStorage.setItem('mode', page);
      
          if (page === 'create') {
              this.router.navigate(['/category-create']);
          } else if (page === 'edit' && data?.id) {
      
              this.router.navigate([`/category-edit/${(data.id)}`]);
      
          }
        }
}
