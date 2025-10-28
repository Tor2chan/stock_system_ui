
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryData } from '../../../../models/catagory-data';
import { CategoryService } from '../../../../services/category.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-category-manage',  
  imports: [TableModule, CommonModule, ButtonModule , ToggleSwitch, FormsModule, TranslateModule, InputTextModule, ToastModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss',
  providers: [MessageService]
})
export class CategoryManageComponent  implements OnInit{
  
  mode: MODE_PAGE;
  totalRecords:number = 0;
   rows: number = 5;
  currentTableData: CategoryData[] = [];
   items: CategoryData[] = []

  criteria : CategoryData =  {
    active:false
  }

  params: string | null = null; 

    constructor(
      private router: Router,
      private categoryService: CategoryService,
      private globalService: GlobalService,
      private messageService: MessageService,
      private route: ActivatedRoute,
      private translate: TranslateService,
      private loaderService: NgxUiLoaderService,

    )
     
    {
        this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {
      this. params = this.route.snapshot.paramMap.get('id');
      console.log("params =", this.params)
      console.log('mode:', this.mode)

      if(this.mode == 'edit'){
          this.onSearch();
      }
    }

    onSave(){
        this.loaderService.start();
        if (
            this.globalService.validate(this.criteria.name) ||
            this.globalService.validate(this.criteria.code) ||
            this.globalService.validate(this.criteria.active) 
          ){
            this.messageService.add({
                severity: 'warn',
                summary: 'เกิดข้อผิดพลาด',
                detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                life: 2000
            });
            return;
          }

          setTimeout(() => {
            this.categoryService.saveCategory(this.criteria).subscribe(({ status, message }) => {
            if (status === 200) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: message,
                    life: 2000
                    
                  });
            this.router.navigate(['/category-search']);
            this.loaderService.stop();
            } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'เกิดข้อผิดพลาด',
                    detail: message,
                    life: 2000
                  });
                  }
            this.loaderService.stop();
              });
        
          }, 1500);
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

          if(this.mode == "edit"){
              this.criteria.id = this.params !== null ? Number(this.params) : undefined;
              this.categoryService.findCategory(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
                  if (status === 200) {
                      this.criteria = structuredClone((entries ?? [])[0]);
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
        }

    onCancel() {
      this.router.navigate(['/category-search']);
    }

}
