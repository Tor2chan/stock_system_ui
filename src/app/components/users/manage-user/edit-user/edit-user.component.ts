import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { MODE_PAGE } from '../../../../modules/common/common';
import { UsersData } from '../../../../models/users-data';
import { UsersService } from '../../../../services/users.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../interceptors/jwt.interceptor';



@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TranslateModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers:[MessageService]
})
export class EditUserComponent implements OnInit{
   criteria:UsersData={
   };
  
   items: UsersData[] = [];
   totalRecords:number = 0;
   rows: number = 5;

mode: MODE_PAGE = 'edit';

    page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  

  constructor( public readonly globalService:GlobalService,
             private readonly messageService:MessageService,
             private readonly usersService:UsersService,
             private readonly translate : TranslateService,
         
             private router: Router)
              {
    this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    
 
  }

   ngOnInit() {
    this.onSearch();
  }


   onSearch(event?: TablePageEvent) { 
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
      
              this.usersService.find(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
                
                  if (status === 200) {
      
                      this.items = entries as UsersData[];
                      this.totalRecords = totalRecords as number;
                     console.log('item',this.items);
                  } else {
                      this.messageService.add({
                          severity: 'error',
                          summary: this.translate.instant('common.message.exception') || 'sssss',
                          detail: this.translate.instant(message as string) || message,
                          life: 5000
                      });
                  }
              });
          }


  onBack() {
    this.router.navigate(['/stock-main-search']); 
  }
    openPage(page: MODE_PAGE , data?: UsersData) {
        
            sessionStorage.setItem('mode', page);
        
            if (page === 'create') {
                this.router.navigate(['/add-user-create']);
            } else if (page === 'edit' && data?.id) {
        
                this.router.navigate([`/add-user-edit/${(data.id)}`]);
        
            }
          }
}
