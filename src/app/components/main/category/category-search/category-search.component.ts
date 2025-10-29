
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
import { DialogModule } from 'primeng/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { concat } from 'rxjs';

@Component({
  selector: 'app-category-search',
  imports: [TableModule, CommonModule, Button, TranslateModule, DialogModule],
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

   visibleDelete = false;
   itemDelete: CategoryData = {}
    constructor(
        public readonly globalService:GlobalService,
        private readonly messageService:MessageService,
        private readonly categoryService:CategoryService,
        private readonly translate : TranslateService,
        private readonly loaderService: NgxUiLoaderService,
        private router: Router
    ) {
      this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() { 
        this.onSearch();
    }

    onSearch(event?: TablePageEvent){
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

    this.categoryService.findCategory(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
        
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
    
    onOpenDelete(item: CategoryData){
        this.visibleDelete = true;
        console.log('5555555555',item);
        this.itemDelete = structuredClone(item)
    }

    onCloseDelete(){
        this.visibleDelete = false;
    }

    onConfirmDelete(id: number){

        this.loaderService.start();
        setTimeout(() => {
        this.categoryService.deleteCategory(id).subscribe((result) => {
            if (result.status === 200) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: result.message,
                    life: 2000
                });
                this.visibleDelete = false; 
                this.onSearch();
                this.loaderService.stop();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'ไม่สำเร็จ',
                    detail: result.message,
                    life: 3000
                });
                this.loaderService.stop();
            }
        });
        }, 1500);
    }
}
