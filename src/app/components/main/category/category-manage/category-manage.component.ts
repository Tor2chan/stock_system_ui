
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
@Component({
  selector: 'app-category-manage',  
  imports: [TableModule, CommonModule, ButtonModule , ToggleSwitch, FormsModule, TranslateModule, InputTextModule, ToastModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss',
  providers: [MessageService]
})
export class CategoryManageComponent  implements OnInit{
  
  mode: MODE_PAGE;

  criteria : CategoryData =  {
    active: false
  }


    constructor(
      private router: Router,
      private categoryService: CategoryService,
      private globalService: GlobalService,
      private messageService: MessageService
    )
     
    {
        this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {
      console.log('mode:', this.mode)
    }

    onSave(){
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
        this.categoryService.createCategory(this.criteria).subscribe(({ status, message, entries }) => {
          if (status === 200) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'สำเร็จ',
                  detail: message,
                  life: 2000
                });
          } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'เกิดข้อผิดพลาด',
                  detail: message,
                  life: 2000
                });
                }
            });
      this.router.navigate(['/category-search']);

      }

    onCancel() {
      this.router.navigate(['/category-search']);
    }

}
